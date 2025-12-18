import { ProjectCard } from '@/components/ProjectCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/Button';
import { projects } from '@/mocks/projects';
import { router, useLocalSearchParams } from 'expo-router';
import { FlatList, StyleSheet } from 'react-native';

export default function CategoryScreen() {
  const { id: categoryId } = useLocalSearchParams<{ id: string }>();
  
  // Filter projects by category
  const categoryProjects = projects.filter(
    (project: any) => project.category.toLowerCase() === categoryId?.toLowerCase()
  );

  const categoryName = categoryId?.charAt(0).toUpperCase() + categoryId?.slice(1) || 'Category';

  const renderProject = ({ item }: { item: any }) => (
    <ProjectCard
      id={item.id}
      title={item.title}
      designer={item.designer}
      imageUrl={item.imageUrl}
      backgroundColor={item.backgroundColor}
      aspectRatio={item.aspectRatio}
      onPress={() => router.push(`/project/${item.id}`)}
    />
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.header}>{categoryName} Designs</ThemedText>
      
      {categoryProjects.length > 0 ? (
        <FlatList
          data={categoryProjects}
          renderItem={renderProject}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          style={styles.list}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <ThemedView style={styles.emptyState}>
          <ThemedText style={styles.emptyText}>
            No designs found in {categoryName.toLowerCase()} category
          </ThemedText>
        </ThemedView>
      )}
      
      <Button
        title="Back"
        onPress={() => router.back()}
        style={styles.backButton}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 40,
  },
  list: {
    flex: 1,
  },
  row: {
    justifyContent: 'space-between',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.6,
  },
  backButton: {
    marginTop: 20,
  },
});
