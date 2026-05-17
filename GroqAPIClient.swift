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
        loadAPIKeys()
    }
    
    private func loadAPIKeys() {
        apiKeys = [
            "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",
            "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",
            "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",
            "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",
            "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",
            "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",
            "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",
            "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",
            "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",
            "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"
        ]
    }
    
    private func getNextAvailableKey() -> String? {
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
                completion(.failure(NSError(domain: "GroqAPIClient", code: -1, userInfo: [NSLocalizedDescriptionKey: "All API keys have failed"])))
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
                    self.failedKeys.insert(self.apiKeys.firstIndex(of: apiKey) ?? 0)
                    if retryCount < self.maxRetries {
                        retryCount += 1
                        attemptRequest()
                    } else {
                        completion(.failure(error))
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
                        self.failedKeys.insert(self.apiKeys.firstIndex(of: apiKey) ?? 0)
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
