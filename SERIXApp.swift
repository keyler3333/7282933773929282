import SwiftUI

@main
struct SERIXApp: App {
    @StateObject private var orchestrator = TaskOrchestrator()
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(orchestrator)
        }
    }
}
