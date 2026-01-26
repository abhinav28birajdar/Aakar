import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import { ArrowLeft, Search as SearchIcon, X, Clock, TrendingUp } from 'lucide-react-native';
import { MOCK_POSTS } from '../constants/mockData';
import { DesignCard } from '../components/DesignCard';
import { TYPOGRAPHY, SIZES } from '../constants/theme';

export default function SearchScreen() {
    const { colors } = useTheme();
    const router = useRouter();
    const [query, setQuery] = useState('');
    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
        // Auto-focus after mounting
        setTimeout(() => inputRef.current?.focus(), 100);
    }, []);

    const recentSearches = ['Minimalist UI', 'Dashboard', 'Logo Design', 'Dark Mode'];
    const trendingTags = ['#ui', '#ux', '#webdesign', '#app', '#branding', '#typography'];

    const filteredPosts = query
        ? MOCK_POSTS.filter(p => p.title.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase()))
        : [];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <View style={[styles.searchContainer, { backgroundColor: colors.surfaceAlt }]}>
                    <SearchIcon size={20} color={colors.textSecondary} />
                    <TextInput
                        ref={inputRef}
                        style={[styles.input, { color: colors.text }]}
                        placeholder="Search designs, creators..."
                        placeholderTextColor={colors.textMuted}
                        value={query}
                        onChangeText={setQuery}
                        returnKeyType="search"
                    />
                    {query.length > 0 && (
                        <TouchableOpacity onPress={() => setQuery('')}>
                            <X size={18} color={colors.textSecondary} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Content */}
            {query.length > 0 ? (
                <FlatList
                    data={filteredPosts}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={{ flex: 1, padding: 6 }}>
                            <DesignCard post={item} onPress={() => router.push(`/post/${item.id}`)} />
                        </View>
                    )}
                    numColumns={2}
                    contentContainerStyle={styles.results}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Text style={{ color: colors.textSecondary }}>No results found for "{query}"</Text>
                        </View>
                    }
                />
            ) : (
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                    {/* Recent Searches */}
                    <View style={styles.section}>
                        <Text style={[TYPOGRAPHY.h3, { color: colors.text, marginBottom: SIZES.md }]}>Recent Searches</Text>
                        {recentSearches.map((term, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[styles.recentItem, { borderBottomColor: colors.border }]}
                                onPress={() => setQuery(term)}
                            >
                                <Clock size={18} color={colors.textSecondary} />
                                <Text style={[styles.recentText, { color: colors.text }]}>{term}</Text>
                                <X size={16} color={colors.textSecondary} />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Trending */}
                    <View style={styles.section}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SIZES.md, gap: 8 }}>
                            <TrendingUp size={20} color={colors.primary} />
                            <Text style={[TYPOGRAPHY.h3, { color: colors.text }]}>Trending</Text>
                        </View>
                        <View style={styles.tagContainer}>
                            {trendingTags.map((tag) => (
                                <TouchableOpacity
                                    key={tag}
                                    style={[styles.tag, { backgroundColor: colors.surfaceAlt }]}
                                    onPress={() => setQuery(tag.replace('#', ''))}
                                >
                                    <Text style={{ color: colors.text }}>{tag}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </ScrollView>
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
        borderBottomWidth: 1,
    },
    backButton: {
        padding: 4,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 44,
        borderRadius: 22,
        gap: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        height: '100%',
    },
    content: {
        padding: 24,
    },
    section: {
        marginBottom: 32,
    },
    recentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        gap: 12,
    },
    recentText: {
        flex: 1,
        fontSize: 16,
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    tag: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    results: {
        padding: 18,
    },
    emptyState: {
        padding: 40,
        alignItems: 'center',
    },
});
