# AgriConnect — Setup Guide

## Prerequisites

| Tool         | Required Version | Check Command          |
|--------------|-----------------|------------------------|
| Node.js      | 18.x or 20.x    | `node --version`       |
| npm          | 9+              | `npm --version`        |
| Expo CLI     | Latest          | `npx expo --version`   |
| Android SDK  | API 33+         | Android Studio         |
| Java JDK     | 17              | `java --version`       |

---

## 1. Install Dependencies

```bash
cd AgriConnect
npm install
```

> If you use pnpm: `pnpm install`

---

## 2. Environment Setup

The `.env` file is already configured for demo mode. No changes needed.

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

> The app uses **mock data only** — the API URL is not called during demo.

---

## 3. Run on Android Device / Emulator

### Option A — Expo Go (Fastest for demo)

```bash
npx expo start
```

Then scan the QR code with the **Expo Go** app on your Android device.

### Option B — Android Emulator

```bash
npx expo start --android
```

Requires Android Studio with an AVD (Android Virtual Device) configured.

### Option C — Physical Device via USB

1. Enable **Developer Options** on your Android phone
2. Enable **USB Debugging**
3. Connect via USB
4. Run: `npx expo run:android`

---

## 4. Android Studio Setup (for APK builds)

1. Download [Android Studio](https://developer.android.com/studio)
2. Install SDK: **API Level 33** (Android 13) or higher
3. Set environment variables:

**Windows:**
```powershell
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:PATH += ";$env:ANDROID_HOME\platform-tools"
$env:PATH += ";$env:ANDROID_HOME\emulator"
```

Add to your system environment variables permanently via System Properties.

---

## 5. Verify Setup

```bash
npx expo doctor
```

This checks all dependencies and flags any issues.

---

## 6. Troubleshooting

### Metro bundler port conflict
```bash
npx expo start --port 8082
```

### Clear cache
```bash
npx expo start --clear
```

### Node modules issues
```bash
rm -rf node_modules
npm install
```

### Android build fails
```bash
cd android
./gradlew clean
cd ..
npx expo run:android
```

### Expo Go version mismatch
Update Expo Go on your device, or use `npx expo run:android` for a local build.

---

## 7. No Backend Required

This demo runs entirely on mock data. You do **not** need to:
- Start the backend server
- Configure a database
- Set up Supabase
- Have internet connectivity (after initial load)
