import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput, Switch } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Image, Upload, X, ChevronRight, Palette, Tag, Layers, MessageSquare, AlertTriangle } from 'lucide-react-native';
import { Button } from '../../components/Button';
import { useRouter } from 'expo-router';

export default function CreatePostScreen() {
    const { colors } = useTheme();
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [allowComments, setAllowComments] = useState(true);
    const [isMature, setIsMature] = useState(false);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={[styles.cancel, { color: colors.textSecondary }]}>Cancel</Text>
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>New Post</Text>
                <TouchableOpacity>
                    <Text style={[styles.draft, { color: colors.primary }]}>Drafts</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                {/* Upload Zone */}
                <TouchableOpacity style={[styles.uploadZone, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
                    <Upload size={40} color={colors.primary} />
                    <Text style={[styles.uploadText, { color: colors.text }]}>Upload your designs</Text>
                    <Text style={[styles.uploadSubtext, { color: colors.textSecondary }]}>Drag & drop or browse files</Text>
                    <Text style={[styles.uploadLimit, { color: colors.textMuted }]}>Max size: 50MB (JPG, PNG, MP4)</Text>
                </TouchableOpacity>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>Title</Text>
                        <TextInput
                            style={[styles.input, { color: colors.text, borderBottomColor: colors.border }]}
                            placeholder="Give your work a name..."
                            placeholderTextColor={colors.textMuted}
                            value={title}
                            onChangeText={setTitle}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>Description</Text>
                        <TextInput
                            style={[styles.textArea, { color: colors.text, backgroundColor: colors.surfaceAlt, borderRadius: 12 }]}
                            placeholder="Tell us about your design process..."
                            placeholderTextColor={colors.textMuted}
                            multiline
                            numberOfLines={4}
                            value={description}
                            onChangeText={setDescription}
                        />
                    </View>

                    {/* Selector Items */}
                    <TouchableOpacity style={[styles.selectorItem, { borderBottomColor: colors.border }]}>
                        <View style={styles.selectorLeft}>
                            <Layers size={20} color={colors.textSecondary} />
                            <Text style={[styles.selectorText, { color: colors.text }]}>Select Category</Text>
                        </View>
                        <View style={styles.selectorRight}>
                            <Text style={[styles.selectorValue, { color: colors.textSecondary }]}>None</Text>
                            <ChevronRight size={20} color={colors.textSecondary} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.selectorItem, { borderBottomColor: colors.border }]}>
                        <View style={styles.selectorLeft}>
                            <Tag size={20} color={colors.textSecondary} />
                            <Text style={[styles.selectorText, { color: colors.text }]}>Add Tags</Text>
                        </View>
                        <View style={styles.selectorRight}>
                            <ChevronRight size={20} color={colors.textSecondary} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.selectorItem, { borderBottomColor: colors.border }]}>
                        <View style={styles.selectorLeft}>
                            <Palette size={20} color={colors.textSecondary} />
                            <Text style={[styles.selectorText, { color: colors.text }]}>Color Palette</Text>
                        </View>
                        <View style={styles.selectorRight}>
                            <ChevronRight size={20} color={colors.textSecondary} />
                        </View>
                    </TouchableOpacity>

                    {/* Toggles */}
                    <View style={[styles.selectorItem, { borderBottomColor: colors.border }]}>
                        <View style={styles.selectorLeft}>
                            <MessageSquare size={20} color={colors.textSecondary} />
                            <Text style={[styles.selectorText, { color: colors.text }]}>Allow Comments</Text>
                        </View>
                        <Switch
                            value={allowComments}
                            onValueChange={setAllowComments}
                            trackColor={{ false: colors.border, true: colors.primary }}
                        />
                    </View>

                    <View style={[styles.selectorItem, { borderBottomColor: colors.border }]}>
                        <View style={styles.selectorLeft}>
                            <AlertTriangle size={20} color={colors.textSecondary} />
                            <Text style={[styles.selectorText, { color: colors.text }]}>Mature Content</Text>
                        </View>
                        <Switch
                            value={isMature}
                            onValueChange={setIsMature}
                            trackColor={{ false: colors.border, true: colors.primary }}
                        />
                    </View>
                </View>

                <Button
                    title="Publish Design"
                    onPress={() => { }}
                    style={styles.publishButton}
                    size="lg"
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    cancel: {
        fontSize: 16,
        fontWeight: '500',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
    },
    draft: {
        fontSize: 16,
        fontWeight: '600',
    },
    content: {
        padding: 24,
    },
    uploadZone: {
        height: 240,
        borderRadius: 24,
        borderWidth: 2,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
    },
    uploadText: {
        fontSize: 18,
        fontWeight: '700',
        marginTop: 16,
    },
    uploadSubtext: {
        fontSize: 14,
        marginTop: 4,
    },
    uploadLimit: {
        fontSize: 12,
        marginTop: 12,
    },
    form: {
        gap: 24,
        marginBottom: 40,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    inputGroup: {},
    input: {
        fontSize: 20,
        fontWeight: '700',
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    textArea: {
        fontSize: 16,
        padding: 16,
        height: 120,
        textAlignVertical: 'top',
    },
    selectorItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    selectorLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    selectorRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    selectorText: {
        fontSize: 16,
        fontWeight: '600',
    },
    selectorValue: {
        fontSize: 14,
    },
    publishButton: {
        width: '100%',
        marginBottom: 40,
    },
});
