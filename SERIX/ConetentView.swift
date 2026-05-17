import SwiftUI

struct ContentView: View {
    @EnvironmentObject var orchestrator: TaskOrchestrator
    @EnvironmentObject var settingsManager: SettingsManager
    @State private var taskInput: String = ""
    @State private var showSettings = false
    
    var body: some View {
        VStack(spacing: 0) {
            WebViewContainer(webView: orchestrator.webView)
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            
            VStack(spacing: 8) {
                ScrollView {
                    VStack(alignment: .leading, spacing: 4) {
                        ForEach(orchestrator.steps) { step in
                            HStack {
                                Circle()
                                    .fill(stepColor(step.status))
                                    .frame(width: 8, height: 8)
                                Text(step.description)
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                            }
                        }
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.horizontal)
                }
                .frame(height: 100)
                
                ScrollView {
                    VStack(alignment: .leading, spacing: 2) {
                        ForEach(orchestrator.logMessages.suffix(10), id: \.self) { log in
                            Text(log)
                                .font(.system(size: 10, design: .monospaced))
                                .foregroundColor(.green)
                        }
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.horizontal)
                }
                .frame(height: 80)
                .background(Color.black.opacity(0.9))
                
                HStack(spacing: 8) {
                    Button {
                        showSettings = true
                    } label: {
                        Image(systemName: "gear")
                            .font(.title3)
                    }
                    .buttonStyle(.bordered)
                    
                    TextField("What should SERIX do?", text: $taskInput)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .disabled(orchestrator.state == .executing || orchestrator.state == .planning)
                    
                    switch orchestrator.state {
                    case .idle, .completed, .failed:
                        Button("Execute") {
                            orchestrator.executeTask(taskInput)
                            taskInput = ""
                        }
                        .buttonStyle(.borderedProminent)
                        .disabled(taskInput.isEmpty || !settingsManager.hasValidKeys)
                        
                    case .executing:
                        Button("Pause") {
                            orchestrator.pause()
                        }
                        .buttonStyle(.bordered)
                        
                    case .paused:
                        Button("Resume") {
                            orchestrator.resume()
                        }
                        .buttonStyle(.borderedProminent)
                        
                        Button("Stop") {
                            orchestrator.stop()
                        }
                        .buttonStyle(.bordered)
                        .tint(.red)
                        
                    case .planning:
                        ProgressView()
                            .padding(.horizontal)
                        
                    case .waitingForUser:
                        Button("Continue") {
                            orchestrator.userOverride(manualAction: "User manually completed action")
                        }
                        .buttonStyle(.borderedProminent)
                    }
                }
                .padding()
            }
            .background(Color(.systemBackground))
        }
        .sheet(isPresented: $showSettings) {
            SettingsView()
        }
        .statusBar(hidden: false)
        .onAppear {
            orchestrator.updateKeys(settingsManager.apiKeys)
        }
        .onChange(of: settingsManager.apiKeys) { newKeys in
            orchestrator.updateKeys(newKeys)
        }
    }
    
    func stepColor(_ status: Step.StepStatus) -> Color {
        switch status {
        case .pending: return .gray
        case .inProgress: return .blue
        case .completed: return .green
        case .failed: return .red
        }
    }
}
