import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, FlatList, ScrollView, Dimensions } from 'react-native';
import { useTheme } from '../src/hooks/useTheme';
import { Search as SearchIcon, X, ArrowLeft, Filter, TrendingUp, Clock, Grid, List } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { MOCK_POSTS } from '../src/constants/mockData';
import { MotiView } from 'moti';

const { width } = Dimensions.get('window');

const RECENT_SEARCHES = ['Dashboard UI', 'Mobile App Design', 'Logo Branding', '3D Icons'];
const TRENDING_TOPICS = ['Framer Motion', 'Glassmorphism', 'Bento Grid', 'Cyberpunk', 'Minimalist', 'Landing Page'];

export default function SearchScreen() {
    const { colors, typography, spacing } = useTheme();
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const renderRecentSearch = (item: string) => (
        <TouchableOpacity key={item} style={[styles.recentItem, { borderBottomColor: colors.border }]}>
            <View style={styles.recentItemLeft}>
                <Clock size={18} color={colors.textSecondary} />
                <Text style={[styles.recentLabel, { color: colors.text }]}>{item}</Text>
            </View>
            <TouchableOpacity onPress={() => { }}>
                <X size={18} color={colors.textSecondary} />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    const renderTopic = (topic: string) => (
        <TouchableOpacity key={topic} style={[styles.topicChip, { backgroundColor: colors.surfaceAlt }]}>
            <Text style={[styles.topicText, { color: colors.textSecondary }]}>{topic}</Text>
        </TouchableOpacity>
    );

    const renderResultItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.gridItem}
            onPress={() => router.push({ pathname: '/post/[id]', params: { id: item.id } })}
        >
            <Image source={{ uri: item.image_url }} style={styles.resultImage} />
            <View style={styles.resultOverlay}>
                <Text numberOfLines={1} style={styles.resultTitle}>{item.title}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                    <ArrowLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <View style={[styles.searchBar, { backgroundColor: colors.surfaceAlt }]}>
                    <SearchIcon size={20} color={colors.textSecondary} />
                    <TextInput
                        placeholder="Search Aakar"
                        placeholderTextColor={colors.textSecondary}
                        style={[styles.input, { color: colors.text }]}
                        value={query}
                        onChangeText={(text) => {
                            setQuery(text);
                            setIsSearching(text.length > 0);
                        }}
                        autoFocus
                    />
                    {query.length > 0 && (
                        <TouchableOpacity onPress={() => setQuery('')}>
                            <X size={18} color={colors.textSecondary} />
                        </TouchableOpacity>
                    )}
                </View>
                <TouchableOpacity style={styles.iconButton}>
                    <Filter size={24} color={colors.text} />
                </TouchableOpacity>
            </View>

            {!isSearching ? (
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Searches</Text>
                            <TouchableOpacity>
                                <Text style={[styles.clearAll, { color: colors.primary }]}>Clear All</Text>
                            </TouchableOpacity>
                        </View>
                        {RECENT_SEARCHES.map(renderRecentSearch)}
                    </View>

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <TrendingUp size={20} color={colors.accent} />
                            <Text style={[styles.sectionTitle, { color: colors.text, marginLeft: 8 }]}>Trending Topics</Text>
                        </View>
                        <View style={styles.topicContainer}>
                            {TRENDING_TOPICS.map(renderTopic)}
                        </View>
                    </View>
                </ScrollView>
            ) : (
                <View style={styles.resultsContainer}>
                    <View style={styles.resultsHeader}>
                        <Text style={[styles.resultsCount, { color: colors.textSecondary }]}>Found 128 results</Text>
                        <View style={styles.viewToggle}>
                            <TouchableOpacity style={styles.viewIcon}>
                                <Grid size={18} color={colors.primary} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <FlatList
                        data={MOCK_POSTS}
                        renderItem={renderResultItem}
                        keyExtractor={(item) => item.id}
                        numColumns={2}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.gridList}
                    />
                </View>
            )}
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
    iconButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchBar: {
        flex: 1,
        height: 48,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        gap: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
    },
    scrollContent: {
        paddingHorizontal: 24,
    },
    section: {
        marginTop: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    clearAll: {
        fontSize: 14,
        fontWeight: '600',
    },
    recentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    recentItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    recentLabel: {
        fontSize: 15,
        fontWeight: '500',
    },
    topicContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    topicChip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
    },
    topicText: {
        fontSize: 14,
        fontWeight: '600',
    },
    resultsContainer: {
        flex: 1,
    },
    resultsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginBottom: 16,
    },
    resultsCount: {
        fontSize: 14,
        fontWeight: '500',
    },
    viewToggle: {
        flexDirection: 'row',
    },
    viewIcon: {
        padding: 4,
    },
    gridList: {
        paddingHorizontal: 16,
        paddingBottom: 24,
    },
    gridItem: {
        width: (width - 48) / 2,
        height: 180,
        margin: 8,
        borderRadius: 20,
        overflow: 'hidden',
    },
    resultImage: {
        width: '100%',
        height: '100%',
    },
    resultOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 12,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    resultTitle: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
});
