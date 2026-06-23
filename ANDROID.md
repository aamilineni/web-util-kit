# Android release (Capacitor)

The web app is wrapped with [Capacitor](https://capacitorjs.com/) so the same React codebase ships to Google Play.

## Prerequisites

1. **Android Studio** — [developer.android.com/studio](https://developer.android.com/studio)
2. **JDK 17+** (bundled with Android Studio)
3. Set `ANDROID_HOME` or install SDK via Android Studio → SDK Manager

## Local development

```bash
# Build web app + copy into android/
npm run cap:sync

# Open in Android Studio (emulator or USB device)
npm run cap:android

# Or build & run from CLI
npm run cap:run:android
```

After code changes, always run `npm run cap:sync` before testing on Android.

## App identity

| Setting | Value |
|---------|--------|
| Package ID | `com.snappdf.app` |
| App name | SnapPDF |
| Config | `capacitor.config.ts` |

Change `appId` / `appName` in `capacitor.config.ts` when you rebrand, then run `npm run cap:sync`.

## Play Store checklist

### 1. App signing

In Android Studio:

1. **Build → Generate Signed Bundle / APK**
2. Choose **Android App Bundle (.aab)** — required for Play Store
3. Create a new keystore (save it securely — you cannot recover a lost keystore)
4. Build release bundle

### 2. Google Play Console

1. [play.google.com/console](https://play.google.com/console) — one-time $25 developer fee
2. **Create app** → fill store listing:
   - **Short description:** Free PDF tools — merge, split, unlock & sign
   - **Full description:** Highlight free, private, no upload, runs on device
   - **Category:** Productivity or Tools
3. Upload **screenshots** (phone 1080×1920 minimum, 4–8 images)
4. **App icon** 512×512 PNG
5. **Feature graphic** 1024×500 PNG
6. **Privacy policy URL** (required — files are processed on-device; state that clearly)

### 3. Content rating

Complete the questionnaire in Play Console (likely **Everyone** for utility tools).

### 4. Data safety form

Declare accurately:

- **No data collected** if you only use on-device processing
- If Google Analytics / GTM is enabled in the app, declare analytics

### 5. Upload release

1. **Production → Create new release**
2. Upload the `.aab` file
3. Submit for review (typically 1–7 days)

## Icons & splash screen

Default Capacitor icons are placeholders. Replace before launch:

1. Create a **1024×1024** master icon (PNG)
2. Use [capacitor-assets](https://github.com/ionic-team/capacitor-assets):

```bash
npm install -D @capacitor/assets
# Place icon.png and splash.png in assets/
npx capacitor-assets generate --android
npm run cap:sync
```

## How it works

- **Web:** `BrowserRouter` + Firebase Hosting
- **Android:** `HashRouter` + local WebView (routing works offline after install)
- PDF tools run in the WebView (same WASM/JS as the website)

## Troubleshooting

| Issue | Fix |
|-------|-----|
| White screen on launch | Run `npm run cap:sync` after `npm run build` |
| Routing 404 | Native app uses `HashRouter` (`/#/pdf/merge`) |
| Gradle sync fails | Open Android Studio, install suggested SDK packages |
| PDF unlock fails on old devices | Requires modern WebView (Android 8+ recommended) |

## CI (optional)

For automated builds, use GitHub Actions with `android-actions/setup-android` and `./gradlew bundleRelease` in the `android/` folder.
