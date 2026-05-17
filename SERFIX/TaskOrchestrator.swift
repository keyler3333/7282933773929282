import Foundation
import WebKit
import Combine

enum TaskState: String {
    case idle
    case planning
    case executing
    case paused
    case completed
    case failed
    case waitingForUser
}

class TaskOrchestrator: ObservableObject {
    @Published var state: TaskState = .idle
    @Published var steps: [Step] = []
    @Published var logMessages: [String] = []
    @Published var currentTask: String = ""

    let webView: WKWebView
    private var actionEngine: ActionEngine
    private var aiPlanner: AIPlanner
    private var groqClient: GroqAPIClient
    private var currentStepIndex = 0
    private var completedSteps: [Step] = []
    private var failedSteps: [Step] = []

    init() {
        let config = WKWebViewConfiguration()
        let prefs = WKPreferences()
        prefs.javaScriptCanOpenWindowsAutomatically = false
        config.preferences = prefs

        let processPool = WKProcessPool()
        config.processPool = processPool

        let dataStore = WKWebsiteDataStore.nonPersistent()
        config.websiteDataStore = dataStore

        webView = WKWebView(frame: .zero, configuration: config)
        webView.allowsBackForwardNavigationGestures = true

        groqClient = GroqAPIClient()
        aiPlanner = AIPlanner(apiClient: groqClient)
        actionEngine = ActionEngine(webView: webView)

        setupWebView()
    }

    func updateKeys(_ keys: [String]) {
        groqClient.setKeys(keys)
    }

    private func setupWebView() {
        let cspScript = """
        var meta = document.createElement('meta');
        meta.httpEquiv = 'Content-Security-Policy';
        meta.content = "default-src 'self' 'unsafe-inline' 'unsafe-eval' *; script-src 'self' 'unsafe-inline' 'unsafe-eval' *; style-src 'self' 'unsafe-inline' *";
        document.getElementsByTagName('head')[0].appendChild(meta);
        """

        let userScript = WKUserScript(source: cspScript, injectionTime: .atDocumentStart, forMainFrameOnly: false)
        webView.configuration.userContentController.addUserScript(userScript)
    }

    func executeTask(_ task: String) {
        guard state == .idle || state == .completed || state == .failed else { return }

        state = .planning
        currentTask = task
        steps.removeAll()
        completedSteps.removeAll()
        failedSteps.removeAll()
        currentStepIndex = 0
        groqClient.resetFailedKeys()

        log("Starting task: \(task)")

        aiPlanner.generateInitialPlan(task: task) { [weak self] result in
            DispatchQueue.main.async {
                switch result {
                case .success(let plannedSteps):
                    self?.steps = plannedSteps
                    self?.log("Plan created with \(plannedSteps.count) steps")
                    self?.executeNextStep()
                case .failure(let error):
                    self?.log("Planning failed: \(error.localizedDescription)")
                    self?.state = .failed
                }
            }
        }
    }

    private func executeNextStep() {
        guard currentStepIndex < steps.count else {
            state = .completed
            log("All steps completed successfully")
            return
        }

        state = .executing
        var step = steps[currentStepIndex]
        step.status = .inProgress
        steps[currentStepIndex] = step

        log("Executing: \(step.description)")

        actionEngine.executeStep(step) { [weak self] result in
            DispatchQueue.main.async {
                guard let self = self else { return }

                switch result {
                case .success(let message):
                    var updatedStep = self.steps[self.currentStepIndex]
                    updatedStep.status = .completed
                    self.steps[self.currentStepIndex] = updatedStep
                    self.completedSteps.append(updatedStep)
                    self.log("Success: \(message)")
                    self.currentStepIndex += 1

                    DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
                        self.checkIfTaskComplete()
                    }

                case .failure(let error):
                    var updatedStep = self.steps[self.currentStepIndex]
                    updatedStep.status = .failed
                    self.steps[self.currentStepIndex] = updatedStep
                    self.failedSteps.append(updatedStep)
                    self.log("Failed: \(error.localizedDescription)")
                    self.handleStepFailure()
                }
            }
        }
    }

    private func checkIfTaskComplete() {
        actionEngine.getPageSnapshot { [weak self] snapshot in
            guard let self = self else { return }

            let context = TaskContext(
                userTask: self.currentTask,
                currentURL: self.webView.url?.absoluteString ?? "",
                pageTitle: self.webView.title ?? "",
                domSnapshot: snapshot,
                completedSteps: self.completedSteps,
                failedSteps: self.failedSteps
            )

            if self.currentStepIndex >= self.steps.count {
                self.aiPlanner.generateContinuation(context: context) { [weak self] result in
                    DispatchQueue.main.async {
                        switch result {
                        case .success(let continuationSteps):
                            if continuationSteps.isEmpty {
                                self?.state = .completed
                                self?.log("Task completed")
                            } else {
                                self?.steps.append(contentsOf: continuationSteps)
                                self?.log("Added \(continuationSteps.count) continuation steps")
                                self?.executeNextStep()
                            }
                        case .failure:
                            self?.state = .completed
                            self?.log("Task likely completed")
                        }
                    }
                }
            } else {
                self.executeNextStep()
            }
        }
    }

    private func handleStepFailure() {
        state = .planning

        actionEngine.getPageSnapshot { [weak self] snapshot in
            guard let self = self else { return }

            let context = TaskContext(
                userTask: self.currentTask,
                currentURL: self.webView.url?.absoluteString ?? "",
                pageTitle: self.webView.title ?? "",
                domSnapshot: snapshot,
                completedSteps: self.completedSteps,
                failedSteps: self.failedSteps
            )

            self.aiPlanner.replanAfterFailure(context: context) { [weak self] result in
                DispatchQueue.main.async {
                    guard let self = self else { return }

                    switch result {
                    case .success(let newSteps):
                        self.log("Replanned with \(newSteps.count) new steps")
                        let endIndex = self.steps.count
                        self.steps.removeSubrange(self.currentStepIndex..<endIndex)
                        self.steps.append(contentsOf: newSteps)
                        self.executeNextStep()
                    case .failure(let error):
                        self.log("Replanning failed: \(error.localizedDescription)")
                        self.state = .waitingForUser
                    }
                }
            }
        }
    }

    func pause() {
        state = .paused
        log("Execution paused by user")
    }

    func resume() {
        guard state == .paused else { return }
        log("Resuming execution")
        executeNextStep()
    }

    func stop() {
        state = .idle
        steps.removeAll()
        completedSteps.removeAll()
        failedSteps.removeAll()
        currentStepIndex = 0
        log("Execution stopped")
    }

    func userOverride(manualAction: String) {
        log("User performed manual action: \(manualAction)")
        state = .planning

        actionEngine.getPageSnapshot { [weak self] snapshot in
            guard let self = self else { return }

            let context = TaskContext(
                userTask: self.currentTask,
                currentURL: self.webView.url?.absoluteString ?? "",
                pageTitle: self.webView.title ?? "",
                domSnapshot: snapshot,
                completedSteps: self.completedSteps,
                failedSteps: self.failedSteps
            )

            self.aiPlanner.generateContinuation(context: context) { [weak self] result in
                DispatchQueue.main.async {
                    switch result {
                    case .success(let continuationSteps):
                        self?.steps.append(contentsOf: continuationSteps)
                        self?.currentStepIndex = (self?.steps.count ?? 0) - continuationSteps.count
                        self?.executeNextStep()
                    case .failure:
                        self?.state = .waitingForUser
                    }
                }
            }
        }
    }

    private func log(_ message: String) {
        let timestamp = DateFormatter.localizedString(from: Date(), dateStyle: .none, timeStyle: .medium)
        logMessages.append("[\(timestamp)] \(message)")
    }
}
