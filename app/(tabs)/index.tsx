import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/hooks/useTheme';
import { MOCK_POSTS, CATEGORIES } from '../../src/constants/mockData';
import { DesignCard } from '../../src/components/molecules/DesignCard';
import { Search, Bell, Sun, Moon } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
    const { colors, typography, spacing, isDark } = useTheme();
    const router = useRouter();
    const [activeCategory, setActiveCategory] = useState('All');
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 2000);
    }, []);

    const renderHeader = () => (
        <View style={styles.header}>
            <View>
                <Text style={[styles.greeting, { color: colors.textSecondary }]}>Good Morning,</Text>
                <Text style={[styles.brand, { color: colors.text }]}>Aakar Feed</Text>
            </View>
            <View style={styles.headerIcons}>
                <TouchableOpacity
                    style={[styles.iconButton, { backgroundColor: colors.surfaceAlt }]}
                    onPress={() => router.push('/search')}
                >
                    <Search size={22} color={colors.text} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.iconButton, { backgroundColor: colors.surfaceAlt }]}
                    onPress={() => router.push('/notifications')}
                >
                    <Bell size={22} color={colors.text} />
                    <View style={[styles.badge, { backgroundColor: colors.primary }]} />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderCategories = () => (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryContainer}
        >
            {CATEGORIES.map((cat) => (
                <TouchableOpacity
                    key={cat}
                    onPress={() => setActiveCategory(cat)}
                    style={[
                        styles.categoryChip,
                        {
                            backgroundColor: activeCategory === cat ? colors.primary : colors.surfaceAlt,
                            borderColor: activeCategory === cat ? colors.primary : colors.border,
                        }
                    ]}
                >
                    <Text
                        style={[
                            styles.categoryText,
                            { color: activeCategory === cat ? colors.white : colors.textSecondary }
                        ]}
                    >
                        {cat}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
            <FlatList
                data={activeCategory === 'All' ? MOCK_POSTS : MOCK_POSTS.filter(p => p.category === activeCategory)}
                renderItem={({ item }) => (
                    <DesignCard
                        post={item}
                        onPress={() => router.push({ pathname: '/post/[id]', params: { id: item.id } })}
                    />
                )}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={
                    <>
                        {renderHeader()}
                        {renderCategories()}
                    </>
                }
                contentContainerStyle={styles.feedContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    greeting: {
        fontSize: 14,
        fontWeight: '500',
    },
    brand: {
        fontSize: 24,
        fontWeight: '800',
    },
    headerIcons: {
        flexDirection: 'row',
        gap: 12,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badge: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 10,
        height: 10,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: 'white',
    },
    categoryContainer: {
        paddingHorizontal: 24,
        paddingVertical: 16,
        gap: 12,
    },
    categoryChip: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '600',
    },
    feedContent: {
        paddingBottom: 24,
        paddingHorizontal: 24,
    },
});
