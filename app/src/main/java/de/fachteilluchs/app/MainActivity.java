package de.fachteilluchs.app;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

public class MainActivity extends Activity {
    private static final int REQUEST_IMPORT_FILE = 1001;
    private static final int REQUEST_EXPORT_FILE = 1002;

    private WebView webView;
    private ValueCallback<Uri[]> filePathCallback;
    private String pendingExportText;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        webView = new WebView(this);
        webView.setBackgroundColor(Color.rgb(7, 20, 38));
        webView.setWebViewClient(new WebViewClient());
        webView.setWebChromeClient(new FachteilWebChromeClient());

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setDatabaseEnabled(true);
        settings.setMediaPlaybackRequiresUserGesture(false);

        webView.addJavascriptInterface(new AndroidBridge(), "AndroidBridge");
        setContentView(webView);
        webView.loadUrl("file:///android_asset/index.html");
    }

    private final class FachteilWebChromeClient extends WebChromeClient {
        @Override
        public boolean onShowFileChooser(
                WebView webView,
                ValueCallback<Uri[]> filePathCallback,
                FileChooserParams fileChooserParams) {

            if (MainActivity.this.filePathCallback != null) {
                MainActivity.this.filePathCallback.onReceiveValue(null);
            }
            MainActivity.this.filePathCallback = filePathCallback;

            Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
            intent.addCategory(Intent.CATEGORY_OPENABLE);
            intent.setType("application/json");
            try {
                startActivityForResult(intent, REQUEST_IMPORT_FILE);
                return true;
            } catch (Exception e) {
                MainActivity.this.filePathCallback = null;
                Toast.makeText(MainActivity.this, "Dateiauswahl konnte nicht geöffnet werden.", Toast.LENGTH_SHORT).show();
                return false;
            }
        }
    }

    private final class AndroidBridge {
        @JavascriptInterface
        public void saveTextFile(String fileName, String text) {
            runOnUiThread(() -> {
                pendingExportText = text;
                Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                intent.setType("application/json");
                intent.putExtra(Intent.EXTRA_TITLE, fileName);
                try {
                    startActivityForResult(intent, REQUEST_EXPORT_FILE);
                } catch (Exception e) {
                    pendingExportText = null;
                    Toast.makeText(MainActivity.this, "Speicherort konnte nicht geöffnet werden.", Toast.LENGTH_SHORT).show();
                }
            });
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == REQUEST_IMPORT_FILE) {
            if (filePathCallback != null) {
                Uri[] result = null;
                if (resultCode == RESULT_OK && data != null && data.getData() != null) {
                    result = new Uri[]{data.getData()};
                }
                filePathCallback.onReceiveValue(result);
                filePathCallback = null;
            }
            return;
        }

        if (requestCode == REQUEST_EXPORT_FILE) {
            if (resultCode == RESULT_OK && data != null && data.getData() != null && pendingExportText != null) {
                Uri uri = data.getData();
                try (OutputStream out = getContentResolver().openOutputStream(uri, "w")) {
                    if (out == null) {
                        throw new IllegalStateException("Kein OutputStream verfügbar");
                    }
                    out.write(pendingExportText.getBytes(StandardCharsets.UTF_8));
                    out.flush();
                    Toast.makeText(this, "Lernstand gespeichert.", Toast.LENGTH_SHORT).show();
                } catch (Exception e) {
                    Toast.makeText(this, "Lernstand konnte nicht gespeichert werden.", Toast.LENGTH_LONG).show();
                }
            }
            pendingExportText = null;
        }
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.removeJavascriptInterface("AndroidBridge");
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }
}
