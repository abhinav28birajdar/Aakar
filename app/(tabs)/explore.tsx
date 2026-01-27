import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, TextInput, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/hooks/useTheme';
import { Search, Filter, TrendingUp, Grid, List, Sparkles } from 'lucide-react-native';
import { Image } from 'expo-image';
import { CATEGORIES, MOCK_POSTS } from '../../src/constants/mockData';
import { MotiView } from 'moti';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const FEATURED_CATEGORIES = [
    { id: 1, name: 'UI/UX Design', image: 'https://images.unsplash.com/photo-1586717791821-3f44a563cc4c?q=80&w=400&fit=crop', count: '12k+' },
    { id: 2, name: 'Logo Design', image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=400&fit=crop', count: '8k+' },
    { id: 3, name: 'Branding', image: 'https://images.unsplash.com/photo-1626785774625-ddc7c8241521?q=80&w=400&fit=crop', count: '15k+' },
    { id: 4, name: '3D Art', image: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=400&fit=crop', count: '5k+' },
];

export default function ExploreScreen() {
    const { colors, typography, spacing } = useTheme();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const renderCategoryCard = ({ item }: { item: typeof FEATURED_CATEGORIES[0] }) => (
        <TouchableOpacity
            style={styles.categoryCard}
            onPress={() => router.push({ pathname: '/category/[id]', params: { id: item.name } })}
        >
            <Image source={{ uri: item.image }} style={styles.categoryImage} />
            <View style={[styles.categoryOverlay, { backgroundColor: 'rgba(0,0,0,0.3)' }]}>
                <Text style={styles.categoryName}>{item.name}</Text>
                <Text style={styles.categoryCount}>{item.count} items</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>Explore</Text>
                <View style={[styles.searchContainer, { backgroundColor: colors.surfaceAlt }]}>
                    <Search size={20} color={colors.textSecondary} style={styles.searchIcon} />
                    <TextInput
                        placeholder="Search for inspiration..."
                        placeholderTextColor={colors.textSecondary}
                        style={[styles.searchInput, { color: colors.text }]}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <TouchableOpacity style={styles.filterButton}>
                        <Filter size={20} color={colors.primary} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.sectionHeader}>
                    <View style={styles.sectionTitleRow}>
                        <Sparkles size={20} color={colors.accent} />
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Featured Categories</Text>
                    </View>
                    <TouchableOpacity>
                        <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={FEATURED_CATEGORIES}
                    renderItem={renderCategoryCard}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.horizontalList}
                />

                <View style={styles.sectionHeader}>
                    <View style={styles.sectionTitleRow}>
                        <TrendingUp size={20} color={colors.primary} />
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Trending Now</Text>
                    </View>
                    <View style={styles.viewToggle}>
                        <TouchableOpacity style={[styles.toggleIcon, { backgroundColor: colors.surfaceAlt }]}>
                            <Grid size={18} color={colors.primary} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.trendingGrid}>
                    {MOCK_POSTS.slice(0, 6).map((post, index) => (
                        <TouchableOpacity
                            key={post.id}
                            style={styles.trendingItem}
                            onPress={() => router.push({ pathname: '/post/[id]', params: { id: post.id } })}
                        >
                            <Image source={{ uri: post.image_url }} style={styles.trendingImage} />
                            <View style={styles.trendingOverlay}>
                                <Text style={styles.trendingPostTitle} numberOfLines={1}>{post.title}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 24,
        paddingBottom: 12,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        marginBottom: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 54,
        borderRadius: 16,
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
    },
    filterButton: {
        padding: 8,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginTop: 24,
        marginBottom: 16,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    seeAll: {
        fontSize: 14,
        fontWeight: '600',
    },
    horizontalList: {
        paddingLeft: 24,
        paddingRight: 8,
    },
    categoryCard: {
        width: 160,
        height: 200,
        borderRadius: 24,
        marginRight: 16,
        overflow: 'hidden',
    },
    categoryImage: {
        width: '100%',
        height: '100%',
    },
    categoryOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        padding: 16,
    },
    categoryName: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
    categoryCount: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        marginTop: 4,
    },
    viewToggle: {
        flexDirection: 'row',
    },
    toggleIcon: {
        padding: 8,
        borderRadius: 8,
    },
    trendingGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
    },
    trendingItem: {
        width: (width - 48) / 2,
        height: 180,
        margin: 8,
        borderRadius: 20,
        overflow: 'hidden',
    },
    trendingImage: {
        width: '100%',
        height: '100%',
    },
    trendingOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 12,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    trendingPostTitle: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
});
