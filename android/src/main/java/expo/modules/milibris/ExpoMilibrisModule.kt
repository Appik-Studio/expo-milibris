package expo.modules.milibris

import android.content.Intent
import androidx.lifecycle.LifecycleOwner
import com.milibris.foundation.CompleteArchive
import com.milibris.foundation.Foundation
import com.milibris.onereader.data.session.ReaderSettings
import com.milibris.onereader.feature.OneReaderActivity
import com.milibris.reader.XmlPdfReaderDataSource

import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.io.File
import java.net.URL
import android.util.Log

class ExpoMilibrisModule : Module() {
    private var currentPromise: Promise? = null

    override fun definition() = ModuleDefinition {
        Name("ExpoMilibris")

        AsyncFunction("openReader") { options: Map<String, Any>, promise: Promise ->
            handleOpenReader(options, promise)
        }

        Function("setLogLevel") { level: String ->
            setLogLevel(level)
        }

        AsyncFunction("downloadAndUnpackArchive") { ticketUrl: String, destinationPath: String, promise: Promise ->
            handleDownloadAndUnpack(ticketUrl, destinationPath, promise)
        }
    }

    private fun handleOpenReader(options: Map<String, Any>, promise: Promise) {
        currentPromise = promise

        val activity = appContext.currentActivity ?: run {
            promise.reject("MILIBRIS_ERROR", "Activity doesn't exist", null)
            return
        }

        try {
            val releasePath = options["releasePath"] as? String
                ?: throw IllegalArgumentException("releasePath is required")

            val readerSettings = createReaderSettings(options)
            val productRepo = XmlPdfReaderDataSource(readerSettings)
            productRepo.init(activity.applicationContext, releasePath)

            val issueId = options["issueId"] as? String ?: "default-issue"
            val coverImageUrl = options["coverImageUrl"] as? String
            val coverRatio = options["coverRatio"] as? Double ?: 1.0

            val intent = OneReaderActivity.newIntent(
                context = activity,
                readerSettings = readerSettings,
                productRepository = productRepo,
                readerListener = ExpoMilibrisReaderListener(promise),
                searchProvider = null,
                sharedElementImageUrl = coverImageUrl,
                sharedElementRatio = coverRatio.toFloat()
            )

            activity.startActivity(intent)

        } catch (e: Exception) {
            Log.e("ExpoMilibris", "Error opening reader", e)
            promise.reject("MILIBRIS_ERROR", e.message, e)
        }
    }

    private fun createReaderSettings(options: Map<String, Any>): ReaderSettings {
        val readerSettings = ReaderSettings()

        val config = options["config"] as? Map<String, Any>
        config?.let { configMap ->
            val features = configMap["features"] as? Map<String, Any>
            features?.let { featuresMap ->
                featuresMap["printEnabled"]?.let { 
                    readerSettings.isPrintEnabled = it as Boolean 
                }
                featuresMap["textToSpeechEnabled"]?.let { 
                    readerSettings.textToSpeechEnabled = it as Boolean 
                }
                featuresMap["shareEnabled"]?.let { 
                    readerSettings.shareEnabled = it as Boolean 
                }
                featuresMap["summaryEnabled"]?.let { 
                    readerSettings.isSummaryEnabled = it as Boolean 
                }
                featuresMap["summaryImagesEnabled"]?.let { 
                    readerSettings.enableSummaryImages = it as Boolean 
                }
                featuresMap["faceCropEnabled"]?.let { 
                    readerSettings.isFaceCropEnabled = it as Boolean 
                }
            }

            configMap["targetPageNumber"]?.let { 
                readerSettings.targetPageNumber = (it as Number).toInt() 
            }
            configMap["debugBoxes"]?.let { 
                readerSettings.debugBoxes = it as Boolean 
            }
        }

        return readerSettings
    }

    private fun setLogLevel(level: String) {
        Log.d("ExpoMilibris", "Setting log level to: $level")
    }

    private fun handleDownloadAndUnpack(ticketUrl: String, destinationPath: String, promise: Promise) {
        Thread {
            try {
                val url = URL(ticketUrl)
                val inputStream = url.openStream()
                
                val foundationContext = Foundation.createContext(appContext.reactContext)
                val tempFile = File.createTempFile("milibris_archive", ".zip")
                tempFile.outputStream().use { output ->
                    inputStream.copyTo(output)
                }
                
                val archive = CompleteArchive(foundationContext, tempFile)
                val destinationFile = File(destinationPath)
                archive.unpackTo(destinationFile)
                
                tempFile.delete()
                promise.resolve(destinationPath)
            } catch (e: Exception) {
                Log.e("ExpoMilibris", "Error downloading and unpacking archive", e)
                promise.reject("DOWNLOAD_ERROR", e.message, e)
            }
        }.start()
    }
} 