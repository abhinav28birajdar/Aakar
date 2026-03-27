<<<<<<< HEAD
import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12',
            })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <Link href="/modal">
          <Link.Trigger>
            <ThemedText type="subtitle">Step 2: Explore</ThemedText>
          </Link.Trigger>
          <Link.Preview />
          <Link.Menu>
            <Link.MenuAction title="Action" icon="cube" onPress={() => alert('Action pressed')} />
            <Link.MenuAction
              title="Share"
              icon="square.and.arrow.up"
              onPress={() => alert('Share pressed')}
            />
            <Link.Menu title="More" icon="ellipsis">
              <Link.MenuAction
                title="Delete"
                icon="trash"
                destructive
                onPress={() => alert('Delete pressed')}
              />
            </Link.Menu>
          </Link.Menu>
        </Link>

        <ThemedText>
          {`Tap the Explore tab to learn more about what's included in this starter app.`}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          {`When you're ready, run `}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
=======
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
>>>>>>> 9657734ae222ffc780f8eb91e036f49be6974fbd
});
