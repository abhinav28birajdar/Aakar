// ============================================================
// Profile Setup Screen - Name, Bio, Photo
// ============================================================
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera, ArrowRight, MapPin, Globe } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../src/hooks/useTheme';
import { useAuthStore } from '../../src/stores/authStore';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileSetupScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { updateProfile } = useAuthStore();

  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant photo library access');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleContinue = async () => {
    if (!displayName.trim()) {
      Alert.alert('Required', 'Please enter your name');
      return;
    }
    setLoading(true);
    await updateProfile({
      displayName: displayName.trim(),
      bio: bio.trim(),
      location: location.trim(),
      website: website.trim(),
      avatar: avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    });
    setLoading(false);
    router.push('/onboarding/skills');
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.step, { color: colors.primary }]}>Step 2 of 3</Text>
          <Text style={[styles.title, { color: colors.text }]}>Set Up Your Profile</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Let the community know who you are</Text>
        </View>

        {/* Avatar */}
        <TouchableOpacity style={styles.avatarSection} onPress={pickImage}>
          <View style={[styles.avatarContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Camera size={32} color={colors.textMuted} />
                <Text style={[styles.avatarText, { color: colors.textMuted }]}>Add Photo</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        {/* Fields */}
        <View style={styles.fields}>
          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.text }]}>Display Name *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
              value={displayName} onChangeText={setDisplayName}
              placeholder="Your name" placeholderTextColor={colors.textMuted}
            />
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.text }]}>Bio</Text>
            <TextInput
              style={[styles.textArea, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
              value={bio} onChangeText={t => setBio(t.slice(0, 150))}
              placeholder="Tell us about yourself..."
              placeholderTextColor={colors.textMuted}
              multiline numberOfLines={3} textAlignVertical="top"
            />
            <Text style={[styles.counter, { color: colors.textMuted }]}>{bio.length}/150</Text>
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.text }]}>Location</Text>
            <View style={[styles.iconInput, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <MapPin size={18} color={colors.textMuted} />
              <TextInput
                style={[styles.iconInputText, { color: colors.text }]}
                value={location} onChangeText={setLocation}
                placeholder="City, Country" placeholderTextColor={colors.textMuted}
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.text }]}>Website</Text>
            <View style={[styles.iconInput, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Globe size={18} color={colors.textMuted} />
              <TextInput
                style={[styles.iconInputText, { color: colors.text }]}
                value={website} onChangeText={setWebsite}
                placeholder="https://yourwebsite.com" placeholderTextColor={colors.textMuted}
                autoCapitalize="none" keyboardType="url"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottom}>
        <TouchableOpacity onPress={() => router.push('/onboarding/skills')} style={{ marginBottom: 12 }}>
          <Text style={{ color: colors.textMuted, fontSize: 15, textAlign: 'center', fontWeight: '600' }}>Skip for now</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleContinue} disabled={loading} activeOpacity={0.8}>
          <LinearGradient colors={['#667eea', '#764ba2']} style={styles.continueBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            {loading ? <ActivityIndicator color="#fff" /> : (
              <>
                <Text style={styles.continueBtnText}>Continue</Text>
                <ArrowRight size={20} color="#fff" />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 24 },
  header: { marginTop: 16, marginBottom: 24 },
  step: { fontSize: 13, fontWeight: '700', marginBottom: 8 },
  title: { fontSize: 26, fontWeight: '800', marginBottom: 6 },
  subtitle: { fontSize: 15 },
  avatarSection: { alignItems: 'center', marginBottom: 24 },
  avatarContainer: { width: 110, height: 110, borderRadius: 55, borderWidth: 2, borderStyle: 'dashed', overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  avatarImage: { width: '100%', height: '100%' },
  avatarPlaceholder: { alignItems: 'center', gap: 4 },
  avatarText: { fontSize: 12, fontWeight: '600' },
  fields: { gap: 16 },
  field: {},
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  input: { height: 52, borderRadius: 14, paddingHorizontal: 16, fontSize: 16, borderWidth: 1 },
  textArea: { minHeight: 90, borderRadius: 14, paddingHorizontal: 16, paddingTop: 14, fontSize: 16, borderWidth: 1 },
  counter: { fontSize: 12, textAlign: 'right', marginTop: 4 },
  iconInput: { flexDirection: 'row', alignItems: 'center', height: 52, borderRadius: 14, paddingHorizontal: 16, borderWidth: 1, gap: 10 },
  iconInputText: { flex: 1, fontSize: 16, height: '100%' },
  bottom: { paddingHorizontal: 24, paddingBottom: 20, paddingTop: 8 },
  continueBtn: { height: 56, borderRadius: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  continueBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
