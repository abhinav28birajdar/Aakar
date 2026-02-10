// ============================================================
// Permissions Request Screen (optional)
// ============================================================
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, Camera, Image, ArrowRight } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import * as Notifications from 'expo-notifications';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';

const PERMISSIONS = [
  { key: 'notifications', icon: Bell, title: 'Notifications', desc: 'Get updates on likes, comments, and messages', color: '#FF6B6B' },
  { key: 'camera', icon: Camera, title: 'Camera', desc: 'Take photos for posts and stories', color: '#4ecdc4' },
  { key: 'photos', icon: Image, title: 'Photo Library', desc: 'Upload images from your gallery', color: '#45B7D1' },
];

export default function PermissionsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [granted, setGranted] = useState<Record<string, boolean>>({});

  const requestPermission = async (key: string) => {
    try {
      let result = false;
      if (key === 'notifications') {
        const { status } = await Notifications.requestPermissionsAsync();
        result = status === 'granted';
      } else if (key === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        result = status === 'granted';
      } else if (key === 'photos') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        result = status === 'granted';
      }
      setGranted(prev => ({ ...prev, [key]: result }));
    } catch {
      setGranted(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleContinue = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Enable Permissions</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          These help you get the most out of Aakar
        </Text>

        <View style={styles.permList}>
          {PERMISSIONS.map(p => {
            const Icon = p.icon;
            const isGranted = granted[p.key];
            return (
              <View key={p.key} style={[styles.permRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={[styles.iconCircle, { backgroundColor: p.color + '20' }]}>
                  <Icon size={22} color={p.color} />
                </View>
                <View style={styles.permInfo}>
                  <Text style={[styles.permTitle, { color: colors.text }]}>{p.title}</Text>
                  <Text style={[styles.permDesc, { color: colors.textSecondary }]}>{p.desc}</Text>
                </View>
                <TouchableOpacity
                  style={[styles.allowBtn, { backgroundColor: isGranted ? '#4CAF50' : colors.primary }]}
                  onPress={() => requestPermission(p.key)}
                  disabled={isGranted}
                >
                  <Text style={styles.allowText}>{isGranted ? 'Granted' : 'Allow'}</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.bottom}>
        <TouchableOpacity onPress={handleContinue} style={{ width: '100%' }} activeOpacity={0.8}>
          <LinearGradient colors={['#667eea', '#764ba2']} style={styles.btn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Text style={styles.btnText}>Continue</Text>
            <ArrowRight size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleContinue} style={styles.skipBtn}>
          <Text style={[styles.skipText, { color: colors.textSecondary }]}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 40 },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 8 },
  subtitle: { fontSize: 15, marginBottom: 32, lineHeight: 22 },
  permList: { gap: 16 },
  permRow: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 1, gap: 14 },
  iconCircle: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  permInfo: { flex: 1 },
  permTitle: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
  permDesc: { fontSize: 13, lineHeight: 18 },
  allowBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  allowText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  bottom: { paddingHorizontal: 24, paddingBottom: 32, alignItems: 'center' },
  btn: { height: 56, borderRadius: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  skipBtn: { marginTop: 16 },
  skipText: { fontSize: 15, fontWeight: '600' },
});
