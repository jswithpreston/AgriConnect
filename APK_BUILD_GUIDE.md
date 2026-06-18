# AgriConnect — APK Build Guide

## Prerequisites

- Node.js 18 or 20
- Java JDK 17 (`java --version`)
- Android SDK API 33+ (via Android Studio)
- `ANDROID_HOME` environment variable set

---

## Option 1 — EAS Build (Recommended, No Local Android SDK Needed)

EAS (Expo Application Services) builds the APK in the cloud.

### Setup EAS

```bash
npm install -g eas-cli
eas login
eas build:configure
```

### Build APK (Android)

```bash
eas build --platform android --profile preview
```

This produces a downloadable `.apk` file. Share the download link with stakeholders.

### Build AAB for Play Store

```bash
eas build --platform android --profile production
```

---

## Option 2 — Local APK Build (Requires Android SDK)

### Step 1 — Generate native Android project

```bash
npx expo prebuild --platform android
```

### Step 2 — Build debug APK (fastest, for testing)

```bash
cd android
./gradlew assembleDebug
```

**Output location:**
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### Step 3 — Build release APK

```bash
cd android
./gradlew assembleRelease
```

**Output location:**
```
android/app/build/outputs/apk/release/app-release-unsigned.apk
```

---

## Option 3 — Expo Dev Build (Best for Demo on Physical Device)

```bash
npx expo run:android --variant release
```

This builds and installs directly on a connected Android device.

---

## Signing the APK (for distribution)

### Generate a keystore

```bash
keytool -genkey -v -keystore agriconnect-release.keystore \
  -alias agriconnect -keyalg RSA -keysize 2048 -validity 10000
```

### Configure signing in `android/app/build.gradle`

```gradle
android {
  signingConfigs {
    release {
      storeFile file('../../agriconnect-release.keystore')
      storePassword 'your_store_password'
      keyAlias 'agriconnect'
      keyPassword 'your_key_password'
    }
  }
  buildTypes {
    release {
      signingConfig signingConfigs.release
      minifyEnabled true
      proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
    }
  }
}
```

### Build signed APK

```bash
cd android
./gradlew assembleRelease
```

---

## Install APK on Android Device

```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

Or transfer the `.apk` file to the device and open it (enable "Install from unknown sources" in device settings).

---

## app.json Configuration

Current `app.json` is minimal. For a production build, add:

```json
{
  "expo": {
    "name": "AgriConnect",
    "slug": "agriconnect",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash-icon.png",
      "backgroundColor": "#1B7A3D"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#1B7A3D"
      },
      "package": "com.agriconnect.app",
      "versionCode": 1
    }
  }
}
```

---

## Common Build Fixes

### Gradle build fails
```bash
cd android
./gradlew clean
cd ..
npx expo prebuild --clean --platform android
```

### SDK version mismatch
In `android/build.gradle`, ensure:
```gradle
compileSdkVersion = 34
targetSdkVersion = 34
minSdkVersion = 24
```

### Metro bundler not starting
```bash
npx expo start --clear
```

### Java version issues
Ensure `JAVA_HOME` points to JDK 17:
```powershell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
```

---

## Final APK Commands (Summary)

```bash
# 1. Install dependencies
npm install

# 2. Generate Android project
npx expo prebuild --platform android

# 3. Build debug APK
cd android && ./gradlew assembleDebug

# 4. APK is at:
# android/app/build/outputs/apk/debug/app-debug.apk

# 5. Install on connected device
adb install android/app/build/outputs/apk/debug/app-debug.apk
```
