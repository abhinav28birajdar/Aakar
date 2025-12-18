import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/ui/Button';
import { COLORS } from '@/constants/colors';
import { TYPOGRAPHY } from '@/constants/typography';
import { useProjects } from '@/hooks/useProjects';
import { useUser } from '@/hooks/useUser';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Heart, MessageCircle, Share2 } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View
} from 'react-native';

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { getProjectById } = useProjects();
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  const { getUserById } = useUser();
  const [designer, setDesigner] = useState<any>(null);

  useEffect(() => {
    const fetchProjectAndDesigner = async () => {
      setIsLoading(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const projectData = await getProjectById(id as string);
        
        if (projectData) {
          setProject(projectData);
          
          // Fetch designer data
          const designerData = await getUserById(projectData.designerId);
          setDesigner(designerData);
        }
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProjectAndDesigner();
    }
  }, [id, getProjectById, getUserById]);

  const toggleSave = () => {
    setIsSaved(!isSaved);
    // In a real app, this would update Firestore
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
    // In a real app, this would update Firestore
  };

  const handleShare = () => {
    // In a real app, this would open the native share dialog
    console.log('Share project:', project?.title);
  };

  const handleDesignerPress = () => {
    if (designer) {
      router.push(`/designer/${designer.id}`);
    }
  };

  const handleMessage = () => {
    // In a real app, this would navigate to the chat screen
    console.log('Message designer:', designer?.fullName);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!project) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Project not found</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{
          title: project.title,
          headerBackTitle: 'Back',
        }}
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Image 
          source={{ uri: project.imageUrl }} 
          style={[styles.heroImage, { width, height: width * 0.75 }]} 
          resizeMode="cover"
        />

        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>{project.title}</Text>
            
            <View style={styles.designerContainer}>
              <TouchableOpacity 
                style={styles.designerInfo}
                onPress={handleDesignerPress}
              >
                <Avatar 
                  uri={designer?.avatarUrl} 
                  size={40} 
                />
                <View style={styles.designerTextContainer}>
                  <Text style={styles.designerName}>{designer?.fullName || project.designer}</Text>
                  <Text style={styles.designerRole}>{designer?.designation || 'Designer'}</Text>
                </View>
              </TouchableOpacity>

              <Button
                title="Follow"
                variant="outline"
                size="small"
                onPress={() => console.log('Follow designer')}
                style={styles.followButton}
              />
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{project.views}</Text>
                <Text style={styles.statLabel}>Views</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{project.likes}</Text>
                <Text style={styles.statLabel}>Likes</Text>
              </View>
            </View>

            <View style={styles.actionsContainer}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={toggleLike}
              >
                <Heart 
                  size={24} 
                  color={isLiked ? COLORS.primary : COLORS.black} 
                  fill={isLiked ? COLORS.primary : 'none'} 
                />
                <Text style={styles.actionText}>Like</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={toggleSave}
              >
                <Heart 
                  size={24} 
                  color={isSaved ? COLORS.primary : COLORS.black} 
                  fill={isSaved ? COLORS.primary : 'none'} 
                />
                <Text style={styles.actionText}>Save</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={handleShare}
              >
                <Share2 size={24} color={COLORS.black} />
                <Text style={styles.actionText}>Share</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={handleMessage}
              >
                <MessageCircle size={24} color={COLORS.black} />
                <Text style={styles.actionText}>Message</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{project.description}</Text>
          </View>

          <View style={styles.ctaContainer}>
            <Button
              title="Hire Designer"
              onPress={() => console.log('Hire designer')}
              style={styles.hireButton}
            />
          </View>
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
  heroImage: {
    width: '100%',
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginTop: -40,
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  title: {
    ...TYPOGRAPHY.heading,
    marginBottom: 16,
  },
  designerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  designerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  designerTextContainer: {
    marginLeft: 12,
  },
  designerName: {
    ...TYPOGRAPHY.subheading,
    fontSize: 16,
  },
  designerRole: {
    ...TYPOGRAPHY.caption,
    color: COLORS.darkGray,
  },
  followButton: {
    paddingHorizontal: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.lightGray,
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...TYPOGRAPHY.heading,
    fontSize: 18,
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
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    ...TYPOGRAPHY.caption,
    marginTop: 4,
  },
  descriptionContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  sectionTitle: {
    ...TYPOGRAPHY.subheading,
    marginBottom: 12,
  },
  description: {
    ...TYPOGRAPHY.body,
    lineHeight: 22,
  },
  ctaContainer: {
    marginTop: 24,
    marginBottom: 40,
  },
  hireButton: {
    width: '100%',
  },
});