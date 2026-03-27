import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/hooks/useTheme';
import { Button } from '../../src/components/atoms/Button';
import { Input } from '../../src/components/atoms/Input';
import { Mail, Lock, User, AtSign } from 'lucide-react-native';
import { MotiView } from 'moti';

export default function SignUpScreen() {
    const router = useRouter();
    const { colors, typography, spacing } = useTheme();
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignUp = () => {
        setLoading(true);
        // Simulate sign up
        setTimeout(() => {
            setLoading(false);
            router.push('/(auth)/email-verification');
        }, 1500);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <MotiView
                        from={{ opacity: 0, translateY: -20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        style={styles.header}
                    >
                        <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                            Join a community of 50,000+ designers
                        </Text>
                    </MotiView>

                    <View style={styles.form}>
                        <Input
                            label="Full Name"
                            placeholder="John Doe"
                            value={fullName}
                            onChangeText={setFullName}
                            leftIcon={<User size={20} color={colors.textSecondary} />}
                        />
                        <Input
                            label="Username"
                            placeholder="johndoe"
                            value={username}
                            onChangeText={setUsername}
                            leftIcon={<AtSign size={20} color={colors.textSecondary} />}
                            autoCapitalize="none"
                        />
                        <Input
                            label="Email Address"
                            placeholder="name@example.com"
                            value={email}
                            onChangeText={setEmail}
                            leftIcon={<Mail size={20} color={colors.textSecondary} />}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <Input
                            label="Password"
                            placeholder="********"
                            value={password}
                            onChangeText={setPassword}
                            isPassword
                            leftIcon={<Lock size={20} color={colors.textSecondary} />}
                        />

                        <View style={styles.termsContainer}>
                            <Text style={[styles.termsText, { color: colors.textSecondary }]}>
                                By signing up, you agree to our{' '}
                                <Text style={{ color: colors.primary, fontWeight: '600' }}>Terms</Text> and{' '}
                                <Text style={{ color: colors.primary, fontWeight: '600' }}>Privacy Policy</Text>.
                            </Text>
                        </View>

                        <Button
                            title="Create Account"
                            onPress={handleSignUp}
                            loading={loading}
                            style={styles.signUpButton}
                        />
                    </View>

                    <View style={styles.footer}>
                        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                            Already have an account?{' '}
                        </Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/sign-in')}>
                            <Text style={[styles.signInText, { color: colors.primary }]}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
        flexGrow: 1,
    },
    header: {
        marginTop: 20,
        marginBottom: 32,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        lineHeight: 24,
    },
    form: {
        marginBottom: 32,
    },
    termsContainer: {
        marginBottom: 24,
    },
    termsText: {
        fontSize: 13,
        lineHeight: 18,
        textAlign: 'center',
    },
    signUpButton: {
        width: '100%',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 'auto',
        paddingBottom: 20,
    },
    footerText: {
        fontSize: 14,
    },
    signInText: {
        fontSize: 14,
        fontWeight: '700',
    },
});
