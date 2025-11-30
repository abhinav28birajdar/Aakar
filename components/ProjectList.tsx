import { Card } from '@/components/ui/Card';
import Icon from '@/components/ui/Icon';
import { ProjectCardSkeleton } from '@/components/ui/SkeletonLoader';
import { useDebounce } from '@/lib/hooks/performance';
import { useProjects } from '@/lib/store/app';
import { useAuth } from '@/lib/store/auth';
import { useTheme } from '@/lib/store/theme';
import { Project } from '@/lib/types';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import React, { memo, useCallback, useMemo } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
const CARD_MARGIN = 16;
const CARD_WIDTH = screenWidth - (CARD_MARGIN * 2);

interface ProjectListProps {
  onRefresh?: () => void;
  onEndReached?: () => void;
  ListHeaderComponent?: React.ComponentType | React.ReactElement;
  numColumns?: 1 | 2;
  estimatedItemSize?: number;
}

// Memoized project card component
const ProjectCard = memo<{ item: Project; width: number }>(({ item, width }) => {
  const router = useRouter();
  const { user } = useAuth();
  const { isDark, colors } = useTheme();
  const { toggleLike, toggleSave } = useProjects();

  const handlePress = useCallback(() => {
    router.push(`/project/${item.id}`);
  }, [item.id, router]);

  const debouncedToggleLike = useDebounce(() => {
    if (!user) {
      Alert.alert('Sign In Required', 'Please sign in to like projects');
      return;
    }
    toggleLike(item.id);
  }, 300);

  const debouncedToggleSave = useDebounce(() => {
    if (!user) {
      Alert.alert('Sign In Required', 'Please sign in to save projects');
      return;
    }
    toggleSave(item.id);
  }, 300);

  const handleUserPress = useCallback(() => {
    router.push(`/designer/${item.user.id}`);
  }, [item.user.id, router]);

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: 'timing',
        duration: 300,
        delay: Math.random() * 200,
      }}
      style={{ width }}
    >
      <Card
        variant="elevated"
        animate={false}
        style={{
          margin: 8,
          overflow: 'hidden',
        }}
      >
        {/* Project Image */}
        <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
          <Image
            source={{ uri: item.imageUrl }}
            style={{
              width: '100%',
              height: 200,
              backgroundColor: colors.surface,
            }}
            resizeMode="cover"
          />
          
          {/* Overlay gradient for better text visibility */}
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 60,
              background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
            }}
          />
        </TouchableOpacity>

        <View className="p-4">
          {/* User Info */}
          <TouchableOpacity
            onPress={handleUserPress}
            className="flex-row items-center mb-3"
            activeOpacity={0.8}
          >
            <Image
              source={{ 
                uri: item.user.avatar_url || 'https://via.placeholder.com/40x40' 
              }}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: colors.surface,
              }}
            />
            <View className="ml-2 flex-1">
              <Text
                className="font-semibold text-sm"
                style={{ color: colors.text.primary }}
                numberOfLines={1}
              >
                {item.user.display_name}
              </Text>
              <Text
                className="text-xs"
                style={{ color: colors.text.secondary }}
              >
                {item.category}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Project Title */}
          <TouchableOpacity onPress={handlePress}>
            <Text
              className="font-bold text-lg mb-2"
              style={{ color: colors.text.primary }}
              numberOfLines={2}
            >
              {item.title}
            </Text>
          </TouchableOpacity>

          {/* Description */}
          {item.description && (
            <Text
              className="text-sm mb-4"
              style={{ color: colors.text.secondary }}
              numberOfLines={2}
            >
              {item.description}
            </Text>
          )}

          {/* Action Buttons */}
          <View className="flex-row justify-between items-center">
            <TouchableOpacity
              onPress={debouncedToggleLike}
              className="flex-row items-center"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon
                name={item.isLiked ? 'heart' : 'heart'}
                size={18}
                color={item.isLiked ? '#ef4444' : colors.text.tertiary}
                fill={item.isLiked}
              />
              <Text
                className="ml-1 text-sm font-medium"
                style={{ color: colors.text.secondary }}
              >
                {item.likes}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon
                name="message-circle"
                size={18}
                color={colors.text.tertiary}
              />
              <Text
                className="ml-1 text-sm font-medium"
                style={{ color: colors.text.secondary }}
              >
                0
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={debouncedToggleSave}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon
                name={item.isSaved ? 'bookmark' : 'bookmark'}
                size={18}
                color={item.isSaved ? colors.primary : colors.text.tertiary}
                fill={item.isSaved}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    </MotiView>
  );
});

ProjectCard.displayName = 'ProjectCard';

export const ProjectList: React.FC<ProjectListProps> = ({
  onRefresh,
  onEndReached,
  ListHeaderComponent,
  numColumns = 1,
  estimatedItemSize = 320,
}) => {
  const {
    projects,
    loading,
    refreshing,
    hasMoreData,
    fetchProjects,
    setRefreshing,
    clearError,
  } = useProjects();

  const { isDark } = useTheme();

  // Calculate card width based on number of columns
  const cardWidth = useMemo(() => {
    if (numColumns === 1) {
      return CARD_WIDTH;
    }
    return (CARD_WIDTH - 16) / 2; // Account for spacing between cards
  }, [numColumns]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    clearError();
    try {
      await fetchProjects(1);
      onRefresh?.();
    } catch (error) {
      console.error('Failed to refresh projects:', error);
    } finally {
      setRefreshing(false);
    }
  }, [fetchProjects, setRefreshing, clearError, onRefresh]);

  const handleEndReached = useCallback(() => {
    if (!loading && hasMoreData) {
      onEndReached?.();
    }
  }, [loading, hasMoreData, onEndReached]);

  const renderItem: ListRenderItem<Project> = useCallback(({ item }) => (
    <ProjectCard item={item} width={cardWidth} />
  ), [cardWidth]);

  const renderEmpty = useCallback(() => (
    <View className="flex-1 justify-center items-center py-12">
      <Icon name="image" size={48} color="#9CA3AF" />
      <Text className="text-gray-500 text-lg font-medium mt-4">
        No projects found
      </Text>
      <Text className="text-gray-400 text-center mt-2 px-8">
        Be the first to share your amazing design work!
      </Text>
    </View>
  ), []);

  const renderFooter = useCallback(() => {
    if (!loading || projects.length === 0) return null;
    
    return (
      <View className="py-4">
        <ProjectCardSkeleton count={2} />
      </View>
    );
  }, [loading, projects.length]);

  const keyExtractor = useCallback((item: Project) => item.id, []);

  const getItemType = useCallback((item: Project, index: number) => {
    // Different item types for better performance
    return item.is_featured ? 'featured' : 'regular';
  }, []);

  if (loading && projects.length === 0) {
    return (
      <View className="flex-1">
        {ListHeaderComponent}
        <ProjectCardSkeleton count={5} />
      </View>
    );
  }

  return (
    <FlashList
      data={projects}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      numColumns={numColumns}
      estimatedItemSize={estimatedItemSize}
      onRefresh={handleRefresh}
      refreshing={refreshing}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.8}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={renderEmpty}
      ListFooterComponent={renderFooter}
      getItemType={getItemType}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        padding: numColumns === 1 ? 0 : 8,
      }}
      // Performance optimizations
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
      initialNumToRender={6}
      updateCellsBatchingPeriod={50}
      // FlashList specific optimizations
      drawDistance={200}
      optimizeItemArrangement={true}
    />
  );
};