import Foundation

struct Step: Codable, Identifiable {
    let id: String
    let action: String
    let selector: String?
    let value: String?
    let description: String
    var status: StepStatus
    
    enum StepStatus: String, Codable {
        case pending
        case inProgress
        case completed
        case failed
    }
    
    init(id: String = UUID().uuidString, action: String, selector: String? = nil, value: String? = nil, description: String, status: StepStatus = .pending) {
        self.id = id
        self.action = action
        self.selector = selector
        self.value = value
        self.description = description
        self.status = status
    }
}

struct TaskContext {
    let userTask: String
    let currentURL: String
    let pageTitle: String
    let domSnapshot: String
    let completedSteps: [Step]
    let failedSteps: [Step]
}

class AIPlanner {
    private let apiClient: GroqAPIClient
    private var conversationHistory: [[String: String]] = []
    
    init(apiClient: GroqAPIClient) {
        self.apiClient = apiClient
    }
    
    func generateInitialPlan(task: String, completion: @escaping (Result<[Step], Error>) -> Void) {
        conversationHistory = [
            ["role": "system", "content": """
            You are SERIX, an autonomous web agent. Your job is to break down user tasks into specific browser action steps.
            For each step, provide:
            1. action: click, type, scroll, navigate, extract, wait, submit, select
            2. selector: CSS selector or XPath to target element
            3. value: text to type or URL to navigate to
            4. description: human-readable description of what this step does
            
            Return ONLY a valid JSON array of step objects. No markdown, no explanations.
            Example: [{"action":"navigate","value":"https://google.com","description":"Go to Google"},{"action":"type","selector":"input[name='q']","value":"weather today","description":"Type search query"}]
            """],
            ["role": "user", "content": "Task: \(task)\nGenerate a complete plan as a JSON array of steps."]
        ]
        
        apiClient.sendPrompt(messages: conversationHistory) { result in
            switch result {
            case .success(let response):
                self.conversationHistory.append(["role": "assistant", "content": response])
                if let steps = self.parseSteps(from: response) {
                    completion(.success(steps))
                } else {
                    completion(.failure(NSError(domain: "AIPlanner", code: -1, userInfo: [NSLocalizedDescriptionKey: "Failed to parse steps from AI response"])))
                }
            case .failure(let error):
                completion(.failure(error))
            }
        }
    }
    
    func replanAfterFailure(context: TaskContext, completion: @escaping (Result<[Step], Error>) -> Void) {
        let contextPrompt = """
        Current state:
        URL: \(context.currentURL)
        Title: \(context.pageTitle)
        Page snapshot: \(context.domSnapshot)
        
        Completed steps: \(context.completedSteps.map { $0.description }.joined(separator: ", "))
        Failed steps: \(context.failedSteps.map { $0.description }.joined(separator: ", "))
        
        Original task: \(context.userTask)
        """
        
        conversationHistory.append(["role": "user", "content": contextPrompt])
        conversationHistory.append(["role": "user", "content": "Previous step failed. Provide a new JSON array of steps to continue the task."])
        
        apiClient.sendPrompt(messages: conversationHistory) { result in
            switch result {
            case .success(let response):
                self.conversationHistory.append(["role": "assistant", "content": response])
                if let steps = self.parseSteps(from: response) {
                    completion(.success(steps))
                } else {
                    completion(.failure(NSError(domain: "AIPlanner", code: -2, userInfo: [NSLocalizedDescriptionKey: "Failed to parse replan response"])))
                }
            case .failure(let error):
                completion(.failure(error))
            }
        }
    }
    
    func generateContinuation(context: TaskContext, completion: @escaping (Result<[Step], Error>) -> Void) {
        let continuationPrompt = """
        Resume task execution:
        URL: \(context.currentURL)
        Title: \(context.pageTitle)
        Page snapshot: \(context.domSnapshot)
        
        Original task: \(context.userTask)
        Completed: \(context.completedSteps.map { $0.description }.joined(separator: ", "))
        
        Provide next steps as JSON array to continue the task.
        """
        
        conversationHistory.append(["role": "user", "content": continuationPrompt])
        
        apiClient.sendPrompt(messages: conversationHistory) { result in
            switch result {
            case .success(let response):
                self.conversationHistory.append(["role": "assistant", "content": response])
                if let steps = self.parseSteps(from: response) {
                    completion(.success(steps))
                } else {
                    completion(.failure(NSError(domain: "AIPlanner", code: -3, userInfo: [NSLocalizedDescriptionKey: "Failed to parse continuation"])))
                }
            case .failure(let error):
                completion(.failure(error))
            }
        }
    }
    
    private func parseSteps(from response: String) -> [Step]? {
        let cleanedResponse = response
            .replacingOccurrences(of: "```json", with: "")
            .replacingOccurrences(of: "```", with: "")
            .trimmingCharacters(in: .whitespacesAndNewlines)
        
        guard let data = cleanedResponse.data(using: .utf8) else { return nil }
        
        do {
            let decoder = JSONDecoder()
            return try decoder.decode([Step].self, from: data)
        } catch {
            return nil
        }
    }
}
