// ============================================================
// Role Selection Screen - Designer / Learner / Recruiter / Mentor
// ============================================================
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Palette, BookOpen, Search, GraduationCap, ArrowRight } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useAuthStore } from '../../src/stores/authStore';
import { UserRole } from '../../src/types';
import { SafeAreaView } from 'react-native-safe-area-context';

const roles: { id: UserRole; title: string; desc: string; icon: any; gradient: [string, string] }[] = [
  { id: 'designer', title: 'Creator', desc: 'Showcase your work, get hired, and build your brand. Full access to creator studio.', icon: Palette, gradient: ['#667eea', '#764ba2'] },
  { id: 'learner', title: 'Learner', desc: 'Discover inspiration, tutorials, and grow your skills with the community.', icon: BookOpen, gradient: ['#f97316', '#ef4444'] },
  { id: 'recruiter', title: 'Client / Recruiter', desc: 'Find talented designers, post jobs, and hire the best creative talent.', icon: Search, gradient: ['#10b981', '#059669'] },
  { id: 'mentor', title: 'Mentor', desc: 'Share your expertise, guide learners, and earn from mentorship sessions.', icon: GraduationCap, gradient: ['#8b5cf6', '#6d28d9'] },
];

export default function RoleSelectScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { setRole } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleContinue = () => {
    if (!selectedRole) return;
    setRole(selectedRole);
    router.push('/onboarding/profile-setup');
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>What brings you here?</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Choose your role. You can always change this later.
          </Text>
        </View>

        <View style={styles.cards}>
          {roles.map(role => {
            const isSelected = selectedRole === role.id;
            return (
              <TouchableOpacity
                key={role.id}
                style={[
                  styles.card,
                  { backgroundColor: colors.surface, borderColor: isSelected ? role.gradient[0] : colors.border },
                  isSelected && { borderWidth: 2 },
                ]}
                onPress={() => setSelectedRole(role.id)}
                activeOpacity={0.7}
              >
                <LinearGradient colors={role.gradient} style={styles.cardIcon}>
                  <role.icon size={24} color="#fff" />
                </LinearGradient>
                <View style={styles.cardContent}>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>{role.title}</Text>
                  <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>{role.desc}</Text>
                </View>
                <View style={[styles.radio, { borderColor: isSelected ? role.gradient[0] : colors.border }]}>
                  {isSelected && <View style={[styles.radioInner, { backgroundColor: role.gradient[0] }]} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.bottom}>
        <TouchableOpacity onPress={handleContinue} disabled={!selectedRole} activeOpacity={0.8}>
          <LinearGradient
            colors={selectedRole ? ['#667eea', '#764ba2'] : ['#ccc', '#aaa']}
            style={styles.continueBtn}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          >
            <Text style={styles.continueBtnText}>Continue</Text>
            <ArrowRight size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 24 },
  header: { marginTop: 24, marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 8 },
  subtitle: { fontSize: 16, lineHeight: 22 },
  cards: { gap: 14 },
  card: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 1, gap: 14 },
  cardIcon: { width: 52, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 17, fontWeight: '700', marginBottom: 4 },
  cardDesc: { fontSize: 13, lineHeight: 18 },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  radioInner: { width: 12, height: 12, borderRadius: 6 },
  bottom: { paddingHorizontal: 24, paddingBottom: 20, paddingTop: 12 },
  continueBtn: { height: 56, borderRadius: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  continueBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
