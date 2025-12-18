import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { COLORS } from '@/constants/colors';
import { TYPOGRAPHY } from '@/constants/typography';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import { Mail } from 'lucide-react-native';
import { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { resetPassword, isLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = () => {
    if (!email) {
      setError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return false;
    }
    setError('');
    return true;
  };

  const handleResetPassword = async () => {
    if (!validateEmail()) return;

    try {
      await resetPassword(email);
      setEmailSent(true);
    } catch (error: any) {
      Alert.alert('Reset Failed', error.message);
    }
  };

  const handleBackToLogin = () => {
    router.push('/login');
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoid}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Logo size="medium" showTagline />
          </View>

          <View style={styles.formContainer}>
            {!emailSent ? (
              <>
                <Text style={styles.heading}>Reset Password</Text>
                <Text style={styles.description}>
                  Enter your email address and we'll send you a link to reset your password.
                </Text>

                <Input
                  label="Email"
                  placeholder="Email address"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={error}
                  leftIcon={<Mail size={20} color={COLORS.darkGray} />}
                />

                <Button
                  title="Send Reset Link"
                  onPress={handleResetPassword}
                  loading={isLoading}
                  style={styles.resetButton}
                />
              </>
            ) : (
              <>
                <Text style={styles.heading}>Email Sent</Text>
                <Text style={styles.description}>
                  We've sent a password reset link to {email}. Please check your email and follow the instructions.
                </Text>
                <Button
                  title="Back to Login"
                  onPress={handleBackToLogin}
                  style={styles.resetButton}
                />
              </>
            )}

            <TouchableOpacity 
              style={styles.backToLogin}
              onPress={handleBackToLogin}
            >
              <Text style={styles.backToLoginText}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  heading: {
    ...TYPOGRAPHY.heading,
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    marginBottom: 24,
    color: COLORS.darkGray,
  },
  resetButton: {
    marginBottom: 24,
  },
  backToLogin: {
    alignItems: 'center',
  },
  backToLoginText: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
  },
});