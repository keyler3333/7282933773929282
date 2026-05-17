import Foundation

class GroqAPIClient {
    private var apiKeys: [String] = []
    private var currentKeyIndex = 0
    private let session: URLSession
    private var failedKeys: Set<Int> = []
    private let maxRetries = 3
    
    init() {
        let config = URLSessionConfiguration.default
        config.timeoutIntervalForRequest = 60
        config.timeoutIntervalForResource = 120
        session = URLSession(configuration: config)
        
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(updateKeys),
            name: .apiKeysUpdated,
            object: nil
        )
    }
    
    @objc private func updateKeys(_ notification: Notification) {
        if let keys = notification.object as? [String] {
            apiKeys = keys
            currentKeyIndex = 0
            failedKeys.removeAll()
        }
    }
    
    func setKeys(_ keys: [String]) {
        apiKeys = keys
        currentKeyIndex = 0
        failedKeys.removeAll()
    }
    
    private func getNextAvailableKey() -> String? {
        guard !apiKeys.isEmpty else { return nil }
        
        let startIndex = currentKeyIndex
        
        repeat {
            if !failedKeys.contains(currentKeyIndex) {
                let key = apiKeys[currentKeyIndex]
                currentKeyIndex = (currentKeyIndex + 1) % apiKeys.count
                return key
            }
            currentKeyIndex = (currentKeyIndex + 1) % apiKeys.count
        } while currentKeyIndex != startIndex
        
        return nil
    }
    
    func sendPrompt(messages: [[String: String]], completion: @escaping (Result<String, Error>) -> Void) {
        var retryCount = 0
        
        func attemptRequest() {
            guard let apiKey = getNextAvailableKey() else {
                completion(.failure(NSError(domain: "GroqAPIClient", code: -1, userInfo: [NSLocalizedDescriptionKey: "No API keys configured. Please add keys in Settings."])))
                return
            }
            
            let url = URL(string: "https://api.groq.com/openai/v1/chat/completions")!
            var request = URLRequest(url: url)
            request.httpMethod = "POST"
            request.setValue("Bearer \(apiKey)", forHTTPHeaderField: "Authorization")
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
            
            let body: [String: Any] = [
                "model": "llama-3.3-70b-versatile",
                "messages": messages,
                "temperature": 0.7,
                "max_tokens": 4096,
                "top_p": 1,
                "stream": false
            ]
            
            request.httpBody = try? JSONSerialization.data(withJSONObject: body)
            
            session.dataTask(with: request) { [weak self] data, response, error in
                guard let self = self else { return }
                
                if let error = error {
                    if let keyIndex = self.apiKeys.firstIndex(of: apiKey) {
                        self.failedKeys.insert(keyIndex)
                    }
                    if retryCount < self.maxRetries {
                        retryCount += 1
                        attemptRequest()
                    } else {
                        completion(.failure(error))
                    }
                    return
                }
                
                if let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 429 {
                    if let keyIndex = self.apiKeys.firstIndex(of: apiKey) {
                        self.failedKeys.insert(keyIndex)
                    }
                    if retryCount < self.maxRetries * self.apiKeys.count {
                        retryCount += 1
                        attemptRequest()
                    } else {
                        completion(.failure(NSError(domain: "GroqAPIClient", code: 429, userInfo: [NSLocalizedDescriptionKey: "Rate limited on all keys. Please wait or add more keys."])))
                    }
                    return
                }
                
                guard let data = data else {
                    completion(.failure(NSError(domain: "GroqAPIClient", code: -2, userInfo: [NSLocalizedDescriptionKey: "No data received"])))
                    return
                }
                
                do {
                    if let json = try JSONSerialization.jsonObject(with: data) as? [String: Any],
                       let choices = json["choices"] as? [[String: Any]],
                       let firstChoice = choices.first,
                       let message = firstChoice["message"] as? [String: Any],
                       let content = message["content"] as? String {
                        completion(.success(content))
                    } else {
                        if let keyIndex = self.apiKeys.firstIndex(of: apiKey) {
                            self.failedKeys.insert(keyIndex)
                        }
                        if retryCount < self.maxRetries {
                            retryCount += 1
                            attemptRequest()
                        } else {
                            completion(.failure(NSError(domain: "GroqAPIClient", code: -3, userInfo: [NSLocalizedDescriptionKey: "Invalid response format"])))
                        }
                    }
                } catch {
                    completion(.failure(error))
                }
            }.resume()
        }
        
        attemptRequest()
    }
    
    func resetFailedKeys() {
        failedKeys.removeAll()
    }
}
