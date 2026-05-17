import WebKit
import Foundation

class ActionEngine: NSObject {
    private weak var webView: WKWebView?
    private var completionHandler: ((Result<String, Error>) -> Void)?
    
    init(webView: WKWebView) {
        self.webView = webView
        super.init()
        webView.configuration.userContentController.add(self, name: "serixCallback")
    }
    
    func executeStep(_ step: Step, completion: @escaping (Result<String, Error>) -> Void) {
        self.completionHandler = completion
        
        switch step.action.lowercased() {
        case "navigate":
            if let urlString = step.value, let url = URL(string: urlString) {
                let request = URLRequest(url: url)
                webView?.load(request)
                completion(.success("Navigated to \(urlString)"))
            } else {
                completion(.failure(NSError(domain: "ActionEngine", code: -1, userInfo: [NSLocalizedDescriptionKey: "Invalid URL for navigation"])))
            }
            
        case "click":
            let script = """
            (function() {
                try {
                    const element = document.querySelector('\(step.selector ?? "")');
                    if (!element) return JSON.stringify({error: 'Element not found'});
                    element.click();
                    return JSON.stringify({success: true, action: 'click'});
                } catch(e) {
                    return JSON.stringify({error: e.message});
                }
            })();
            """
            evaluateAndCallback(script: script)
            
        case "type":
            let script = """
            (function() {
                try {
                    const element = document.querySelector('\(step.selector ?? "")');
                    if (!element) return JSON.stringify({error: 'Element not found'});
                    element.focus();
                    element.value = '\(step.value ?? "")';
                    element.dispatchEvent(new Event('input', { bubbles: true }));
                    element.dispatchEvent(new Event('change', { bubbles: true }));
                    return JSON.stringify({success: true, action: 'type'});
                } catch(e) {
                    return JSON.stringify({error: e.message});
                }
            })();
            """
            evaluateAndCallback(script: script)
            
        case "scroll":
            let script = """
            (function() {
                try {
                    if ('\(step.selector ?? "")') {
                        const element = document.querySelector('\(step.selector ?? "")');
                        if (element) element.scrollIntoView({behavior: 'smooth', block: 'center'});
                    } else {
                        window.scrollTo(0, \(step.value ?? "0"));
                    }
                    return JSON.stringify({success: true, action: 'scroll'});
                } catch(e) {
                    return JSON.stringify({error: e.message});
                }
            })();
            """
            evaluateAndCallback(script: script)
            
        case "extract":
            let script = """
            (function() {
                try {
                    const extractData = {
                        title: document.title,
                        url: window.location.href,
                        text: document.body.innerText.substring(0, 5000),
                        links: Array.from(document.querySelectorAll('a')).slice(0, 50).map(a => ({
                            text: a.innerText.trim(),
                            href: a.href
                        }))
                    };
                    return JSON.stringify({success: true, action: 'extract', data: extractData});
                } catch(e) {
                    return JSON.stringify({error: e.message});
                }
            })();
            """
            evaluateAndCallback(script: script)
            
        case "wait":
            let delay = Int(step.value ?? "2") ?? 2
            DispatchQueue.main.asyncAfter(deadline: .now() + .seconds(delay)) {
                completion(.success("Waited \(delay) seconds"))
            }
            
        case "submit":
            let script = """
            (function() {
                try {
                    const element = document.querySelector('\(step.selector ?? "form")');
                    if (!element) return JSON.stringify({error: 'Element not found'});
                    element.submit();
                    return JSON.stringify({success: true, action: 'submit'});
                } catch(e) {
                    return JSON.stringify({error: e.message});
                }
            })();
            """
            evaluateAndCallback(script: script)
            
        case "select":
            let script = """
            (function() {
                try {
                    const element = document.querySelector('\(step.selector ?? "")');
                    if (!element) return JSON.stringify({error: 'Element not found'});
                    element.value = '\(step.value ?? "")';
                    element.dispatchEvent(new Event('change', { bubbles: true }));
                    return JSON.stringify({success: true, action: 'select'});
                } catch(e) {
                    return JSON.stringify({error: e.message});
                }
            })();
            """
            evaluateAndCallback(script: script)
            
        default:
            completion(.failure(NSError(domain: "ActionEngine", code: -2, userInfo: [NSLocalizedDescriptionKey: "Unknown action: \(step.action)"])))
        }
    }
    
    private func evaluateAndCallback(script: String) {
        webView?.evaluateJavaScript(script) { [weak self] result, error in
            if let error = error {
                self?.completionHandler?(.failure(error))
            } else if let resultString = result as? String {
                self?.completionHandler?(.success(resultString))
            } else {
                self?.completionHandler?(.failure(NSError(domain: "ActionEngine", code: -3, userInfo: [NSLocalizedDescriptionKey: "Unexpected result type"])))
            }
        }
    }
    
    func getPageSnapshot(completion: @escaping (String) -> Void) {
        let script = """
        (function() {
            try {
                const snapshot = {
                    url: window.location.href,
                    title: document.title,
                    body: document.body.innerText.substring(0, 3000),
                    forms: Array.from(document.querySelectorAll('form')).map(f => ({
                        action: f.action,
                        inputs: Array.from(f.querySelectorAll('input, select, textarea')).map(i => ({
                            name: i.name,
                            type: i.type,
                            tag: i.tagName.toLowerCase()
                        }))
                    })),
                    buttons: Array.from(document.querySelectorAll('button, input[type="submit"], a.button')).slice(0, 20).map(b => ({
                        text: b.innerText || b.value,
                        selector: b.tagName.toLowerCase() + (b.id ? '#' + b.id : '') + (b.className ? '.' + b.className.split(' ').join('.') : '')
                    })),
                    links: Array.from(document.querySelectorAll('a[href]')).slice(0, 30).map(a => ({
                        text: a.innerText.trim().substring(0, 100),
                        href: a.href
                    }))
                };
                return JSON.stringify(snapshot);
            } catch(e) {
                return JSON.stringify({error: e.message});
            }
        })();
        """
        
        webView?.evaluateJavaScript(script) { result, _ in
            if let snapshot = result as? String {
                completion(snapshot)
            } else {
                completion("{}")
            }
        }
    }
}

extension ActionEngine: WKScriptMessageHandler {
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        if message.name == "serixCallback", let body = message.body as? String {
            completionHandler?(.success(body))
        }
    }
}
