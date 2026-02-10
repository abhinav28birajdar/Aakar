// ============================================================
// Design Challenges Screen
// ============================================================
import React from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Trophy, Users, Clock, ArrowRight, ArrowLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../src/hooks/useTheme';
import { MOCK_CHALLENGES } from '../../src/data/mockData';
import { formatNumber } from '../../src/utils/helpers';

const { width } = Dimensions.get('window');

export default function ChallengesScreen() {
    const router = useRouter();
    const { colors } = useTheme();

    const activeChallenges = MOCK_CHALLENGES.filter(c => c.status === 'active');
    const upcomingChallenges = MOCK_CHALLENGES.filter(c => c.status === 'upcoming');

    const renderChallengeCard = ({ item }: { item: typeof MOCK_CHALLENGES[0] }) => (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.surface }]}
            onPress={() => router.push(`/challenges/${item.id}`)}
            activeOpacity={0.9}
        >
            <Image source={{ uri: item.coverImage }} style={styles.cardCover} />
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.cardGradient}
            />

            <View style={styles.cardContent}>
                <View style={styles.statusBadge}>
                    <Clock size={12} color="#fff" />
                    <Text style={styles.statusText}>{item.status === 'active' ? 'Ends in 4 days' : 'Coming Soon'}</Text>
                </View>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <View style={styles.cardStats}>
                    <View style={styles.stat}>
                        <Users size={14} color="rgba(255,255,255,0.8)" />
                        <Text style={styles.statText}>{formatNumber(item.submissionsCount)} submissions</Text>
                    </View>
                    <View style={styles.stat}>
                        <Trophy size={14} color="#FBBF24" />
                        <Text style={styles.statText}>Prizes available</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <ArrowLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>Design Challenges</Text>
                <TouchableOpacity>
                    <Trophy size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Featured Hero */}
                {activeChallenges.length > 0 && (
                    <TouchableOpacity
                        style={styles.hero}
                        activeOpacity={0.9}
                        onPress={() => router.push(`/challenges/${activeChallenges[0].id}`)}
                    >
                        <Image source={{ uri: activeChallenges[0].coverImage }} style={styles.heroImage} />
                        <LinearGradient colors={['rgba(102,126,234,0.8)', 'rgba(118,75,162,0.8)']} style={styles.heroOverlay}>
                            <View style={styles.heroBadge}>
                                <Text style={styles.heroBadgeText}>FEATURED CHALLENGE</Text>
                            </View>
                            <Text style={styles.heroTitle}>{activeChallenges[0].title}</Text>
                            <Text style={styles.heroDesc}>{activeChallenges[0].description}</Text>
                            <View style={styles.heroBtn}>
                                <Text style={styles.heroBtnText}>Join Now</Text>
                                <ArrowRight size={18} color="#667eea" />
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                )}

                {/* Section: Active Challenges */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Active Now</Text>
                        <TouchableOpacity><Text style={{ color: colors.primary, fontWeight: '700' }}>See All</Text></TouchableOpacity>
                    </View>
                    <FlatList
                        data={activeChallenges}
                        renderItem={renderChallengeCard}
                        keyExtractor={item => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}
                    />
                </View>

                {/* Info Banner */}
                <View style={[styles.banner, { backgroundColor: colors.primary + '10' }]}>
                    <Trophy size={32} color={colors.primary} />
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.bannerTitle, { color: colors.text }]}>Win Amazing Prizes!</Text>
                        <Text style={[styles.bannerDesc, { color: colors.textSecondary }]}>Showcase your skills and get matched with top recruiters.</Text>
                    </View>
                </View>

                {/* Section: Upcoming */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Upcoming</Text>
                    </View>
                    {upcomingChallenges.map(item => (
                        <TouchableOpacity
                            key={item.id}
                            style={[styles.upcomingRow, { backgroundColor: colors.surface }]}
                            onPress={() => router.push(`/challenges/${item.id}`)}
                        >
                            <Image source={{ uri: item.coverImage }} style={styles.upcomingThumb} />
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.upcomingTitle, { color: colors.text }]}>{item.title}</Text>
                                <Text style={[styles.upcomingDate, { color: colors.textMuted }]}>Starts in 3 days</Text>
                            </View>
                            <ArrowRight size={20} color={colors.textMuted} />
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14 },
    title: { fontSize: 22, fontWeight: '900' },
    hero: { margin: 20, height: 240, borderRadius: 24, overflow: 'hidden' },
    heroImage: { width: '100%', height: '100%' },
    heroOverlay: { ...StyleSheet.absoluteFillObject, padding: 24, justifyContent: 'flex-end' },
    heroBadge: { backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 12 },
    heroBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
    heroTitle: { color: '#fff', fontSize: 24, fontWeight: '900', marginBottom: 8 },
    heroDesc: { color: 'rgba(255,255,255,0.9)', fontSize: 14, marginBottom: 20, lineHeight: 20 },
    heroBtn: { backgroundColor: '#fff', alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
    heroBtnText: { color: '#667eea', fontWeight: '800', fontSize: 14 },
    section: { marginBottom: 28 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 },
    sectionTitle: { fontSize: 18, fontWeight: '800' },
    card: { width: width * 0.7, height: 350, borderRadius: 20, overflow: 'hidden' },
    cardCover: { width: '100%', height: '100%' },
    cardGradient: { ...StyleSheet.absoluteFillObject },
    cardContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20 },
    statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(0,0,0,0.4)', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginBottom: 12 },
    statusText: { color: '#fff', fontSize: 11, fontWeight: '700' },
    cardTitle: { color: '#fff', fontSize: 18, fontWeight: '800', marginBottom: 8 },
    cardStats: { flexDirection: 'row', gap: 16 },
    stat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    statText: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600' },
    banner: { marginHorizontal: 20, padding: 20, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 28 },
    bannerTitle: { fontSize: 16, fontWeight: '800', marginBottom: 2 },
    bannerDesc: { fontSize: 13, lineHeight: 18 },
    upcomingRow: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, padding: 12, borderRadius: 18, gap: 12, marginBottom: 12 },
    upcomingThumb: { width: 56, height: 56, borderRadius: 12 },
    upcomingTitle: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
    upcomingDate: { fontSize: 13 },
});
