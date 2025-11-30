import { useTheme } from '@/lib/store/theme';
import { MotiView } from 'moti';
import { Skeleton } from 'moti/skeleton';
import React from 'react';
import { Dimensions, View } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

interface SkeletonLoaderProps {
  variant?: 'project-card' | 'profile' | 'comment' | 'list-item' | 'custom';
  count?: number;
  animate?: boolean;
  children?: React.ReactNode;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'project-card',
  count = 1,
  animate = true,
  children,
}) => {
  const { isDark } = useTheme();
  
  const skeletonColorMode = isDark ? 'dark' : 'light';

  const renderProjectCardSkeleton = () => (
    <View className="mb-6 px-4">
      <View className="bg-card rounded-2xl overflow-hidden">
        {/* Image placeholder */}
        <Skeleton
          colorMode={skeletonColorMode}
          width="100%"
          height={200}
          radius={0}
        />
        
        <View className="p-4">
          {/* User info */}
          <View className="flex-row items-center mb-3">
            <Skeleton
              colorMode={skeletonColorMode}
              width={40}
              height={40}
              radius="round"
            />
            <View className="ml-3 flex-1">
              <Skeleton
                colorMode={skeletonColorMode}
                width="60%"
                height={14}
                radius={4}
              />
              <Skeleton
                colorMode={skeletonColorMode}
                width="40%"
                height={12}
                radius={4}
                style={{ marginTop: 4 }}
              />
            </View>
          </View>
          
          {/* Title */}
          <Skeleton
            colorMode={skeletonColorMode}
            width="80%"
            height={18}
            radius={4}
            style={{ marginBottom: 8 }}
          />
          
          {/* Description */}
          <Skeleton
            colorMode={skeletonColorMode}
            width="100%"
            height={12}
            radius={4}
            style={{ marginBottom: 4 }}
          />
          <Skeleton
            colorMode={skeletonColorMode}
            width="70%"
            height={12}
            radius={4}
            style={{ marginBottom: 12 }}
          />
          
          {/* Action buttons */}
          <View className="flex-row justify-between">
            <Skeleton
              colorMode={skeletonColorMode}
              width={60}
              height={24}
              radius={12}
            />
            <Skeleton
              colorMode={skeletonColorMode}
              width={60}
              height={24}
              radius={12}
            />
            <Skeleton
              colorMode={skeletonColorMode}
              width={60}
              height={24}
              radius={12}
            />
          </View>
        </View>
      </View>
    </View>
  );

  const renderProfileSkeleton = () => (
    <View className="items-center p-6">
      {/* Avatar */}
      <Skeleton
        colorMode={skeletonColorMode}
        width={100}
        height={100}
        radius="round"
        style={{ marginBottom: 16 }}
      />
      
      {/* Name */}
      <Skeleton
        colorMode={skeletonColorMode}
        width={150}
        height={20}
        radius={4}
        style={{ marginBottom: 8 }}
      />
      
      {/* Bio */}
      <Skeleton
        colorMode={skeletonColorMode}
        width={200}
        height={14}
        radius={4}
        style={{ marginBottom: 4 }}
      />
      <Skeleton
        colorMode={skeletonColorMode}
        width={180}
        height={14}
        radius={4}
        style={{ marginBottom: 16 }}
      />
      
      {/* Stats */}
      <View className="flex-row space-x-8">
        {[1, 2, 3].map((i) => (
          <View key={i} className="items-center">
            <Skeleton
              colorMode={skeletonColorMode}
              width={40}
              height={16}
              radius={4}
              style={{ marginBottom: 4 }}
            />
            <Skeleton
              colorMode={skeletonColorMode}
              width={60}
              height={12}
              radius={4}
            />
          </View>
        ))}
      </View>
    </View>
  );

  const renderCommentSkeleton = () => (
    <View className="flex-row p-4">
      <Skeleton
        colorMode={skeletonColorMode}
        width={36}
        height={36}
        radius="round"
      />
      <View className="ml-3 flex-1">
        <Skeleton
          colorMode={skeletonColorMode}
          width="30%"
          height={12}
          radius={4}
          style={{ marginBottom: 8 }}
        />
        <Skeleton
          colorMode={skeletonColorMode}
          width="100%"
          height={12}
          radius={4}
          style={{ marginBottom: 4 }}
        />
        <Skeleton
          colorMode={skeletonColorMode}
          width="80%"
          height={12}
          radius={4}
          style={{ marginBottom: 8 }}
        />
        <Skeleton
          colorMode={skeletonColorMode}
          width="20%"
          height={10}
          radius={4}
        />
      </View>
    </View>
  );

  const renderListItemSkeleton = () => (
    <View className="flex-row items-center p-4">
      <Skeleton
        colorMode={skeletonColorMode}
        width={50}
        height={50}
        radius={8}
      />
      <View className="ml-3 flex-1">
        <Skeleton
          colorMode={skeletonColorMode}
          width="70%"
          height={16}
          radius={4}
          style={{ marginBottom: 6 }}
        />
        <Skeleton
          colorMode={skeletonColorMode}
          width="90%"
          height={12}
          radius={4}
          style={{ marginBottom: 4 }}
        />
        <Skeleton
          colorMode={skeletonColorMode}
          width="40%"
          height={10}
          radius={4}
        />
      </View>
      <Skeleton
        colorMode={skeletonColorMode}
        width={24}
        height={24}
        radius={12}
      />
    </View>
  );

  const renderSkeleton = () => {
    switch (variant) {
      case 'project-card':
        return renderProjectCardSkeleton();
      case 'profile':
        return renderProfileSkeleton();
      case 'comment':
        return renderCommentSkeleton();
      case 'list-item':
        return renderListItemSkeleton();
      case 'custom':
        return children;
      default:
        return renderProjectCardSkeleton();
    }
  };

  const content = Array.from({ length: count }, (_, index) => (
    <View key={index}>
      {renderSkeleton()}
    </View>
  ));

  if (!animate) {
    return <View>{content}</View>;
  }

  return (
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: 'timing', duration: 300 }}
    >
      {content}
    </MotiView>
  );
};

// Specific skeleton components for common use cases
export const ProjectCardSkeleton: React.FC<{ count?: number }> = ({ count = 1 }) => (
  <SkeletonLoader variant="project-card" count={count} />
);

export const ProfileSkeleton: React.FC = () => (
  <SkeletonLoader variant="profile" />
);

export const CommentSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <SkeletonLoader variant="comment" count={count} />
);

export const ListItemSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => (
  <SkeletonLoader variant="list-item" count={count} />
);