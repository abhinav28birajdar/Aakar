import { useEffect } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { COLORS } from '@/constants/colors';
import { Logo } from '@/components/Logo';

export default function SplashScreen() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    const checkAuthAndNavigate = async () => {
      // Simulate a delay to show the splash screen
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (!isLoading) {
        if (user) {
          router.replace('/(tabs)');
        } else {
          router.replace('/login');
        }
      }
    };

    checkAuthAndNavigate();
  }, [isLoading, user, router]);

  return (
    <View style={styles.container}>
      <Logo size="large" showTagline />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});