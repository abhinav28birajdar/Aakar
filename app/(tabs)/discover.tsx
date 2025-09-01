import { ProjectCard } from '@/components/ProjectCard';
import { SearchBar } from '@/components/SearchBar';
import { COLORS } from '@/constants/colors';
import { TYPOGRAPHY } from '@/constants/typography';
import { useCategories } from '@/hooks/useCategories';
import { useProjects } from '@/hooks/useProjects';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function DiscoverScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  
  const { projects, isLoading, error, refreshProjects } = useProjects();
  const { categories } = useCategories();

  const handleCategoryPress = (categoryId: string) => {
    router.push(`/category/${categoryId}` as any);
  };

  const handleProjectPress = (projectId: string) => {
    router.push(`/project/${projectId}`);
  };

  const handleSaveToggle = (projectId: string) => {
    console.log(`Toggle save for project ${projectId}`);
    // In a real app, this would update Firestore
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshProjects();
    setRefreshing(false);
  }, [refreshProjects]);

  const renderProjectItem = ({ item, index }: { item: any, index: number }) => {
    // Alternate aspect ratios for visual interest
    const aspectRatio = index % 3 === 0 ? 1.2 : index % 3 === 1 ? 0.8 : 1.5;
    
    return (
      <ProjectCard
        id={item.id}
        title={item.title}
        designer={item.designer}
        imageUrl={item.imageUrl}
        backgroundColor={item.backgroundColor}
        aspectRatio={aspectRatio}
        onPress={() => handleProjectPress(item.id)}
        onSaveToggle={() => handleSaveToggle(item.id)}
      />
    );
  };

  const renderCategorySection = (category: any) => {
    const categoryProjects = projects.filter(p => p.category === category.id).slice(0, 4);
    
    if (categoryProjects.length === 0) return null;
    
    return (
      <View style={styles.categorySection} key={category.id}>
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryTitle}>{category.name.toUpperCase()}</Text>
          <TouchableOpacity onPress={() => handleCategoryPress(category.id)}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={categoryProjects}
          renderItem={renderProjectItem}
          keyExtractor={item => `${category.id}-${item.id}`}
          numColumns={2}
          scrollEnabled={false}
          contentContainerStyle={styles.projectsContainer}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onClear={() => setSearchQuery('')}
        placeholder="Discover designers and projects..."
      />
      
      {isLoading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={categories}
          renderItem={({ item }) => renderCategorySection(item)}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.categoriesListContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No categories found</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  categoriesListContainer: {
    paddingBottom: 20,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  categoryTitle: {
    ...TYPOGRAPHY.heading,
    fontSize: 20,
  },
  seeAllText: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
    fontWeight: '600',
  },
  projectsContainer: {
    paddingHorizontal: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: COLORS.error,
    textAlign: 'center',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.darkGray,
  },
});