// ============================================================
// Error Screen - Global error handling view
// ============================================================
import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react-native';
import { useTheme } from '../src/hooks/useTheme';
import { Button } from '../src/components/atoms';

export default function ErrorScreen() {
    const { colors } = useTheme();
    const router = useRouter();
    const { message = 'Something went wrong. Please try again later.' } = useLocalSearchParams<{ message: string }>();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.content}>
                <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
                    <AlertTriangle size={48} color={colors.primary} />
                </View>

                <Text style={[styles.title, { color: colors.text }]}>Oops!</Text>
                <Text style={[styles.desc, { color: colors.textSecondary }]}>{message}</Text>

                <View style={styles.actions}>
                    <Button
                        title="Try Again"
                        onPress={() => router.back()}
                        icon={<RefreshCw size={18} color="#fff" />}
                        style={{ width: '100%' }}
                    />

                    <TouchableOpacity
                        style={styles.homeBtn}
                        onPress={() => router.replace('/(tabs)')}
                    >
                        <Home size={18} color={colors.textSecondary} />
                        <Text style={[styles.homeText, { color: colors.textSecondary }]}>Back to Home</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        marginBottom: 12,
    },
    desc: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 40,
    },
    actions: {
        width: '100%',
        gap: 16,
        alignItems: 'center',
    },
    homeBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 12,
    },
    homeText: {
        fontSize: 15,
        fontWeight: '600',
    },
});
