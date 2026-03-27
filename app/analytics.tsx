import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '../src/hooks/useTheme';
import { ArrowLeft, TrendingUp, Users, Eye, Heart, BarChart3, ChevronDown, Download } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
    const { colors, typography, spacing } = useTheme();
    const router = useRouter();
    const [timeRange, setTimeRange] = useState('Last 30 Days');

    const StatCard = ({ label, value, trend, icon: Icon, color }: any) => (
        <View style={[styles.statCard, { backgroundColor: colors.surfaceAlt }]}>
            <View style={styles.statHeader}>
                <View style={[styles.statIcon, { backgroundColor: color + '15' }]}>
                    <Icon size={20} color={color} />
                </View>
                <View style={styles.trendBadge}>
                    <TrendingUp size={12} color={colors.success} />
                    <Text style={[styles.trendText, { color: colors.success }]}>{trend}%</Text>
                </View>
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                    <ArrowLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>Analytics</Text>
                <TouchableOpacity style={styles.iconButton}>
                    <Download size={22} color={colors.text} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <TouchableOpacity style={[styles.timeSelector, { backgroundColor: colors.surfaceAlt }]}>
                    <Text style={[styles.timeRange, { color: colors.text }]}>{timeRange}</Text>
                    <ChevronDown size={18} color={colors.textSecondary} />
                </TouchableOpacity>

                <View style={styles.statsGrid}>
                    <StatCard label="Profile Views" value="4,820" trend="12.5" icon={Eye} color={colors.primary} />
                    <StatCard label="App Impressions" value="45.2k" trend="8.2" icon={TrendingUp} color={colors.accent} />
                    <StatCard label="Total Likes" value="1,240" trend="24.1" icon={Heart} color={colors.error} />
                    <StatCard label="New Followers" value="342" trend="18.7" icon={Users} color={colors.success} />
                </View>

                <View style={[styles.chartSection, { backgroundColor: colors.surfaceAlt, marginTop: 24 }]}>
                    <View style={styles.chartHeader}>
                        <Text style={[styles.chartTitle, { color: colors.text }]}>Audience Engagement</Text>
                        <BarChart3 size={20} color={colors.primary} />
                    </View>
                    <View style={styles.chartPlaceholder}>
                        {/* Shimmering / Placeholder for real chart */}
                        {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                            <MotiView
                                key={i}
                                from={{ height: 0 }}
                                animate={{ height: h * 1.5 }}
                                transition={{ delay: i * 100, type: 'spring' }}
                                style={[styles.chartBar, { backgroundColor: colors.primary }]}
                            />
                        ))}
                    </View>
                    <View style={styles.chartLabels}>
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(l => (
                            <Text key={l} style={[styles.chartLabel, { color: colors.textSecondary }]}>{l}</Text>
                        ))}
                    </View>
                </View>

                <View style={styles.topPostsSection}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Top Performing Posts</Text>
                    {[1, 2, 3].map((i) => (
                        <View key={i} style={[styles.topPostItem, { borderBottomColor: colors.border }]}>
                            <View style={[styles.postThumb, { backgroundColor: colors.surfaceAlt }]} />
                            <View style={styles.postInfo}>
                                <Text style={[styles.postTitle, { color: colors.text }]}>Dashboard Design v{i}</Text>
                                <Text style={[styles.postMetrics, { color: colors.textSecondary }]}>
                                    {1200 * i} views • {45 * i} likes
                                </Text>
                            </View>
                            <View style={styles.rankBadge}>
                                <Text style={[styles.rankText, { color: colors.primary }]}>#{i}</Text>
                            </View>
                        </View>
                    ))}
                </View>
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
        padding: 16,
    },
    iconButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    timeSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 14,
        marginBottom: 24,
    },
    timeRange: {
        fontSize: 15,
        fontWeight: '700',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    statCard: {
        width: (width - 64) / 2,
        padding: 16,
        borderRadius: 24,
        gap: 12,
    },
    statHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    trendBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    trendText: {
        fontSize: 10,
        fontWeight: '800',
    },
    statValue: {
        fontSize: 24,
        fontWeight: '800',
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '600',
    },
    chartSection: {
        padding: 24,
        borderRadius: 28,
    },
    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    chartPlaceholder: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: 150,
        paddingHorizontal: 10,
    },
    chartBar: {
        width: 25,
        borderRadius: 8,
    },
    chartLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
        paddingHorizontal: 5,
    },
    chartLabel: {
        fontSize: 10,
        fontWeight: '700',
    },
    topPostsSection: {
        marginTop: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 20,
    },
    topPostItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    postThumb: {
        width: 56,
        height: 56,
        borderRadius: 14,
    },
    postInfo: {
        flex: 1,
        marginLeft: 16,
    },
    postTitle: {
        fontSize: 15,
        fontWeight: '700',
    },
    postMetrics: {
        fontSize: 13,
        marginTop: 4,
    },
    rankBadge: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rankText: {
        fontSize: 16,
        fontWeight: '800',
    },
});
