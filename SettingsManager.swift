import Foundation
import Security
import Combine

class SettingsManager: ObservableObject {
    @Published var apiKeys: [String] = []
    @Published var hasValidKeys: Bool = false

    private let keychainService = "com.serix.groqkeys"
    private let maxKeys = 10

    init() {
        loadKeys()
    }

    func addKey(_ key: String) {
        guard apiKeys.count < maxKeys else { return }
        guard !key.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else { return }
        guard key.hasPrefix("gsk_") else { return }
        guard !apiKeys.contains(key) else { return }

        let trimmedKey = key.trimmingCharacters(in: .whitespacesAndNewlines)
        apiKeys.append(trimmedKey)
        saveKeys()
    }

    func removeKey(at index: Int) {
        guard index < apiKeys.count else { return }
        apiKeys.remove(at: index)
        saveKeys()
    }

    func removeAllKeys() {
        apiKeys.removeAll()
        saveKeys()
    }

    private func saveKeys() {
        let keysData = apiKeys.joined(separator: ",").data(using: .utf8)

        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: keychainService,
            kSecAttrAccount as String: "groq_api_keys",
        ]

        SecItemDelete(query as CFDictionary)

        guard let data = keysData else { return }

        var attributes = query
        attributes[kSecValueData as String] = data
        attributes[kSecAttrAccessible as String] = kSecAttrAccessibleWhenUnlockedThisDeviceOnly

        SecItemAdd(attributes as CFDictionary, nil)

        hasValidKeys = !apiKeys.isEmpty
        notifyOrchestrator()
    }

    private func loadKeys() {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: keychainService,
            kSecAttrAccount as String: "groq_api_keys",
            kSecReturnData as String: true,
            kSecMatchLimit as String: kSecMatchLimitOne,
        ]

        var item: CFTypeRef?
        let status = SecItemCopyMatching(query as CFDictionary, &item)

        guard status == errSecSuccess, let data = item as? Data else {
            hasValidKeys = false
            return
        }

        if let keysString = String(data: data, encoding: .utf8) {
            apiKeys = keysString.components(separatedBy: ",").filter { !$0.isEmpty }
            hasValidKeys = !apiKeys.isEmpty
        }
    }

    private func notifyOrchestrator() {
        NotificationCenter.default.post(name: .apiKeysUpdated, object: apiKeys)
    }
}

extension Notification.Name {
    static let apiKeysUpdated = Notification.Name("apiKeysUpdated")
}
