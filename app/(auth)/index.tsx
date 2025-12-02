import { Logo } from '@/components/Logo';
import { COLORS } from '@/constants/Colors';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

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