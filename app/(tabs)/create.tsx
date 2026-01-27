import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Platform, Alert } from 'react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { Image as ImageIcon, Plus, X, Camera, Palette, Tag, AlignLeft, ChevronRight, Share2 } from 'lucide-react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Button } from '../../src/components/atoms/Button';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';

export default function CreatePostScreen() {
    const { colors, typography, spacing } = useTheme();
    const router = useRouter();
    const [images, setImages] = useState<string[]>([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImages([...images, result.assets[0].uri]);
        }
    };

    const removeImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
    };

    const handlePublish = () => {
        if (!title || images.length === 0) {
            Alert.alert('Missing Info', 'Please add a title and at least one image.');
            return;
        }
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            Alert.alert('Success', 'Post published successfully!', [
                { text: 'OK', onPress: () => router.replace('/(tabs)') }
            ]);
        }, 2000);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <X size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>New Design</Text>
                <TouchableOpacity onPress={handlePublish}>
                    <Text style={[styles.publishText, { color: colors.primary }]}>Publish</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.imageSection}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.imageScroll}>
                        {images.map((uri, index) => (
                            <View key={index} style={styles.imagePreviewContainer}>
                                <Image source={{ uri }} style={styles.imagePreview} />
                                <TouchableOpacity
                                    style={[styles.removeImage, { backgroundColor: colors.error }]}
                                    onPress={() => removeImage(index)}
                                >
                                    <X size={14} color="white" />
                                </TouchableOpacity>
                            </View>
                        ))}
                        <TouchableOpacity
                            style={[styles.addImageButton, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}
                            onPress={pickImage}
                        >
                            <Plus size={32} color={colors.textSecondary} />
                            <Text style={[styles.addImageText, { color: colors.textSecondary }]}>Add Image</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>

                <View style={[styles.form, { padding: 24 }]}>
                    <TextInput
                        placeholder="Title of your work"
                        placeholderTextColor={colors.textSecondary}
                        style={[styles.titleInput, { color: colors.text }]}
                        value={title}
                        onChangeText={setTitle}
                    />

                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    <View style={styles.descriptionRow}>
                        <AlignLeft size={20} color={colors.textSecondary} />
                        <TextInput
                            placeholder="Tell us about your process..."
                            placeholderTextColor={colors.textSecondary}
                            style={[styles.descriptionInput, { color: colors.text }]}
                            multiline
                            value={description}
                            onChangeText={setDescription}
                        />
                    </View>

                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    <TouchableOpacity style={styles.inputRow}>
                        <View style={styles.rowLabel}>
                            <Tag size={20} color={colors.textSecondary} />
                            <Text style={[styles.labelText, { color: colors.text }]}>Tags</Text>
                        </View>
                        <View style={styles.rowAction}>
                            <Text style={[styles.actionText, { color: colors.textSecondary }]}>Add tags</Text>
                            <ChevronRight size={18} color={colors.textSecondary} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.inputRow}>
                        <View style={styles.rowLabel}>
                            <Palette size={20} color={colors.textSecondary} />
                            <Text style={[styles.labelText, { color: colors.text }]}>Color Palette</Text>
                        </View>
                        <View style={styles.rowAction}>
                            <Text style={[styles.actionText, { color: colors.textSecondary }]}>Extract</Text>
                            <ChevronRight size={18} color={colors.textSecondary} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.inputRow}>
                        <View style={styles.rowLabel}>
                            <ImageIcon size={20} color={colors.textSecondary} />
                            <Text style={[styles.labelText, { color: colors.text }]}>Category</Text>
                        </View>
                        <View style={styles.rowAction}>
                            <Text style={[styles.actionText, { color: colors.textSecondary }]}>UI/UX Design</Text>
                            <ChevronRight size={18} color={colors.textSecondary} />
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.buttonContainer}>
                    <Button
                        title="Publish Post"
                        onPress={handlePublish}
                        loading={loading}
                        style={styles.mainButton}
                    />
                    <Button
                        title="Save as Draft"
                        variant="outline"
                        onPress={() => { }}
                        style={styles.draftButton}
                    />
                </View>

                <View style={{ height: 40 }} />
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
        padding: 24,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
    },
    publishText: {
        fontSize: 16,
        fontWeight: '700',
    },
    scrollContent: {
        flexGrow: 1,
    },
    imageSection: {
        paddingVertical: 12,
    },
    imageScroll: {
        paddingHorizontal: 24,
        gap: 16,
    },
    imagePreviewContainer: {
        width: 140,
        height: 140,
        borderRadius: 20,
        overflow: 'hidden',
        position: 'relative',
    },
    imagePreview: {
        width: '100%',
        height: '100%',
    },
    removeImage: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addImageButton: {
        width: 140,
        height: 140,
        borderRadius: 20,
        borderWidth: 2,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addImageText: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: 8,
    },
    form: {
        gap: 20,
    },
    titleInput: {
        fontSize: 24,
        fontWeight: '700',
        paddingVertical: 8,
    },
    divider: {
        height: 1,
        width: '100%',
    },
    descriptionRow: {
        flexDirection: 'row',
        gap: 12,
    },
    descriptionInput: {
        flex: 1,
        fontSize: 16,
        lineHeight: 24,
        textAlignVertical: 'top',
        minHeight: 100,
    },
    inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    rowLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    labelText: {
        fontSize: 16,
        fontWeight: '600',
    },
    rowAction: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    actionText: {
        fontSize: 14,
        fontWeight: '500',
    },
    buttonContainer: {
        padding: 24,
        gap: 12,
    },
    mainButton: {
        width: '100%',
    },
    draftButton: {
        width: '100%',
    },
});
