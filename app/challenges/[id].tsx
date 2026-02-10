// ============================================================
// Challenge Detail Screen - challenges/[id].tsx
// ============================================================
import React from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Trophy, Users, Clock, Share2, Star } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../src/hooks/useTheme';
import { MOCK_CHALLENGES } from '../../src/data/mockData';
import { Button } from '../../src/components/atoms';

const { width } = Dimensions.get('window');

export default function ChallengeDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { colors } = useTheme();

    const challenge = MOCK_CHALLENGES.find(c => c.id === id) || MOCK_CHALLENGES[0];

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Cover & Header */}
                <View style={styles.imageContainer}>
                    <Image source={{ uri: challenge.coverImage }} style={styles.coverImage} />
                    <LinearGradient colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(0,0,0,0.8)']} style={styles.overlay} />

                    <View style={styles.headerRow}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                            <ArrowLeft size={24} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconBtn}>
                            <Share2 size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.heroContent}>
                        <View style={styles.statusBadge}>
                            <Clock size={14} color="#fff" />
                            <Text style={styles.statusText}>{challenge.status.toUpperCase()}</Text>
                        </View>
                        <Text style={styles.heroTitle}>{challenge.title}</Text>
                    </View>
                </View>

                {/* Stats Bar */}
                <View style={[styles.statsBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
                    <View style={styles.statItem}>
                        <Users size={20} color={colors.primary} />
                        <Text style={[styles.statValue, { color: colors.text }]}>{challenge.submissionsCount}</Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Participants</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.statItem}>
                        <Clock size={20} color={colors.primary} />
                        <Text style={[styles.statValue, { color: colors.text }]}>4 Days</Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Remaining</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.statItem}>
                        <Trophy size={20} color="#FBBF24" />
                        <Text style={[styles.statValue, { color: colors.text }]}>$500</Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Prize Pool</Text>
                    </View>
                </View>

                {/* Description */}
                <View style={styles.content}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
                    <Text style={[styles.description, { color: colors.textSecondary }]}>{challenge.description}</Text>

                    <Text style={[styles.sectionTitle, { color: colors.text }]}>The Brief</Text>
                    <Text style={[styles.description, { color: colors.textSecondary }]}>
                        Design a modern, minimal dashboard for a creative project management tool. Focus on user experience, clarity, and visual aesthetics.
                        \n\nRequirements:\n- Must include a light and dark mode\n- Use the brand colors provided\n- Include a mobile responsive version
                    </Text>

                    {/* Rules */}
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Rules & Eligibility</Text>
                    {[
                        'Open to all skill levels',
                        'Submissions must be original work',
                        'Maximum 3 entries per user',
                        'Winners announced in 7 days after closing'
                    ].map((rule, i) => (
                        <View key={i} style={styles.ruleRow}>
                            <Star size={16} color={colors.primary} />
                            <Text style={[styles.ruleText, { color: colors.textSecondary }]}>{rule}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Bottom CTA */}
            <View style={[styles.bottomBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
                <Button
                    title="Submit Your Entry"
                    onPress={() => { }}
                    style={{ flex: 1 }}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1 },
    imageContainer: { width: '100%', height: 350 },
    coverImage: { width: '100%', height: '100%' },
    overlay: { ...StyleSheet.absoluteFillObject },
    headerRow: { position: 'absolute', top: 20, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between' },
    iconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
    heroContent: { position: 'absolute', bottom: 30, left: 20, right: 20 },
    statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#667eea', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginBottom: 12 },
    statusText: { color: '#fff', fontSize: 12, fontWeight: '800' },
    heroTitle: { color: '#fff', fontSize: 32, fontWeight: '900' },
    statsBar: { flexDirection: 'row', paddingVertical: 20, borderBottomWidth: 1 },
    statItem: { flex: 1, alignItems: 'center', gap: 4 },
    statValue: { fontSize: 18, fontWeight: '800' },
    statLabel: { fontSize: 12, fontWeight: '600' },
    divider: { width: 1, height: '60%', backgroundColor: 'rgba(0,0,0,0.1)', alignSelf: 'center' },
    content: { padding: 20 },
    sectionTitle: { fontSize: 20, fontWeight: '800', marginTop: 24, marginBottom: 12 },
    description: { fontSize: 15, lineHeight: 24 },
    ruleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
    ruleText: { fontSize: 14 },
    bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, borderTopWidth: 1 },
});
