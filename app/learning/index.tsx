// ============================================================
// Learning Hub Screen - Tutorials & Skills
// ============================================================
import React, { useState } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView, TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Play, Book, Search, Filter, Star, Clock, ArrowLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/hooks/useTheme';
import { MOCK_TUTORIALS, CATEGORIES } from '../../src/data/mockData';
import { formatNumber } from '../../src/utils/helpers';

export default function LearningScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTutorials = MOCK_TUTORIALS.filter(t => {
        const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
        const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCat && matchesSearch;
    });

    const renderTutorialCard = ({ item }: { item: typeof MOCK_TUTORIALS[0] }) => (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.surface }]}
            onPress={() => router.push(`/learning/${item.id}`)}
            activeOpacity={0.8}
        >
            <View style={styles.imageContainer}>
                <Image source={{ uri: item.coverImage }} style={styles.coverImage} />
                {!item.isFree && (
                    <View style={styles.premiumBadge}>
                        <Text style={styles.premiumText}>PREMIUM</Text>
                    </View>
                )}
                <View style={styles.playIcon}>
                    <Play size={20} color="#fff" fill="#fff" />
                </View>
            </View>

            <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={2}>{item.title}</Text>
                <View style={styles.cardMeta}>
                    <View style={styles.metaItem}>
                        <Clock size={12} color={colors.textMuted} />
                        <Text style={[styles.metaText, { color: colors.textMuted }]}>{item.duration}m</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Star size={12} color="#FBBF24" fill="#FBBF24" />
                        <Text style={[styles.metaText, { color: colors.textMuted }]}>{item.difficulty}</Text>
                    </View>
                </View>
                <View style={styles.creatorRow}>
                    <Image source={{ uri: item.creator.avatar }} style={styles.creatorAvatar} />
                    <Text style={[styles.creatorName, { color: colors.textSecondary }]}>{item.creator.displayName}</Text>
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
                <Text style={[styles.title, { color: colors.text }]}>Learning Hub</Text>
                <TouchableOpacity>
                    <Book size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <View style={styles.searchBarContainer}>
                <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Search size={18} color={colors.textMuted} />
                    <TextInput
                        style={[styles.searchInput, { color: colors.text }]}
                        placeholder="Search tutorials, skills..."
                        placeholderTextColor={colors.textMuted}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <Filter size={18} color={colors.textMuted} />
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Categories */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
                    {CATEGORIES.map(cat => (
                        <TouchableOpacity
                            key={cat}
                            style={[
                                styles.catChip,
                                {
                                    backgroundColor: selectedCategory === cat ? colors.primary : colors.surface,
                                    borderColor: colors.border
                                }
                            ]}
                            onPress={() => setSelectedCategory(cat)}
                        >
                            <Text style={[styles.catText, { color: selectedCategory === cat ? '#fff' : colors.textSecondary }]}>
                                {cat}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Continue Learning (Simulated) */}
                {searchQuery === '' && (
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Continue Learning</Text>
                        <TouchableOpacity style={[styles.continueCard, { backgroundColor: colors.primary + '10' }]}>
                            <View style={styles.progressCircle}>
                                <Text style={[styles.progressText, { color: colors.primary }]}>65%</Text>
                            </View>
                            <View style={{ flex: 1, marginLeft: 16 }}>
                                <Text style={[styles.continueTitle, { color: colors.text }]}>Advanced Auto Layout</Text>
                                <Text style={[styles.continueSub, { color: colors.textSecondary }]}>Next: Constraints & Resizing</Text>
                            </View>
                            <Play size={20} color={colors.primary} />
                        </TouchableOpacity>
                    </View>
                )}

                {/* Tutorial List */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        {selectedCategory === 'All' ? 'Latest Tutorials' : `${selectedCategory} Tutorials`}
                    </Text>
                    <FlatList
                        data={filteredTutorials}
                        renderItem={renderTutorialCard}
                        keyExtractor={item => item.id}
                        numColumns={2}
                        scrollEnabled={false}
                        columnWrapperStyle={styles.gridRow}
                        ListEmptyComponent={
                            <View style={styles.empty}>
                                <Play size={48} color={colors.textMuted} />
                                <Text style={[styles.emptyText, { color: colors.textMuted }]}>No tutorials found</Text>
                            </View>
                        }
                    />
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14 },
    title: { fontSize: 22, fontWeight: '900' },
    searchBarContainer: { paddingHorizontal: 20, marginBottom: 16 },
    searchBar: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 14, height: 44, borderWidth: 1, gap: 8 },
    searchInput: { flex: 1, fontSize: 15, height: '100%' },
    catRow: { paddingHorizontal: 20, gap: 8, marginBottom: 24, paddingBottom: 4 },
    catChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
    catText: { fontSize: 13, fontWeight: '700' },
    section: { paddingHorizontal: 20, marginBottom: 24 },
    sectionTitle: { fontSize: 18, fontWeight: '800', marginBottom: 16 },
    continueCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 20 },
    progressCircle: { width: 48, height: 48, borderRadius: 24, borderWidth: 3, borderColor: '#667eea', justifyContent: 'center', alignItems: 'center' },
    progressText: { fontSize: 12, fontWeight: '800' },
    continueTitle: { fontSize: 15, fontWeight: '700', marginBottom: 2 },
    continueSub: { fontSize: 12 },
    gridRow: { gap: 16, marginBottom: 16 },
    card: { flex: 1, borderRadius: 20, overflow: 'hidden', height: 260 },
    imageContainer: { width: '100%', height: 140 },
    coverImage: { width: '100%', height: '100%' },
    premiumBadge: { position: 'absolute', top: 10, left: 10, backgroundColor: '#FBBF24', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    premiumText: { fontSize: 8, fontWeight: '900', color: '#000' },
    playIcon: { position: 'absolute', bottom: 10, right: 10, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    cardContent: { padding: 12, flex: 1, justifyContent: 'space-between' },
    cardTitle: { fontSize: 14, fontWeight: '700', lineHeight: 18, marginBottom: 6 },
    cardMeta: { flexDirection: 'row', gap: 12, marginBottom: 8 },
    metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    metaText: { fontSize: 11, fontWeight: '600' },
    creatorRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    creatorAvatar: { width: 20, height: 20, borderRadius: 10 },
    creatorName: { fontSize: 11, fontWeight: '600' },
    empty: { alignItems: 'center', paddingTop: 40, gap: 12 },
    emptyText: { fontSize: 15 },
});
