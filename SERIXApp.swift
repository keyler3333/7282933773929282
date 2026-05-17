import SwiftUI

@main
struct SERIXApp: App {
    @StateObject private var orchestrator = TaskOrchestrator()
    @StateObject private var settingsManager = SettingsManager()
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(orchestrator)
                .environmentObject(settingsManager)
        }
    }
}
