// ============================================================
// Data & Storage Settings - Cache & Export
// ============================================================
import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
    ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Trash2, Download, Database, HardDrive } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cacheDirectory, documentDirectory, readDirectoryAsync, deleteAsync, writeAsStringAsync } from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { useTheme } from '../../src/hooks/useTheme';
import { useAuthStore } from '../../src/context/stores/authStore';
import { usePostStore } from '../../src/context/stores/postStore';

export default function DataStorageScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const { user } = useAuthStore();
    const { posts } = usePostStore();
    const [loading, setLoading] = useState(false);

    const handleClearCache = async () => {
        Alert.alert(
            'Clear Cache',
            'This will remove temporary files and cached images. Your data in the cloud will not be affected.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: async () => {
                        setLoading(true);
                        try {
                            const cacheDir = cacheDirectory;
                            if (cacheDir) {
                                const files = await readDirectoryAsync(cacheDir);
                                for (const file of files) {
                                    await deleteAsync(cacheDir + file, { idempotent: true });
                                }
                            }
                            Alert.alert('Success', 'Cache cleared successfully');
                        } catch (error) {
                            Alert.alert('Error', 'Failed to clear cache');
                        } finally {
                            setLoading(false);
                        }
                    },
                },
            ]
        );
    };

    const handleExportData = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const userData = {
                profile: user,
                postsCount: posts.length,
                exportDate: new Date().toISOString(),
            };

            const fileUri = (documentDirectory || '') + 'aakar_data_export.json';
            await writeAsStringAsync(fileUri, JSON.stringify(userData, null, 2));

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri);
            } else {
                Alert.alert('Error', 'Sharing is not available on this device');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to export data');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <ArrowLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>Data & Storage</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.body}>
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>STORAGE MANAGEMENT</Text>
                    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <TouchableOpacity style={[styles.row, { borderBottomWidth: 0.5, borderBottomColor: colors.border }]} onPress={handleClearCache} disabled={loading}>
                            <View style={[styles.iconBox, { backgroundColor: colors.error + '15' }]}>
                                <Trash2 size={20} color={colors.error} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.label, { color: colors.text }]}>Clear Cache</Text>
                                <Text style={[styles.desc, { color: colors.textMuted }]}>Free up space by removing temporary files</Text>
                            </View>
                        </TouchableOpacity>

                        <View style={styles.row}>
                            <View style={[styles.iconBox, { backgroundColor: colors.primary + '15' }]}>
                                <HardDrive size={20} color={colors.primary} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.label, { color: colors.text }]}>App Storage Usage</Text>
                                <Text style={[styles.desc, { color: colors.textMuted }]}>Calculated dynamically based on downloads</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>DATA PORTABILITY</Text>
                    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <TouchableOpacity style={styles.row} onPress={handleExportData} disabled={loading}>
                            <View style={[styles.iconBox, { backgroundColor: '#22c55e15' }]}>
                                <Download size={20} color="#22c55e" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.label, { color: colors.text }]}>Export My Data</Text>
                                <Text style={[styles.desc, { color: colors.textMuted }]}>Download a copy of your profile and post data</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {loading && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14 },
    title: { fontSize: 20, fontWeight: '800' },
    body: { paddingHorizontal: 20, paddingTop: 20 },
    section: { marginBottom: 28 },
    sectionTitle: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
    card: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
    row: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 16 },
    iconBox: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    label: { fontSize: 16, fontWeight: '700' },
    desc: { fontSize: 13, marginTop: 2 },
    loadingOverlay: { marginTop: 40, alignItems: 'center' },
});
