# Aakar - Professional Designer Community

Aakar is a premium, enterprise-level designer social platform built with React Native (Expo) and Firebase. It provides a robust architecture for sharing design portfolios, connecting with other creative professionals, and participating in design challenges.

## 🚀 Features

- **Robust Authentication**: Email/Password, Google, Apple, and Phone OTP authentication.
- **Real-time Interactions**: Live feed updates, instant notifications, and real-time chat.
- **Content Management**: Create, edit, and delete design posts with multiple high-quality images.
- **Dynamic Feed**: Multi-category feed (For You, Trending, Fresh, Following) with optimized Firestore queries.
- **Profile System**: Highly customizable user profiles with skills, software, and portfolio analytics.
- **Designer Analytics**: Track post performance, engagement rates, and profile growth.
- **Professional Theming**: Sleek, modern design system with coherent color palettes and typography.
- **Optimized Performance**: Memoized components, efficient state management with Zustand, and lazy loading.

## 🛠️ Technology Stack

- **Framework**: [React Native](https://reactnative.dev/) with [Expo Router](https://docs.expo.dev/routing/introduction/)
- **Backend-as-a-Service**: [Firebase](https://firebase.google.com/) (Auth, Firestore, Storage)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Styling**: Vanilla React Native StyleSheet with a custom Theme Engine
- **Icons**: [Lucide React Native](https://lucide.dev/guide/packages/lucide-react-native)
- **Image Handling**: [Expo Image](https://docs.expo.dev/versions/latest/sdk/image/) for fast, cached rendering

## 📂 Project Structure

```text
/
├── app/                  # Expo Router - Navigation & Screens (Wrapper Layer)
├── src/                  # Core Application Logic
│   ├── assets/           # Images, Fonts, Lottie animations
│   ├── components/       # Atomic Design System (Atoms, Molecules, Organisms)
│   ├── context/          # State Stores (Zustand)
│   ├── hooks/            # Custom React Hooks
│   ├── screens/          # Core Screen Components (Logical Layer)
│   ├── services/         # API & External Services (Firebase)
│   ├── theme/            # Design System Tokens & Constants
│   ├── types/            # TypeScript Definitions
│   └── utils/            # Helper Functions & Error Handlers
├── firestore.rules       # Secure Production Rules for Firestore
└── storage.rules         # Secure Production Rules for Storage
```

## 🔐 Security & Production Ready

- **Firestore Rules**: Strict attribute-based and role-based access control.
- **Storage Rules**: User-isolated storage paths with ownership verification.
- **Error Handling**: Centralized error logging and user-friendly messaging.
- **Validation**: Comprehensive form validation and data sanitization.

## 🏁 Getting Started

1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Setup Firebase**:
   - Create a Firebase project.
   - Add Android/iOS apps and download `google-services.json` and `GoogleService-Info.plist`.
   - Place them in the root directory.
4. **Run the app**: `npx expo start`

