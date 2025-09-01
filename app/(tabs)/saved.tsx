import { ProjectCard } from '@/components/ProjectCard';
import { COLORS } from '@/constants/colors';
import { TYPOGRAPHY } from '@/constants/typography';
import { useAuth } from '@/contexts/AuthContext';
import { useProjects } from '@/hooks/useProjects';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    View
} from 'react-native';

export default function SavedScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  
  // In a real app, we would fetch only saved projects
  // For demo purposes, we'll just use the first 5 projects
  const { projects, isLoading, error, refreshProjects, toggleSaveProject } = useProjects();
  const savedProjects = projects.slice(0, 5);

  const handleProjectPress = (projectId: string) => {
    router.push(`/project/${projectId}`);
  };

  const handleSaveToggle = (projectId: string) => {
    if (user?.id) {
      toggleSaveProject(projectId, user.id);
    }
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
        isSaved={true}
        onPress={() => handleProjectPress(item.id)}
        onSaveToggle={() => handleSaveToggle(item.id)}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Saved Projects</Text>
      
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
          data={savedProjects}
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
              <Text style={styles.emptyText}>No saved projects yet</Text>
              <Text style={styles.emptySubtext}>
                Projects you save will appear here
              </Text>
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
  heading: {
    ...TYPOGRAPHY.heading,
    padding: 16,
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 100,
  },
  emptyText: {
    ...TYPOGRAPHY.subheading,
    marginBottom: 8,
  },
  emptySubtext: {
    ...TYPOGRAPHY.body,
    color: COLORS.darkGray,
    textAlign: 'center',
  },
});