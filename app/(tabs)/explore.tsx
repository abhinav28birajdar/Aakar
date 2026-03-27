<<<<<<< HEAD
import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}>
          Explore
        </ThemedText>
      </ThemedView>
      <ThemedText>This app includes example code to help you get started.</ThemedText>
      <Collapsible title="File-based routing">
        <ThemedText>
          This app has two screens:{' '}
          <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> and{' '}
          <ThemedText type="defaultSemiBold">app/(tabs)/explore.tsx</ThemedText>
        </ThemedText>
        <ThemedText>
          The layout file in <ThemedText type="defaultSemiBold">app/(tabs)/_layout.tsx</ThemedText>{' '}
          sets up the tab navigator.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Android, iOS, and web support">
        <ThemedText>
          You can open this project on Android, iOS, and the web. To open the web version, press{' '}
          <ThemedText type="defaultSemiBold">w</ThemedText> in the terminal running this project.
        </ThemedText>
      </Collapsible>
      <Collapsible title="Images">
        <ThemedText>
          For static images, you can use the <ThemedText type="defaultSemiBold">@2x</ThemedText> and{' '}
          <ThemedText type="defaultSemiBold">@3x</ThemedText> suffixes to provide files for
          different screen densities
        </ThemedText>
        <Image
          source={require('@/assets/images/react-logo.png')}
          style={{ width: 100, height: 100, alignSelf: 'center' }}
        />
        <ExternalLink href="https://reactnative.dev/docs/images">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Light and dark mode components">
        <ThemedText>
          This template has light and dark mode support. The{' '}
          <ThemedText type="defaultSemiBold">useColorScheme()</ThemedText> hook lets you inspect
          what the user&apos;s current color scheme is, and so you can adjust UI colors accordingly.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Animations">
        <ThemedText>
          This template includes an example of an animated component. The{' '}
          <ThemedText type="defaultSemiBold">components/HelloWave.tsx</ThemedText> component uses
          the powerful{' '}
          <ThemedText type="defaultSemiBold" style={{ fontFamily: Fonts.mono }}>
            react-native-reanimated
          </ThemedText>{' '}
          library to create a waving hand animation.
        </ThemedText>
        {Platform.select({
          ios: (
            <ThemedText>
              The <ThemedText type="defaultSemiBold">components/ParallaxScrollView.tsx</ThemedText>{' '}
              component provides a parallax effect for the header image.
            </ThemedText>
          ),
        })}
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
=======
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
>>>>>>> 9657734ae222ffc780f8eb91e036f49be6974fbd
});
