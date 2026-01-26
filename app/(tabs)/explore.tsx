import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Search, TrendingUp, Star, Award } from 'lucide-react-native';
import { MOCK_POSTS } from '../../constants/mockData';
import { TYPOGRAPHY } from '../../constants/theme';

const { width } = Dimensions.get('window');

const EXPLORE_CATEGORIES = [
    { name: 'Logo Design', icon: '🎨', count: '1.2k' },
    { name: 'UI/UX', icon: '📱', count: '3.4k' },
    { name: 'Branding', icon: '🏷️', count: '890' },
    { name: 'Illustration', icon: '✏️', count: '2.1k' },
    { name: 'Web', icon: '🌐', count: '1.5k' },
    { name: 'Mobile', icon: '🤳', count: '1.8k' },
    { name: 'Typography', icon: '🔡', count: '500' },
    { name: 'Photography', icon: '📷', count: '4k' },
    { name: '3D Art', icon: '🧊', count: '450' },
    { name: 'Animation', icon: '🎬', count: '670' },
    { name: 'Print', icon: '🖨️', count: '300' },
    { name: 'Packaging', icon: '📦', count: '200' },
];

export default function ExploreScreen() {
    const { colors } = useTheme();
    const router = useRouter();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={[TYPOGRAPHY.h1, { color: colors.text }]}>Explore</Text>
                    <TouchableOpacity
                        style={[styles.searchBar, { backgroundColor: colors.surfaceAlt }]}
                        onPress={() => router.push('/search')}
                    >
                        <Search size={20} color={colors.textSecondary} />
                        <Text style={[styles.searchText, { color: colors.textSecondary }]}>Search designs, creators...</Text>
                    </TouchableOpacity>
                </View>

                {/* Featured Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <TrendingUp size={20} color={colors.primary} />
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Trending Now</Text>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
                        {MOCK_POSTS.map((post) => (
                            <TouchableOpacity key={post.id} style={styles.featuredCard}>
                                <Image source={{ uri: post.image_url }} style={styles.featuredImage} />
                                <View style={styles.featuredOverlay}>
                                    <Text numberOfLines={1} style={[styles.featuredTitle, { color: 'white' }]}>{post.title}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Categories Grid */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Star size={20} color={colors.primary} />
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Categories</Text>
                    </View>
                    <View style={styles.categoriesGrid}>
                        {EXPLORE_CATEGORIES.map((cat) => (
                            <TouchableOpacity
                                key={cat.name}
                                style={[styles.categoryCard, { backgroundColor: colors.surfaceAlt }]}
                            >
                                <Text style={styles.categoryIcon}>{cat.icon}</Text>
                                <Text style={[styles.categoryName, { color: colors.text }]}>{cat.name}</Text>
                                <Text style={[styles.categoryCount, { color: colors.textSecondary }]}>{cat.count} items</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Featured Designers */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Award size={20} color={colors.primary} />
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Top Designers</Text>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
                        {[1, 2, 3, 4].map((i) => (
                            <TouchableOpacity key={i} style={styles.designerCard}>
                                <Image source={{ uri: `https://i.pravatar.cc/150?u=${i}` }} style={styles.designerAvatar} />
                                <Text style={[styles.designerName, { color: colors.text }]}>Designer {i}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                <View style={{ height: 40 }} />
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
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        marginTop: 20,
    },
    searchText: {
        marginLeft: 12,
        fontSize: 16,
    },
    section: {
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginBottom: 16,
        gap: 8,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    horizontalScroll: {
        paddingHorizontal: 24,
        gap: 16,
    },
    featuredCard: {
        width: 280,
        height: 180,
        borderRadius: 20,
        overflow: 'hidden',
    },
    featuredImage: {
        width: '100%',
        height: '100%',
    },
    featuredOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    featuredTitle: {
        fontWeight: '700',
        fontSize: 16,
    },
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 24,
        gap: 12,
    },
    categoryCard: {
        width: (width - 48 - 12) / 2,
        padding: 20,
        borderRadius: 20,
        alignItems: 'center',
    },
    categoryIcon: {
        fontSize: 32,
        marginBottom: 12,
    },
    categoryName: {
        fontWeight: '700',
        fontSize: 14,
        marginBottom: 4,
    },
    categoryCount: {
        fontSize: 12,
    },
    designerCard: {
        alignItems: 'center',
        width: 100,
    },
    designerAvatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 10,
    },
    designerName: {
        fontSize: 12,
        fontWeight: '600',
    },
});
