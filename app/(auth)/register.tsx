import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/hooks/useTheme';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Mail, Lock, User, AtSign, ArrowLeft } from 'lucide-react-native';
import { MotiView } from 'moti';

export default function RegisterScreen() {
    const { colors } = useTheme();
    const router = useRouter();
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = () => {
        router.push('/(auth)/forgot-password'); // Or wherever for flow
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
                        <Text style={[styles.title, { color: colors.text }]}>Join the Club</Text>
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Create an account to start your creative journey.</Text>
                    </MotiView>

                    <View style={styles.form}>
                        <Input
                            label="Full Name"
                            placeholder="John Doe"
                            value={name}
                            onChangeText={setName}
                            icon={<User size={20} color={colors.textSecondary} />}
                        />
                        <Input
                            label="Username"
                            placeholder="johndoe"
                            value={username}
                            onChangeText={setUsername}
                            icon={<AtSign size={20} color={colors.textSecondary} />}
                            autoCapitalize="none"
                        />
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

                        <Text style={[styles.terms, { color: colors.textSecondary }]}>
                            By signing up, you agree to our <Text style={{ color: colors.primary, fontWeight: '700' }}>Terms of Service</Text> and <Text style={{ color: colors.primary, fontWeight: '700' }}>Privacy Policy</Text>.
                        </Text>

                        <Button
                            title="Create Account"
                            onPress={handleRegister}
                            style={styles.registerBtn}
                        />
                    </View>

                    <View style={styles.footer}>
                        <Text style={{ color: colors.textSecondary }}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                            <Text style={[styles.loginText, { color: colors.primary }]}>Log In</Text>
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
        marginTop: 24,
        marginBottom: 32,
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
    terms: {
        fontSize: 13,
        textAlign: 'center',
        marginVertical: 16,
        lineHeight: 18,
    },
    registerBtn: {
        marginTop: 8,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 40,
        marginBottom: 20,
    },
    loginText: {
        fontWeight: '800',
    },
});
