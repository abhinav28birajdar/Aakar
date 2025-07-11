import React, { useState, useCallback } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  RefreshControl,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Camera, MapPin, Edit2, LogOut } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';
import { TYPOGRAPHY } from '@/constants/typography';
import { Button } from '@/components/Button';
import { ProjectCard } from '@/components/ProjectCard';
import { useUser } from '@/hooks/useUser';
import { useProjects } from '@/hooks/useProjects';
import { useAuth } from '@/hooks/useAuth';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isLoading: isUserLoading, error: userError, refreshUser } = useUser();
  const { projects, isLoading: isProjectsLoading, error: projectsError, refreshProjects } = useProjects();
  const { signOut } = useAuth();
  
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('projects');

  // Filter projects to only show those by the current user
  const userProjects = projects.filter(p => p.designerId === user?.id);

  const handleEditProfile = () => {
    // In a real app, this would navigate to an edit profile screen
    Alert.alert('Edit Profile', 'This feature is not implemented in the demo.');
  };

  const handlePickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      // In a real app, this would upload the image to Firebase Storage
      // and update the user's profile in Firestore
      Alert.alert('Avatar Updated', 'This feature is not fully implemented in the demo.');
    }
  };

  const handleProjectPress = (projectId: string) => {
    router.push(`/project/${projectId}`);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace('/login');
    } catch (error: any) {
      Alert.alert('Logout Failed', error.message);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refreshUser(), refreshProjects()]);
    setRefreshing(false);
  }, [refreshUser, refreshProjects]);

  if (isUserLoading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (userError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{userError}</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[COLORS.primary]}
          tintColor={COLORS.primary}
        />
      }
    >
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image 
            source={{ 
              uri: user?.avatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
            }} 
            style={styles.avatar} 
          />
          <TouchableOpacity 
            style={styles.editAvatarButton}
            onPress={handlePickAvatar}
          >
            <Camera size={16} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.name}>{user?.fullName}</Text>
          <Text style={styles.designation}>{user?.designation}</Text>
          
          {user?.location && (
            <View style={styles.locationContainer}>
              <MapPin size={14} color={COLORS.darkGray} />
              <Text style={styles.location}>{user.location}</Text>
            </View>
          )}
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user?.followers || 0}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user?.following || 0}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userProjects.length}</Text>
            <Text style={styles.statLabel}>Projects</Text>
          </View>
        </View>

        {user?.bio && (
          <Text style={styles.bio}>{user.bio}</Text>
        )}

        {user?.skills && user.skills.length > 0 && (
          <View style={styles.skillsContainer}>
            {user.skills.map((skill, index) => (
              <View key={index} style={styles.skillPill}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.actionsContainer}>
          <Button
            title="Edit Profile"
            onPress={handleEditProfile}
            variant="outline"
            style={styles.editButton}
            textStyle={styles.editButtonText}
            size="small"
          />
          <Button
            title="Log Out"
            onPress={handleLogout}
            variant="secondary"
            style={styles.logoutButton}
            textStyle={styles.logoutButtonText}
            size="small"
          />
        </View>
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
            activeTab === 'saved' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('saved')}
        >
          <Text 
            style={[
              styles.tabText,
              activeTab === 'saved' && styles.activeTabText,
            ]}
          >
            Saved
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.projectsContainer}>
        {isProjectsLoading && !refreshing ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : projectsError ? (
          <Text style={styles.errorText}>{projectsError}</Text>
        ) : activeTab === 'projects' ? (
          userProjects.length > 0 ? (
            <View style={styles.projectsGrid}>
              {userProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  id={project.id}
                  title={project.title}
                  designer={project.designer}
                  imageUrl={project.imageUrl}
                  backgroundColor={project.backgroundColor}
                  aspectRatio={index % 2 === 0 ? 1.2 : 0.8}
                  onPress={() => handleProjectPress(project.id)}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No projects yet</Text>
              <Text style={styles.emptySubtext}>
                Your uploaded projects will appear here
              </Text>
              <Button
                title="Create Project"
                onPress={() => router.push('/(tabs)/create')}
                style={styles.createButton}
              />
            </View>
          )
        ) : (
          // Saved projects tab
          <View style={styles.projectsGrid}>
            {projects.slice(0, 3).map((project, index) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                title={project.title}
                designer={project.designer}
                imageUrl={project.imageUrl}
                backgroundColor={project.backgroundColor}
                aspectRatio={index % 2 === 0 ? 1.2 : 0.8}
                isSaved={true}
                onPress={() => handleProjectPress(project.id)}
              />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    paddingBottom: 40,
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
  header: {
    backgroundColor: COLORS.white,
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: COLORS.black,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.white,
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    ...TYPOGRAPHY.heading,
    marginBottom: 4,
  },
  designation: {
    ...TYPOGRAPHY.body,
    color: COLORS.darkGray,
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginBottom: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.lightGray,
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
    height: '100%',
    backgroundColor: COLORS.lightGray,
  },
  bio: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
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
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  editButton: {
    flex: 1,
    marginRight: 8,
    maxWidth: 150,
  },
  editButtonText: {
    color: COLORS.primary,
  },
  logoutButton: {
    flex: 1,
    marginLeft: 8,
    maxWidth: 150,
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  logoutButtonText: {
    color: COLORS.black,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
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
    padding: 20,
  },
  emptyText: {
    ...TYPOGRAPHY.subheading,
    marginBottom: 8,
  },
  emptySubtext: {
    ...TYPOGRAPHY.body,
    color: COLORS.darkGray,
    textAlign: 'center',
    marginBottom: 16,
  },
  createButton: {
    width: 200,
  },
});