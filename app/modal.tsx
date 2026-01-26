import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { X, Search, Clock, TrendingUp, ArrowRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Input } from '../components/Input';
import { MOCK_POSTS } from '../constants/mockData';

const RECENT_SEARCHES = ['Dashboard', 'Modern Logo', '3D Abstract', 'Banking App'];
const TRENDING_TOPICS = ['Artificial Intelligence', 'Cyberpunk', 'Eco Branding', 'Vision Pro'];

export default function SearchModal() {
    const { colors, typography, spacing } = useTheme();
    const router = useRouter();
    const [search, setSearch] = useState('');

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <View style={styles.searchWrapper}>
                    <Search size={20} color={colors.textSecondary} />
                    <Input
                        placeholder="Search for inspiration..."
                        value={search}
                        onChangeText={setSearch}
                        autoFocus
                        style={styles.input}
                    />
                </View>
                <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                    <Text style={[styles.cancelText, { color: colors.primary }]}>Cancel</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                {!search ? (
                    <>
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Clock size={16} color={colors.textSecondary} />
                                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Recent Searches</Text>
                            </View>
                            <View style={styles.tagRow}>
                                {RECENT_SEARCHES.map(item => (
                                    <TouchableOpacity key={item} style={[styles.tag, { backgroundColor: colors.surfaceAlt }]}>
                                        <Text style={[styles.tagText, { color: colors.text }]}>{item}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <TrendingUp size={16} color={colors.textSecondary} />
                                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Trending Topics</Text>
                            </View>
                            {TRENDING_TOPICS.map(item => (
                                <TouchableOpacity key={item} style={[styles.trendingItem, { borderBottomColor: colors.border }]}>
                                    <Text style={[styles.trendingText, { color: colors.text }]}>{item}</Text>
                                    <ArrowRight size={16} color={colors.textMuted} />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </>
                ) : (
                    <View style={styles.results}>
                        <Text style={[styles.resultsTitle, { color: colors.textSecondary }]}>
                            Search results for "{search}"
                        </Text>
                        {/* Grid of results */}
                        <View style={styles.resultsGrid}>
                            {MOCK_POSTS.slice(0, 2).map(post => (
                                <TouchableOpacity
                                    key={post.id}
                                    style={styles.resultCard}
                                    onPress={() => router.push(`/post/${post.id}`)}
                                >
                                    <Image source={{ uri: post.image_url }} style={styles.resultImage} />
                                    <Text style={[styles.resultTitle, { color: colors.text }]} numberOfLines={1}>
                                        {post.title}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}
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
        alignItems: 'center',
        padding: 16,
        gap: 12,
    },
    searchWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f5f9', // Light gray
        borderRadius: 16,
        paddingHorizontal: 16,
    },
    input: {
        flex: 1,
        height: 48,
        borderWidth: 0,
        marginBottom: 0,
    },
    closeButton: {
        paddingHorizontal: 4,
    },
    cancelText: {
        fontWeight: '700',
        fontSize: 16,
    },
    content: {
        padding: 24,
    },
    section: {
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    tagRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    tag: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
    },
    tagText: {
        fontSize: 14,
        fontWeight: '600',
    },
    trendingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    trendingText: {
        fontSize: 16,
        fontWeight: '600',
    },
    results: {},
    resultsTitle: {
        fontSize: 14,
        marginBottom: 16,
    },
    resultsGrid: {
        flexDirection: 'row',
        gap: 16,
    },
    resultCard: {
        flex: 1,
    },
    resultImage: {
        width: '100%',
        height: 120,
        borderRadius: 12,
        marginBottom: 8,
    },
    resultTitle: {
        fontSize: 14,
        fontWeight: '600',
    },
});
