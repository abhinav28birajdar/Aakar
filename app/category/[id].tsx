import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { ArrowLeft, Filter, Search } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { MOCK_POSTS } from '../../src/constants/mockData';
import { DesignCard } from '../../src/components/molecules/DesignCard';

const { width } = Dimensions.get('window');

export default function CategoryDetailScreen() {
    const { colors, typography, spacing } = useTheme();
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [activeSort, setActiveSort] = useState('Popular');

    const filteredPosts = MOCK_POSTS.filter(p => p.category.includes(id as string) || id === 'All');

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                    <ArrowLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <View style={styles.headerTitle}>
                    <Text style={[styles.title, { color: colors.text }]}>{id}</Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{filteredPosts.length} designs</Text>
                </View>
                <TouchableOpacity style={styles.iconButton}>
                    <Search size={24} color={colors.text} />
                </TouchableOpacity>
            </View>

            <View style={styles.filterSection}>
                <View style={styles.sortContainer}>
                    {['Popular', 'Latest', 'Following'].map((sort) => (
                        <TouchableOpacity
                            key={sort}
                            onPress={() => setActiveSort(sort)}
                            style={[
                                styles.sortChip,
                                { backgroundColor: activeSort === sort ? colors.primary : 'transparent' }
                            ]}
                        >
                            <Text style={[
                                styles.sortText,
                                { color: activeSort === sort ? 'white' : colors.textSecondary }
                            ]}>
                                {sort}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <TouchableOpacity style={[styles.filterBtn, { backgroundColor: colors.surfaceAlt }]}>
                    <Filter size={18} color={colors.text} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={filteredPosts}
                renderItem={({ item }) => (
                    <DesignCard
                        post={item}
                        onPress={() => router.push({ pathname: '/post/[id]', params: { id: item.id } })}
                    />
                )}
                keyExtractor={(item) => item.id}
                numColumns={1}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No designs found in this category.</Text>
                    </View>
                }
            />
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
        paddingHorizontal: 8,
    },
    iconButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        flex: 1,
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '800',
    },
    subtitle: {
        fontSize: 12,
        fontWeight: '600',
    },
    filterSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        marginBottom: 16,
    },
    sortContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    sortChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 10,
    },
    sortText: {
        fontSize: 13,
        fontWeight: '700',
    },
    filterBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    list: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    emptyState: {
        marginTop: 100,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '500',
    },
});
