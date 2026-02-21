// ============================================================
// Empty State Screen - Placeholder for empty data views
// ============================================================
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FileQuestion, Plus } from 'lucide-react-native';
import { useTheme } from '../src/hooks/useTheme';
import { Button } from '../src/components/atoms';

export default function EmptyStateScreen() {
    const { colors } = useTheme();
    const router = useRouter();
    const {
        title = 'No Data Found',
        description = 'It looks like there is nothing to show here yet.',
        actionLabel,
        actionRoute
    } = useLocalSearchParams<{ title: string; description: string; actionLabel: string; actionRoute: string }>();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.content}>
                <View style={[styles.iconContainer, { backgroundColor: colors.surface }]}>
                    <FileQuestion size={48} color={colors.textMuted} />
                </View>

                <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
                <Text style={[styles.desc, { color: colors.textSecondary }]}>{description}</Text>

                {actionLabel && actionRoute && (
                    <Button
                        title={actionLabel}
                        onPress={() => router.push(actionRoute as any)}
                        icon={<Plus size={18} color="#fff" />}
                        style={{ width: '100%', marginTop: 20 }}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        fontSize: 24,
        fontWeight: '800',
        marginBottom: 12,
    },
    desc: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        color: '#666',
    },
});
