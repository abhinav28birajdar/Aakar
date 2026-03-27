import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Alert, Platform, KeyboardAvoidingView } from 'react-native';
import { useTheme } from '../src/hooks/useTheme';
import { ArrowLeft, Camera, Check, Link as LinkIcon, MapPin, AtSign, User, FileText, Globe } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { MOCK_USERS } from '../src/constants/mockData';
import * as ImagePicker from 'expo-image-picker';
import { Button } from '../src/components/atoms/Button';

export default function EditProfileScreen() {
    const { colors, typography, spacing } = useTheme();
    const router = useRouter();
    const user = MOCK_USERS[0];

    const [fullName, setFullName] = useState(user.full_name);
    const [username, setUsername] = useState(user.username);
    const [bio, setBio] = useState(user.bio);
    const [location, setLocation] = useState(user.location || '');
    const [website, setWebsite] = useState('ninja.design');
    const [avatar, setAvatar] = useState(user.avatar_url);
    const [cover, setCover] = useState(user.cover_image_url);

    const pickAvatar = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
        }
    };

    const pickCover = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setCover(result.assets[0].uri);
        }
    };

    const handleSave = () => {
        Alert.alert('Profile Updated', 'Your changes have been saved successfully.');
        router.back();
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                    <ArrowLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>Edit Profile</Text>
                <TouchableOpacity onPress={handleSave} style={[styles.saveButton, { backgroundColor: colors.primary + '15' }]}>
                    <Check size={20} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.imagesContainer}>
                        <TouchableOpacity onPress={pickCover} style={styles.coverContainer}>
                            <Image source={{ uri: cover }} style={styles.coverImage} />
                            <View style={[styles.cameraIconOverlay, { backgroundColor: 'rgba(0,0,0,0.4)' }]}>
                                <Camera size={24} color="white" />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={pickAvatar} style={styles.avatarContainer}>
                            <Image source={{ uri: avatar }} style={[styles.avatarImage, { borderColor: colors.background }]} />
                            <View style={[styles.avatarCameraIcon, { backgroundColor: colors.primary }]}>
                                <Camera size={14} color="white" />
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <View style={styles.inputLabelRow}>
                                <User size={18} color={colors.textSecondary} />
                                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Full Name</Text>
                            </View>
                            <TextInput
                                style={[styles.input, { color: colors.text, borderBottomColor: colors.border }]}
                                value={fullName}
                                onChangeText={setFullName}
                                placeholder="Enter your full name"
                                placeholderTextColor={colors.textMuted}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <View style={styles.inputLabelRow}>
                                <AtSign size={18} color={colors.textSecondary} />
                                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Username</Text>
                            </View>
                            <TextInput
                                style={[styles.input, { color: colors.text, borderBottomColor: colors.border }]}
                                value={username}
                                onChangeText={setUsername}
                                autoCapitalize="none"
                                placeholder="Choose a username"
                                placeholderTextColor={colors.textMuted}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <View style={styles.inputLabelRow}>
                                <FileText size={18} color={colors.textSecondary} />
                                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Bio</Text>
                            </View>
                            <TextInput
                                style={[styles.input, styles.bioInput, { color: colors.text, borderBottomColor: colors.border }]}
                                value={bio}
                                onChangeText={setBio}
                                multiline
                                placeholder="Tell us about yourself"
                                placeholderTextColor={colors.textMuted}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <View style={styles.inputLabelRow}>
                                <MapPin size={18} color={colors.textSecondary} />
                                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Location</Text>
                            </View>
                            <TextInput
                                style={[styles.input, { color: colors.text, borderBottomColor: colors.border }]}
                                value={location}
                                onChangeText={setLocation}
                                placeholder="Where are you based?"
                                placeholderTextColor={colors.textMuted}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <View style={styles.inputLabelRow}>
                                <LinkIcon size={18} color={colors.textSecondary} />
                                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Website</Text>
                            </View>
                            <TextInput
                                style={[styles.input, { color: colors.text, borderBottomColor: colors.border }]}
                                value={website}
                                onChangeText={setWebsite}
                                autoCapitalize="none"
                                placeholder="portfolio.design"
                                placeholderTextColor={colors.textMuted}
                            />
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <Button
                            title="Save Changes"
                            onPress={handleSave}
                            style={styles.mainButton}
                        />
                    </View>

                    <View style={{ height: 40 }} />
                </ScrollView>
            </KeyboardAvoidingView>
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
        padding: 16,
    },
    iconButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
    },
    saveButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagesContainer: {
        height: 200,
        marginBottom: 60,
    },
    coverContainer: {
        height: 160,
        width: '100%',
        position: 'relative',
    },
    coverImage: {
        width: '100%',
        height: '100%',
    },
    cameraIconOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'absolute',
        bottom: -40,
        left: 24,
    },
    avatarImage: {
        width: 100,
        height: 100,
        borderRadius: 35,
        borderWidth: 4,
    },
    avatarCameraIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'white',
    },
    form: {
        paddingHorizontal: 24,
        gap: 24,
    },
    inputGroup: {
        gap: 8,
    },
    inputLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
    },
    input: {
        fontSize: 16,
        fontWeight: '500',
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    bioInput: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    footer: {
        padding: 24,
        marginTop: 24,
    },
    mainButton: {
        width: '100%',
    },
});
