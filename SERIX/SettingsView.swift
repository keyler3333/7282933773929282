import SwiftUI

struct SettingsView: View {
    @EnvironmentObject var settingsManager: SettingsManager
    @State private var newKey: String = ""
    @State private var showAlert = false
    @State private var alertMessage = ""
    @Environment(\.dismiss) var dismiss
    
    var body: some View {
        NavigationView {
            List {
                Section {
                    HStack {
                        TextField("Enter Groq API Key (gsk_...)", text: $newKey)
                            .textFieldStyle(RoundedBorderTextFieldStyle())
                            .autocapitalization(.none)
                            .disableAutocorrection(true)
                        
                        Button("Add") {
                            addKey()
                        }
                        .disabled(newKey.isEmpty || settingsManager.apiKeys.count >= 10)
                    }
                } header: {
                    Text("Add New Key")
                } footer: {
                    Text("Keys are stored securely in Keychain. Maximum 10 keys.")
                }
                
                Section {
                    if settingsManager.apiKeys.isEmpty {
                        Text("No keys configured")
                            .foregroundColor(.secondary)
                    } else {
                        ForEach(Array(settingsManager.apiKeys.enumerated()), id: \.offset) { index, key in
                            HStack {
                                VStack(alignment: .leading) {
                                    Text("Key \(index + 1)")
                                        .font(.headline)
                                    Text(maskKey(key))
                                        .font(.caption)
                                        .foregroundColor(.secondary)
                                }
                                
                                Spacer()
                                
                                Button(role: .destructive) {
                                    settingsManager.removeKey(at: index)
                                } label: {
                                    Image(systemName: "trash")
                                }
                            }
                        }
                    }
                } header: {
                    Text("Your API Keys (\(settingsManager.apiKeys.count)/10)")
                }
                
                Section {
                    Button(role: .destructive) {
                        settingsManager.removeAllKeys()
                    } label: {
                        HStack {
                            Spacer()
                            Text("Remove All Keys")
                            Spacer()
                        }
                    }
                    .disabled(settingsManager.apiKeys.isEmpty)
                }
                
                Section {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("How to get Groq API Keys")
                            .font(.headline)
                        Text("1. Visit console.groq.com")
                        Text("2. Sign up or log in")
                        Text("3. Navigate to API Keys section")
                        Text("4. Create a new API key")
                        Text("5. Copy and paste it here")
                        Text("Keys always start with 'gsk_'")
                            .foregroundColor(.secondary)
                    }
                    .font(.caption)
                } header: {
                    Text("Help")
                }
            }
            .navigationTitle("Settings")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
        }
        .alert("Settings", isPresented: $showAlert) {
            Button("OK") {}
        } message: {
            Text(alertMessage)
        }
    }
    
    private func addKey() {
        let trimmed = newKey.trimmingCharacters(in: .whitespacesAndNewlines)
        
        guard trimmed.hasPrefix("gsk_") else {
            alertMessage = "Invalid API key format. Keys should start with 'gsk_'"
            showAlert = true
            return
        }
        
        guard settingsManager.apiKeys.count < 10 else {
            alertMessage = "Maximum 10 keys allowed"
            showAlert = true
            return
        }
        
        guard !settingsManager.apiKeys.contains(trimmed) else {
            alertMessage = "This key is already added"
            showAlert = true
            return
        }
        
        settingsManager.addKey(trimmed)
        newKey = ""
        alertMessage = "API key added successfully"
        showAlert = true
    }
    
    private func maskKey(_ key: String) -> String {
        guard key.count > 12 else { return String(repeating: "*", count: key.count) }
        let prefix = String(key.prefix(7))
        let suffix = String(key.suffix(4))
        return "\(prefix)...\(suffix)"
    }
}
