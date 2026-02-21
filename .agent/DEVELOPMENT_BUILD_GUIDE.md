# Development Build Setup Guide

## 🎯 Why You Need a Development Build

Your app uses **native modules** that are NOT compatible with Expo Go:

1. **@react-native-firebase/*** (Auth, Firestore, Storage, Messaging)
2. **@react-native-google-signin/google-signin**
3. **@notifee/react-native**
4. **@invertase/react-native-apple-authentication**

These require native code compilation, which Expo Go doesn't support.

---

## 🚀 SOLUTION: Build Development Client (One-Time Setup)

### Option 1: Build Locally (Requires Android Studio/Xcode)

#### Prerequisites:
- Android Studio with Android SDK (for Android)
- Xcode (for iOS, macOS only)

#### Build Commands:

**For Android:**
```bash
npx expo run:android
```

**For iOS:**
```bash
npx expo run:ios
```

This will:
1. Generate native Android/iOS folders
2. Install dependencies
3. Build the development client
4. Install on emulator/device
5. Start Metro bundler

---

### Option 2: Build with EAS (Cloud Build - Recommended)

#### Prerequisites:
- EAS CLI installed: `npm install -g eas-cli`
- Expo account (free)

#### Setup:

1. **Login to EAS:**
```bash
eas login
```

2. **Configure EAS Build:**
```bash
eas build:configure
```

3. **Build Development Client:**

**For Android:**
```bash
eas build --profile development --platform android
```

**For iOS:**
```bash
eas build --profile development --platform ios
```

4. **Install the build:**
- Download the APK (Android) or install via TestFlight (iOS)
- Install on your device

5. **Start development server:**
```bash
npx expo start --dev-client
```

---

## 🔧 QUICK FIX: Use EAS Build (Easiest)

If you don't have Android Studio/Xcode set up:

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Build for Android (free, takes ~10-15 min)
eas build --profile development --platform android

# Download and install the APK on your device/emulator

# Start dev server
npx expo start --dev-client
```

---

## 📱 After Building Once

Once you have the development client installed, you can develop normally:

```bash
npx expo start --dev-client
```

The development client stays installed on your device. You only need to rebuild when:
- You add/remove native modules
- You change native configuration (app.json plugins)
- You update native dependencies

---

## ⚡ FASTEST SOLUTION (Right Now)

Since you already ran `npx expo prebuild`, the native folders exist.

**If you have Android SDK configured:**

```bash
# Kill existing expo processes
# Then run:
npx expo run:android
```

This will build and install the development client.

**If you DON'T have Android SDK:**

Use EAS Build (cloud):
```bash
npm install -g eas-cli
eas login
eas build --profile development --platform android
```

---

## 🎯 RECOMMENDED WORKFLOW

1. **One-time setup:** Build development client (EAS or local)
2. **Daily development:** `npx expo start --dev-client`
3. **Rebuild only when:** Adding native modules or changing native config

---

## 📝 Why This Error Occurred

The error `No development build (com.aakar.app) for this project is installed` means:

1. You ran `npx expo start` (tries to use Expo Go)
2. Expo detected native modules
3. Expo Go can't run native modules
4. No development client is installed on your device
5. Error!

**Solution:** Build and install the development client once, then use `--dev-client` flag.

---

## ✅ FINAL COMMANDS

**After building development client:**

```bash
# Start development server
npx expo start --dev-client

# Or use the shortcut
npx expo start -d
```

**To rebuild (when needed):**

```bash
# Local build
npx expo run:android  # or npx expo run:ios

# Cloud build
eas build --profile development --platform android
```

---

## 🚨 IMPORTANT

**DO NOT** try to make this work with Expo Go. Your app architecture requires native modules. Switching to Expo Go would require:
- Removing all Firebase native modules
- Removing Google Sign-In native
- Removing Notifee
- Removing Apple Auth
- Completely rewriting authentication
- Losing push notifications
- Breaking the entire app

**The development build is the correct solution.**
