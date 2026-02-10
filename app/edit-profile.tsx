// ============================================================
// Edit Profile Screen
// ============================================================
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput,
  Image, Alert, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Camera, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../src/hooks/useTheme';
import { useAuthStore } from '../src/stores/authStore';

export default function EditProfileScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user, updateProfile } = useAuthStore();

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [location, setLocation] = useState(user?.location || '');
  const [website, setWebsite] = useState(user?.website || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [loading, setLoading] = useState(false);

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) setAvatar(result.assets[0].uri);
  };

  const handleSave = async () => {
    if (!displayName.trim()) return Alert.alert('Error', 'Display name is required');
    setLoading(true);
    await updateProfile({ displayName, username, bio, location, website, avatar });
    setLoading(false);
    router.back();
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} disabled={loading}>
          {loading ? <ActivityIndicator color={colors.primary} /> : (
            <Text style={[styles.saveText, { color: colors.primary }]}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <TouchableOpacity style={styles.avatarSection} onPress={pickAvatar}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
          <View style={[styles.cameraOverlay, { backgroundColor: colors.primary }]}>
            <Camera size={18} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* Fields */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Display Name</Text>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
            value={displayName} onChangeText={setDisplayName} maxLength={40}
          />
        </View>
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Username</Text>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
            value={username} onChangeText={setUsername} autoCapitalize="none" maxLength={30}
          />
        </View>
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Bio</Text>
          <TextInput
            style={[styles.input, styles.bioInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
            value={bio} onChangeText={setBio} multiline maxLength={160} textAlignVertical="top"
          />
          <Text style={[styles.charCount, { color: colors.textMuted }]}>{bio.length}/160</Text>
        </View>
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Location</Text>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
            value={location} onChangeText={setLocation} placeholder="City, Country" placeholderTextColor={colors.textMuted}
          />
        </View>
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Website</Text>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
            value={website} onChangeText={setWebsite} placeholder="https://..." placeholderTextColor={colors.textMuted}
            autoCapitalize="none" keyboardType="url"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14 },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  saveText: { fontSize: 16, fontWeight: '700' },
  body: { paddingHorizontal: 20, paddingBottom: 40 },
  avatarSection: { alignItems: 'center', marginVertical: 24 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  cameraOverlay: { position: 'absolute', bottom: 0, right: '35%', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },
  fieldGroup: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '700', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, height: 48, fontSize: 15 },
  bioInput: { height: 100, paddingTop: 14 },
  charCount: { fontSize: 12, textAlign: 'right', marginTop: 4 },
});
