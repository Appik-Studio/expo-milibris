import MiLibrisReaderSDK
import ExpoModulesCore
import Foundation

public class ExpoMilibrisModule: Module {
    private var currentPromise: Promise?
    private var currentReader: Reader?

    public func definition() -> ModuleDefinition {
        Name("ExpoMilibris")

        AsyncFunction("openReader") { [weak self] (options: [String: Any], promise: Promise) in
            self?.handleOpenReader(options: options, promise: promise)
        }

        Function("setLogLevel") { (level: String) in
            self.setLogLevel(level: level)
        }

        AsyncFunction("downloadAndUnpackArchive") { [weak self] (ticketUrl: String, destinationPath: String, promise: Promise) in
            self?.handleDownloadAndUnpack(ticketUrl: ticketUrl, destinationPath: destinationPath, promise: promise)
        }
    }

    private func handleOpenReader(options: [String: Any], promise: Promise) {
        currentPromise = promise

        DispatchQueue.main.async {
            guard let presentingController = self.getPresentingController() else {
                promise.reject("MILIBRIS_ERROR", "ViewController doesn't exist")
                return
            }

            do {
                let reader = try self.createReader(from: options)
                self.currentReader = reader
                reader.delegate = self
                reader.presentReaderViewController(from: presentingController)
            } catch {
                promise.reject("MILIBRIS_ERROR", error.localizedDescription)
            }
        }
    }

    private func getPresentingController() -> UIViewController? {
        guard let scene = UIApplication.shared.connectedScenes.first(where: { $0.activationState == .foregroundActive }) as? UIWindowScene,
              let window = scene.windows.first(where: { $0.isKeyWindow })
        else {
            return nil
        }
        return window.rootViewController
    }

    private func createReader(from options: [String: Any]) throws -> Reader {
        guard let releasePathString = options["releasePath"] as? String else {
            throw NSError(domain: "ExpoMilibris", code: 1, userInfo: [NSLocalizedDescriptionKey: "releasePath is required"])
        }

        let releasePath = URL(fileURLWithPath: releasePathString)
        let languageCode = options["articlesLanguageCode"] as? String ?? "en-US"
        
        let reader: Reader
        switch languageCode {
        case "fr-FR": reader = Reader(releasePath: releasePath, articlesLanguageCode: .frFR)
        case "es-ES": reader = Reader(releasePath: releasePath, articlesLanguageCode: .esES)
        case "it-IT": reader = Reader(releasePath: releasePath, articlesLanguageCode: .itIT)
        default: reader = Reader(releasePath: releasePath, articlesLanguageCode: .enUS)
        }

        if let config = options["config"] as? [String: Any] {
            applyReaderConfig(reader: reader, config: config)
        }

        return reader
    }

    private func applyReaderConfig(reader: Reader, config: [String: Any]) {
        if let features = config["features"] as? [String: Any] {
            if let printEnabled = features["printEnabled"] as? Bool {
                reader.config.features.printPageEnabled = printEnabled
            }
            if let textToSpeechEnabled = features["textToSpeechEnabled"] as? Bool {
                reader.config.articleReader.features.isTextToSpeechEnabled = textToSpeechEnabled
            }
        }

        if let targetPageNumber = config["targetPageNumber"] as? Int {
            reader.initialPageNumber = targetPageNumber
        }
    }

    private func setLogLevel(level: String) {
        switch level {
        case "debug":
            Logger.minLogLevel = .debug
        case "info":
            Logger.minLogLevel = .info
        case "warning":
            Logger.minLogLevel = .warning
        case "error":
            Logger.minLogLevel = .error
        default:
            Logger.minLogLevel = .warning
        }
    }

    private func handleDownloadAndUnpack(ticketUrl: String, destinationPath: String, promise: Promise) {
        DispatchQueue.global(qos: .background).async {
            do {
                let url = URL(string: ticketUrl)!
                let data = try Data(contentsOf: url)
                
                let destinationURL = URL(fileURLWithPath: destinationPath)
                try data.write(to: destinationURL)
                
                DispatchQueue.main.async {
                    promise.resolve(destinationPath)
                }
            } catch {
                DispatchQueue.main.async {
                    promise.reject("DOWNLOAD_ERROR", error.localizedDescription)
                }
            }
        }
    }

    private func resolveReader(status: String, data: [String: Any] = [:]) {
        currentPromise?.resolve([
            "status": status,
            "data": data
        ])
        currentPromise = nil
        currentReader = nil
    }
}

extension ExpoMilibrisModule: ReaderDelegate {
    public func readerViewController(_ readerViewController: UIViewController, didMoveToPageNumbers pageNumbers: [Int]) {
    }

    public func didDismissReaderViewController(_ readerViewController: UIViewController) {
        resolveReader(status: "success", data: [:])
    }

    public func readerViewControllerDidAppear(_ readerViewController: UIViewController) {
    }

    public func readerViewController(_ readerViewController: UIViewController, didEncounterError error: Error) {
        resolveReader(status: "error", data: ["error": error.localizedDescription])
    }
} 