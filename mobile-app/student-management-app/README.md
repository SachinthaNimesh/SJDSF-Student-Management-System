# SJDSF Student Management System - Mobile App

Cross-platform mobile application for trainees and students, built with **React Native**, **Expo (SDK 57)**, and **TypeScript**.

---

## 📱 Features

* **OTP Authentication**: Simple, secure 4-digit OTP login linked to student profile.
* **Geofenced Check-In & Check-Out**: Automatic capture of GPS coordinates and attendance timestamps.
* **Daily Mood Tracker**: Trainee emotion logging (Happy, Neutral, Sad) for welfare tracking.
* **Offline Synchronization**: Seamless offline attendance and mood queuing with automatic sync upon reconnection.
* **Emergency Assistance**: One-tap emergency contact calling.

---

## 🚀 Prerequisites

1. **Node.js**: `v18.0.0` or higher (`node -v`)
2. **npm**: `v9.0.0` or higher
3. **Expo Go** app installed on your physical mobile device:
   * [Expo Go on iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   * [Expo Go on Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   * *Or* **iOS Simulator** (Mac with Xcode) / **Android Studio Emulator**.

---

## ⚙️ Installation & Configuration

### 1. Install Dependencies

```bash
cd mobile-app/student-management-app
npm install
```

### 2. Configure Local Switch / Backend URL

Open [`config/config.ts`](config/config.ts) where the **`IS_LOCAL`** switch is provided:

```ts
// Set to true to run locally without Azure/Choreo cloud APIs
export const IS_LOCAL = true;

// Configure local host: 'localhost' for iOS simulator, '10.0.2.2' for Android emulator, or LAN IP for phone
export const LOCAL_HOST = "localhost";
export const LOCAL_PORT = "8080";

export const LOCAL_BASE_URL = `http://${LOCAL_HOST}:${LOCAL_PORT}`;
export const CHOREO_BASE_URL =
  "https://87e89eab-95e5-4c0f-8192-7ee0196e1581-prod.e1-us-east-azure.choreoapis.dev/student-management-system/backend/v1.0";

export const BASE_URL = IS_LOCAL ? LOCAL_BASE_URL : CHOREO_BASE_URL;
```

* **iOS Simulator / Web**: Keep `LOCAL_HOST = "localhost"`.
* **Android Studio Emulator**: Change `LOCAL_HOST = "10.0.2.2"`.
* **Physical Device with Expo Go**: Change `LOCAL_HOST` to your computer's local Wi-Fi IP address (run `ipconfig getifaddr en0` on macOS, e.g. `192.168.1.15`). Both devices must be on the same Wi-Fi.
* **Testing Local OTP**: When `IS_LOCAL = true`, the OTP login screen offers a **"Local Dev: Autofill Seeded OTP (1001)"** button to log into student ID 1 instantly!

---

## 🏃 Running the Application

### Start Development Server

```bash
npx expo start
```

Or clear cache if experiencing bundling issues:
```bash
npx expo start -c
```

### Opening on Device:

1. **Physical Phone**: Open Expo Go (or Camera app on iOS) and scan the QR code printed in your terminal.
2. **iOS Simulator**: Press **`i`** in the terminal.
3. **Android Emulator**: Press **`a`** in the terminal.
4. **Reload**: Press **`r`** to reload the app bundle.

---

## 🧪 Health Check & Diagnostics

Run Expo doctor to check for dependency mismatches or configuration issues:

```bash
npx expo-doctor
```

Run TypeScript compilation check:

```bash
npx tsc --noEmit
```

---

## 📦 Building for Production (EAS Build)

The project includes [`eas.json`](eas.json) configuration for Expo Application Services.

1. **Install EAS CLI**:
   ```bash
   npm install -g eas-cli
   ```
2. **Login to Expo**:
   ```bash
   eas login
   ```
3. **Build Android APK (Preview)**:
   ```bash
   eas build -p android --profile preview
   ```
4. **Update Version for Play Store**:
   Before building for production release, increment `android.versionCode` in [`app.json`](app.json):
   ```json
   "android": {
     "versionCode": 3
   }
   ```

---

## 🔧 Troubleshooting

* **`Network request failed` / `TypeError: Network request failed`**:
  * If testing on a physical phone, `localhost` will not work. Set `BASE_URL` to your computer's LAN IP (e.g. `192.168.x.x:8080`).
  * Verify that macOS firewall is not blocking incoming connections on port `8080`.
* **Location Permission Denied**:
  * Check-in requires GPS permissions. Ensure location services are enabled on your device or simulated in the iOS/Android simulator.
* **Stuck in Offline Queue**:
  * The queue in [`src/api/wrapper/apiQueue.ts`](src/api/wrapper/apiQueue.ts) automatically flushes when reconnected to the internet. You can clear AsyncStorage data by resetting Expo Go if testing corrupted payloads.