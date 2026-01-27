import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/hooks/useTheme';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Mail, Lock, ArrowLeft, Facebook } from 'lucide-react-native';
import { MotiView } from 'moti';

export default function LoginScreen() {
    const { colors } = useTheme();
    const router = useRouter();
    const [email, setEmail] = useState('abhinavbirajdar28@gmail.com');
    const [password, setPassword] = useState('12345678');

    const handleLogin = () => {
        router.replace('/(tabs)/home');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <ArrowLeft size={24} color={colors.text} />
                    </TouchableOpacity>

                    <MotiView
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        style={styles.header}
                    >
                        <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Log in to your account and start discovering.</Text>
                    </MotiView>

                    <View style={styles.form}>
                        <Input
                            label="Email Address"
                            placeholder="mail@example.com"
                            value={email}
                            onChangeText={setEmail}
                            icon={<Mail size={20} color={colors.textSecondary} />}
                            keyboardType="email-address"
                        />
                        <Input
                            label="Password"
                            placeholder="••••••••"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            icon={<Lock size={20} color={colors.textSecondary} />}
                        />

                        <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')} style={styles.forgotBtn}>
                            <Text style={[styles.forgotText, { color: colors.primary }]}>Forgot Password?</Text>
                        </TouchableOpacity>

                        <Button
                            title="Log In"
                            onPress={handleLogin}
                            style={styles.loginBtn}
                        />

                        <View style={styles.divider}>
                            <View style={[styles.line, { backgroundColor: colors.border }]} />
                            <Text style={[styles.or, { color: colors.textSecondary }]}>OR</Text>
                            <View style={[styles.line, { backgroundColor: colors.border }]} />
                        </View>

                        <View style={styles.socialRow}>
                            <TouchableOpacity style={[styles.socialBtn, { backgroundColor: colors.surfaceAlt }]}>
                                <Facebook size={24} color="#1877F2" />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.socialBtn, { backgroundColor: colors.surfaceAlt }]}>
                                <Text style={styles.googleIcon}>G</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <Text style={{ color: colors.textSecondary }}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                            <Text style={[styles.registerText, { color: colors.primary }]}>Register</Text>
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
    },
    backBtn: {
        width: 44,
        height: 44,
        justifyContent: 'center',
    },
    header: {
        marginTop: 32,
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
    },
    subtitle: {
        fontSize: 16,
        marginTop: 8,
    },
    form: {
        gap: 8,
    },
    forgotBtn: {
        alignSelf: 'flex-end',
        paddingVertical: 8,
    },
    forgotText: {
        fontSize: 14,
        fontWeight: '700',
    },
    loginBtn: {
        marginTop: 24,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 32,
        gap: 16,
    },
    line: {
        flex: 1,
        height: 1,
    },
    or: {
        fontSize: 14,
        fontWeight: '800',
    },
    socialRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
    },
    socialBtn: {
        width: 60,
        height: 60,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    googleIcon: {
        fontSize: 24,
        fontWeight: '900',
        color: '#DB4437',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 40,
        marginBottom: 20,
    },
    registerText: {
        fontWeight: '800',
    },
});
