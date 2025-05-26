package expo.modules.milibris

import com.milibris.onereader.data.session.ReaderListener
import expo.modules.kotlin.Promise
import android.util.Log

class ExpoMilibrisReaderListener(private val promise: Promise) : ReaderListener {
    
    override fun onCloseButtonClickListener() {
        Log.d("ExpoMilibris", "Reader close button clicked")
        promise.resolve(mapOf("event" to "closed"))
    }
    
    override fun onIssueRead() {
        Log.d("ExpoMilibris", "Issue read")
    }
    
    override fun onIssuePageRead(pageNumber: Int, isCalledFromArticles: Boolean) {
        Log.d("ExpoMilibris", "Page read: $pageNumber")
    }
}
