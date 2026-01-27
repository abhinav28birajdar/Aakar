# Aakar - Designer Community Platform
<div align="center">
  <img src="./assets/icon.png" width="100" height="100" alt="Aakar Icon" />
  <h1>Aakar</h1>
  <p>A premium, production-grade mobile UI for the modern grooming experience.</p>
</div>
Aakar is a premium, production-ready design community mobile application built with **React Native**, **Expo Router**, and **TypeScript**. Inspired by platforms like Dribbble and Behance, Aakar provides a stunning interface for designers to showcase their work, discover inspiration, and connect with global talent.

---

## ✨ Key Features

- **🎨 Premium UI/UX**: Meticulously crafted design system with vibrant gradients, glassmorphism, and smooth micro-interactions.
- **🌗 Complete Dark/Light Mode**: Full support for both themes across every single screen.
- **📱 Comprehensive Navigation**: 
  - **Auth Flow**: Onboarding, Sign In, Sign Up, Forgot Password, Reset Password, and Email Verification.
  - **Main Experience**: Home Feed, Explore, Category Filters, Image Uploading, Activity, and Profile.
  - **Social Interactions**: Messaging/Chat, Followers/Following, Notifications, and Sharing.
  - **Utilities**: Advanced Search, Settings, Edit Profile, Analytics, Help Center, and Content Reporting.
- **🚀 High Performance**: Optimized image loading using `expo-image`, smooth animations with `moti` and `react-native-reanimated`.
- **🏗️ Scalable Architecture**: Atomic design component structure and centralized theme management.

---

## 📂 Project Structure

```text
app/                 # Expo Router file-based navigation (Screens)
src/
 ├── theme/          # Design system (Colors, Typography, Spacing, Shadows)
 ├── components/     
 │    ├── atoms/     # Basic building blocks (Buttons, Inputs, etc.)
 │    ├── molecules/ # Combined atoms (DesignCards, TabBars, etc.)
 │    └── organisms/ # Complex UI modules
 ├── constants/      # Mock data and configuration
 ├── hooks/          # Custom React hooks (useTheme, etc.)
 ├── types/          # TypeScript interfaces
 └── assets/         # App icons and imagery
```

---

## 🛠️ Tech Stack

- **React Native & Expo SDK 52**
- **TypeScript** for type safety
- **Expo Router** (v3) for file-system based routing
- **Lucide React Native** for consistent iconography
- **Moti & Reanimated** for premium animations
- **Expo Image** for optimized, high-speed image rendering
- **React Hook Form & Zod** for robust form handling

---

## 🚀 Getting Started

1.  **Clone the repository**
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Start the development server**:
    ```bash
    npx expo start
    ```

---

## 🌟 Future Roadmap (UI Focus)

- [ ] **Skeleton Loaders** for all data-fetching states.
- [ ] **Custom Gesture Transitions** for full-screen image viewing.
- [ ] **Interactive Color Palettes** extracted dynamically from user uploads.
- [ ] **Lottie Animations** for success and loading states.

---

<p align="center">Made with ❤️ for the Global Design Community</p>
