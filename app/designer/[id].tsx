import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
  FlatList
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { MapPin, MessageCircle } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';
import { TYPOGRAPHY } from '@/constants/typography';
import { Button } from '@/components/Button';
import { ProjectCard } from '@/components/ProjectCard';
import { useUser } from '@/hooks/useUser';
import { useProjects } from '@/hooks/useProjects';

export default function DesignerProfileScreen() {
  const { id } = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const { getUserById } = useUser();
  const { projects } = useProjects();
  
  const [designer, setDesigner] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('projects');
  const [isFollowing, setIsFollowing] = useState(false);
  
  // Filter projects to only show those by this designer
  const designerProjects = projects.filter(p => p.designerId === id);

  useEffect(() => {
    const fetchDesigner = async () => {
      setIsLoading(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const designerData = getUserById(id as string);
        setDesigner(designerData);
      } catch (error) {
        console.error('Error fetching designer:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchDesigner();
    }
  }, [id, getUserById]);

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
    // In a real app, this would update Firestore
  };

  const handleMessage = () => {
    // In a real app, this would navigate to the chat screen
    console.log('Message designer:', designer?.fullName);
  };

  const handleHire = () => {
    // In a real app, this would navigate to a project proposal form
    console.log('Hire designer:', designer?.fullName);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!designer) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Designer not found</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{
          title: designer.fullName,
          headerBackTitle: 'Back',
        }}
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={[styles.bannerContainer, { width }]}>
          <View style={styles.overlay} />
        </View>

        <View style={styles.profileContainer}>
          <Image 
            source={{ uri: designer.avatarUrl }} 
            style={styles.avatar} 
          />

          <Text style={styles.name}>{designer.fullName}</Text>
          <Text style={styles.designation}>{designer.designation}</Text>
          
          {designer.location && (
            <View style={styles.locationContainer}>
              <MapPin size={14} color={COLORS.darkGray} />
              <Text style={styles.location}>{designer.location}</Text>
            </View>
          )}

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{designer.followers}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{designer.following}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{designerProjects.length}</Text>
              <Text style={styles.statLabel}>Projects</Text>
            </View>
          </View>

          <View style={styles.actionsContainer}>
            <Button
              title={isFollowing ? "Following" : "Follow"}
              onPress={toggleFollow}
              variant={isFollowing ? "secondary" : "primary"}
              style={styles.actionButton}
            />
            <Button
              title="Message"
              onPress={handleMessage}
              variant="outline"
              style={styles.actionButton}
            />
            <Button
              title="Hire Me"
              onPress={handleHire}
              variant="secondary"
              style={{...styles.actionButton, ...styles.hireButton}}
            />
          </View>

          {designer.bio && (
            <View style={styles.bioContainer}>
              <Text style={styles.bioText}>{designer.bio}</Text>
            </View>
          )}

          {designer.skills && designer.skills.length > 0 && (
            <View style={styles.skillsContainer}>
              <Text style={styles.sectionTitle}>Skills</Text>
              <View style={styles.skillsList}>
                {designer.skills.map((skill: string, index: number) => (
                  <View key={index} style={styles.skillPill}>
                    <Text style={styles.skillText}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'projects' && styles.activeTab,
            ]}
            onPress={() => setActiveTab('projects')}
          >
            <Text 
              style={[
                styles.tabText,
                activeTab === 'projects' && styles.activeTabText,
              ]}
            >
              Projects
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'collections' && styles.activeTab,
            ]}
            onPress={() => setActiveTab('collections')}
          >
            <Text 
              style={[
                styles.tabText,
                activeTab === 'collections' && styles.activeTabText,
              ]}
            >
              Collections
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.projectsContainer}>
          {activeTab === 'projects' ? (
            designerProjects.length > 0 ? (
              <View style={styles.projectsGrid}>
                {designerProjects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    id={project.id}
                    title={project.title}
                    designer={designer.fullName}
                    imageUrl={project.imageUrl}
                    backgroundColor={project.backgroundColor}
                    aspectRatio={index % 2 === 0 ? 1.2 : 0.8}
                    onPress={() => console.log('Navigate to project', project.id)}
                  />
                ))}
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No projects yet</Text>
              </View>
            )
          ) : (
            // Collections tab
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No collections yet</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
  bannerContainer: {
    height: 150,
    backgroundColor: COLORS.primary,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  profileContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: -50,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  name: {
    ...TYPOGRAPHY.heading,
    marginTop: 12,
  },
  designation: {
    ...TYPOGRAPHY.body,
    color: COLORS.darkGray,
    marginTop: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  location: {
    ...TYPOGRAPHY.caption,
    color: COLORS.darkGray,
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 24,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...TYPOGRAPHY.heading,
    fontSize: 20,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.darkGray,
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: COLORS.lightGray,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  hireButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  bioContainer: {
    width: '100%',
    marginTop: 24,
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  bioText: {
    ...TYPOGRAPHY.body,
    lineHeight: 22,
  },
  skillsContainer: {
    width: '100%',
    marginTop: 16,
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  sectionTitle: {
    ...TYPOGRAPHY.subheading,
    marginBottom: 12,
  },
  skillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillPill: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    margin: 4,
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  skillText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '500',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginTop: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    ...TYPOGRAPHY.body,
    fontWeight: '500',
  },
  activeTabText: {
    color: COLORS.primary,
  },
  projectsContainer: {
    padding: 16,
  },
  projectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.darkGray,
  },
});