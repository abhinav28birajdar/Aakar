import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/context/stores/authStore';

export default function Index() {
  return <Redirect href="/splash" />;
}
