import { useTheme } from "@/hooks/useTheme";
import { Stack } from "expo-router";

export default function AuthLayout() {
  const { theme, isDark } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
        },
        headerTintColor: isDark ? '#FFFFFF' : '#000000',
        headerTitleStyle: {
          fontFamily: 'Inter_600SemiBold',
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: isDark ? '#1C1C1E' : '#FDFDFD',
        },
        animation: 'slide_from_right',
      }}
    >
      {/* Landing/Welcome Screen */}
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false,
          animation: 'fade',
        }} 
      />

      {/* Main Auth Screens */}
      <Stack.Screen 
        name="login" 
        options={{ 
          title: "Log In",
          animation: 'slide_from_right',
        }} 
      />
      <Stack.Screen 
        name="register" 
        options={{ 
          title: "Create Account",
          animation: 'slide_from_right',
        }} 
      />

      {/* Password Reset Flow */}
      <Stack.Screen 
        name="forgot-password" 
        options={{ 
          title: "Reset Password",
          animation: 'slide_from_right',
        }} 
      />
      <Stack.Screen 
        name="reset-password" 
        options={{ 
          title: "Set New Password",
          animation: 'slide_from_right',
        }} 
      />

      {/* Profile Setup Screens */}
      <Stack.Screen 
        name="role-selection" 
        options={{ 
          title: "Select Role",
          headerBackVisible: false, // Can't go back from here
          animation: 'slide_from_right',
        }} 
      />
      <Stack.Screen 
        name="profile-setup" 
        options={{ 
          title: "Complete Profile",
          headerBackVisible: false,
          animation: 'slide_from_right',
        }} 
      />
    </Stack>
  );
}