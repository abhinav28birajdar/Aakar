import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, RefreshControl, StatusBar } from 'react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { MOCK_POSTS, CATEGORIES } from '../../src/constants/mockData';
import { DesignCard } from '../../src/components/molecules/DesignCard';
import { Search, Bell, Menu } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
    const { colors } = useTheme();
    const router = useRouter();
    const [refreshing, setRefreshing] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 2000);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={colors.text === '#FFFFFF' ? 'light-content' : 'dark-content'} />

            <View style={styles.header}>
                <TouchableOpacity style={[styles.iconBtn, { backgroundColor: colors.surfaceAlt }]}>
                    <Menu size={22} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.logo, { color: colors.text }]}>Aakar</Text>
                <View style={styles.headerRight}>
                    <TouchableOpacity
                        onPress={() => router.push('/search')}
                        style={[styles.iconBtn, { backgroundColor: colors.surfaceAlt }]}
                    >
                        <Search size={22} color={colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => router.push('/(tabs)/notifications')}
                        style={[styles.iconBtn, { backgroundColor: colors.surfaceAlt }]}
                    >
                        <Bell size={22} color={colors.text} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.categoryContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
                        {['All', ...CATEGORIES.map(c => c.name)].map((cat) => (
                            <TouchableOpacity
                                key={cat}
                                onPress={() => setSelectedCategory(cat)}
                                style={[
                                    styles.categoryChip,
                                    { backgroundColor: selectedCategory === cat ? colors.primary : colors.surfaceAlt }
                                ]}
                            >
                                <Text style={[
                                    styles.categoryText,
                                    { color: selectedCategory === cat ? 'white' : colors.textSecondary }
                                ]}>
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.feed}>
                    {MOCK_POSTS.map((post) => (
                        <DesignCard
                            key={post.id}
                            post={post}
                            onPress={() => router.push(`/post/${post.id}`)}
                        />
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
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    logo: {
        fontSize: 24,
        fontWeight: '900',
        letterSpacing: -1,
    },
    headerRight: {
        flexDirection: 'row',
        gap: 12,
    },
    iconBtn: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingBottom: 20,
    },
    categoryContainer: {
        paddingVertical: 20,
    },
    categoryScroll: {
        paddingHorizontal: 20,
        gap: 10,
    },
    categoryChip: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '700',
    },
    feed: {
        paddingHorizontal: 20,
        gap: 24,
    },
});
