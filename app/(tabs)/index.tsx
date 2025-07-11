import React, { useState, useCallback } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  ScrollView,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { SearchBar } from '@/components/SearchBar';
import { CategoryPill } from '@/components/CategoryPill';
import { ProjectCard } from '@/components/ProjectCard';
import { categories } from '@/mocks/categories';
import { useProjects } from '@/hooks/useProjects';

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const { projects, isLoading, error, refreshProjects } = useProjects(selectedCategory || undefined);

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(prevCategory => 
      prevCategory === categoryId ? null : categoryId
    );
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

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onClear={() => setSearchQuery('')}
      />
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map(category => (
          <CategoryPill
            key={category.id}
            title={category.name}
            isSelected={selectedCategory === category.id}
            onPress={() => handleCategoryPress(category.id)}
          />
        ))}
      </ScrollView>

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
          data={projects}
          renderItem={renderProjectItem}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.projectsContainer}
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
              <Text style={styles.emptyText}>No projects found</Text>
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
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  projectsContainer: {
    paddingHorizontal: 8,
    paddingBottom: 20,
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