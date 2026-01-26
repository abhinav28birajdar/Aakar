import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');
import { useTheme } from '../contexts/ThemeContext';

import { useAuth } from '../contexts/AuthContext';
import { Image } from 'expo-image';
import { ArrowLeft, Camera, User, AtSign, Globe, MapPin, Briefcase } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export default function EditProfileScreen() {
    const { colors } = useTheme();
    const router = useRouter();
    const { user } = useAuth(); // Can be null, treat carefully

    // Default values if user is null or missing fields
    const [fullName, setFullName] = useState(user?.name || '');
    const [username, setUsername] = useState(user?.username || '');
    const [bio, setBio] = useState('Product Designer'); // Mock default since User type lacks bio
    const [website, setWebsite] = useState('ninja.design');
    const [location, setLocation] = useState('San Francisco, CA');

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>Edit Profile</Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={[styles.save, { color: colors.primary }]}>Save</Text>
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                    {/* Avatar Edit */}
                    <View style={styles.avatarContainer}>
                        <Image source={{ uri: user?.avatar_url || 'https://i.pravatar.cc/150' }} style={styles.avatar} />
                        <TouchableOpacity style={[styles.cameraButton, { backgroundColor: colors.primary }]}>
                            <Camera size={20} color="white" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.form}>
                        <Input
                            label="Full Name"
                            value={fullName}
                            onChangeText={setFullName}
                            leftIcon={<User size={20} color={colors.textSecondary} />}
                        />
                        <Input
                            label="Username"
                            value={username}
                            onChangeText={setUsername}
                            leftIcon={<AtSign size={20} color={colors.textSecondary} />}
                            autoCapitalize="none"
                        />
                        <Input
                            label="Bio"
                            value={bio}
                            onChangeText={setBio}
                            multiline
                            numberOfLines={3}
                            style={{ height: 100 }}
                        />
                        <Input
                            label="Website"
                            value={website}
                            onChangeText={setWebsite}
                            leftIcon={<Globe size={20} color={colors.textSecondary} />}
                            autoCapitalize="none"
                        />
                        <Input
                            label="Location"
                            value={location}
                            onChangeText={setLocation}
                            leftIcon={<MapPin size={20} color={colors.textSecondary} />}
                        />
                    </View>

                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Social Links</Text>
                        <Button title="Add Behance" variant="outline" onPress={() => { }} style={styles.socialButton} />
                        <Button title="Add Dribbble" variant="outline" onPress={() => { }} style={styles.socialButton} />
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
    backButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
    },
    save: {
        fontSize: 16,
        fontWeight: '700',
        paddingRight: 8,
    },
    content: {
        padding: 24,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 32,
        position: 'relative',
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 40,
    },
    cameraButton: {
        position: 'absolute',
        bottom: -10,
        right: (width - 48) / 2 - 60,
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: 'white',
    },
    form: {
        gap: 8,
    },
    section: {
        marginTop: 32,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        textTransform: 'uppercase',
        marginBottom: 16,
    },
    socialButton: {
        marginBottom: 12,
    },
});
