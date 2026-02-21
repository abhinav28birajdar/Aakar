// ============================================================
// Edit Post Screen
// ============================================================
import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    TextInput, Image, Alert, ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Save, X, Image as ImageIcon } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../src/hooks/useTheme';
import { usePostStore } from '../../../src/context/stores/postStore';
import { useAuthStore } from '../../../src/context/stores/authStore';
import { updatePost } from '../../../src/services/firestoreService';
import { CATEGORIES } from '../../../src/config/constants';
import { Button, Input, ResponsiveContainer } from '../../../src/components/atoms';

export default function EditPostScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { colors } = useTheme();
    const { fetchPost } = usePostStore();
    const user = useAuthStore(s => s.user);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [visibility, setVisibility] = useState<'public' | 'followers' | 'private'>('public');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchPostData = async () => {
            const post = await fetchPost(id);
            if (post) {
                setTitle(post.title);
                setDescription(post.description);
                setCategory(post.category);
                setVisibility(post.visibility);
            }
        };
        fetchPostData();
    }, [id]);

    const handleUpdate = async () => {
        if (!title.trim() || !description.trim()) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        try {
            setIsSaving(true);
            await updatePost(id, user!.id, {
                title: title.trim(),
                description: description.trim(),
                category: category as any,
                visibility,
            });
            router.back();
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to update post');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
            <ResponsiveContainer>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <ArrowLeft size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.title, { color: colors.text }]}>Edit Post</Text>
                    <TouchableOpacity onPress={handleUpdate} disabled={isSaving}>
                        {isSaving ? (
                            <ActivityIndicator size="small" color={colors.primary} />
                        ) : (
                            <Save size={24} color={colors.primary} />
                        )}
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
                    <View style={styles.inputSection}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>Title</Text>
                        <Input
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Give your work a title"
                            style={styles.textInput}
                        />
                    </View>

                    <View style={styles.inputSection}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>Description</Text>
                        <TextInput
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Tell us about your process..."
                            multiline
                            numberOfLines={6}
                            textAlignVertical="top"
                            style={[styles.textArea, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                        />
                    </View>

                    <View style={styles.inputSection}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>Category</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
                            {CATEGORIES.map(cat => (
                                <TouchableOpacity
                                    key={cat}
                                    style={[
                                        styles.catChip,
                                        { borderColor: category === cat ? colors.primary : colors.border },
                                        category === cat && { backgroundColor: colors.primary + '15' }
                                    ]}
                                    onPress={() => setCategory(cat)}
                                >
                                    <Text style={[styles.catText, { color: category === cat ? colors.primary : colors.textSecondary }]}>
                                        {cat}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    <View style={styles.inputSection}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>Visibility</Text>
                        <View style={styles.visibilityRow}>
                            {(['public', 'followers', 'private'] as const).map(v => (
                                <TouchableOpacity
                                    key={v}
                                    style={[
                                        styles.vBtn,
                                        { borderColor: colors.border },
                                        visibility === v && { backgroundColor: colors.primary, borderColor: colors.primary }
                                    ]}
                                    onPress={() => setVisibility(v)}
                                >
                                    <Text style={[styles.vText, { color: visibility === v ? '#fff' : colors.textSecondary }]}>
                                        {v.charAt(0).toUpperCase() + v.slice(1)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <Button
                        title="Update Post"
                        onPress={handleUpdate}
                        loading={isSaving}
                        style={styles.submitBtn}
                    />
                </ScrollView>
            </ResponsiveContainer>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14 },
    backBtn: { width: 40, height: 40, justifyContent: 'center' },
    title: { fontSize: 18, fontWeight: '800' },
    body: { paddingHorizontal: 20, paddingBottom: 40 },
    inputSection: { marginBottom: 24 },
    label: { fontSize: 14, fontWeight: '700', marginBottom: 10 },
    textInput: { height: 50 },
    textArea: { borderRadius: 12, padding: 14, minHeight: 120, borderWidth: 1, fontSize: 16 },
    catRow: { gap: 8, paddingBottom: 4 },
    catChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
    catText: { fontSize: 13, fontWeight: '600' },
    visibilityRow: { flexDirection: 'row', gap: 10 },
    vBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 1, alignItems: 'center' },
    vText: { fontSize: 13, fontWeight: '700' },
    submitBtn: { marginTop: 20 },
});
