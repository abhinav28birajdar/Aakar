import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/stores/authStore';

export default function Index() {
  const { isAuthenticated, hasCompletedOnboarding } = useAuthStore();
  
  if (isAuthenticated && hasCompletedOnboarding) {
    return <Redirect href="/(tabs)" />;
  }
  if (isAuthenticated && !hasCompletedOnboarding) {
    return <Redirect href="/onboarding/role-select" />;
  }
  return <Redirect href="/onboarding/welcome" />;
}
