# Fachteil-Luchs Android

Dies ist das native Android-Projekt der Fachteil-Luchs-Lernkarten-App.

## Technischer Aufbau

- echte Android-App mit Java `MainActivity`
- lokale `WebView`, keine Internetverbindung nötig
- Lernkarten-App liegt vollständig in `app/src/main/assets/index.html`
- Lernstand bleibt über `localStorage` auf dem Gerät erhalten
- JSON-Import über Android-Dateiauswahl
- JSON-Export über Android-Speicherdialog
- reguläre Android-Launcher-Icons in allen Dichten
- Build über Android Gradle Plugin und GitHub Actions

## APK über GitHub bauen

Nach dem Hochladen auf den `main`-Branch startet automatisch der Workflow **Build Fachteil-Luchs APK**.

Danach:
1. GitHub → `Actions`
2. erfolgreichen Workflow öffnen
3. unten unter `Artifacts` auf **Fachteil-Luchs-APK** klicken
4. ZIP herunterladen und `Fachteil-Luchs.apk` entpacken

Die erzeugte Debug-APK ist von Android/Gradle regulär signiert und direkt installierbar.
