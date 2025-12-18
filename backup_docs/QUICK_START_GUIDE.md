# 🚀 Aakar - Quick Start Implementation Guide

## ⚡ Get Started in 5 Minutes

This guide shows you exactly how to connect your screens to the production-ready Supabase backend that's already set up.

---

## 📋 Prerequisites

1. ✅ Supabase project created
2. ✅ Database schema applied (`database/schema.sql`)
3. ✅ API keys configured in the app
4. ✅ Categories seeded in database

---

## 🎯 Step 1: Update Home Screen (5 mins)

**File**: `app/(tabs)/index.tsx`

### Before (Mock Data):
```tsx
const [projects, setProjects] = useState(mockProjects);
```

### After (Real Supabase Data):
```tsx
import { useProjects } from '@/hooks/useSupabase';

export default function HomeScreen() {
  const { projects, loading, error, hasMore, refresh, loadMore } = useProjects(20);

  return (
    <FlashList
      data={projects}
      renderItem={({ item }) => <ProjectCard project={item} />}
      onRefresh={refresh}
      refreshing={loading}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      estimatedItemSize={400}
    />
  );
}
```

**That's it!** Your home screen now shows real data from Supabase.

---

## 🎯 Step 2: Update Discover/Search Screen (10 mins)

**File**: `app/(tabs)/discover.tsx`

```tsx
import { useCategories, useCategoryProjects } from '@/hooks/useSupabase';
import { useState } from 'react';

export default function DiscoverScreen() {
  const { categories, loading: categoriesLoading } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  
  const { 
    projects, 
    loading, 
    hasMore, 
    loadMore 
  } = useCategoryProjects(selectedCategory, 20);

  return (
    <View>
      {/* Category Pills */}
      <ScrollView horizontal>
        {categories.map(cat => (
          <CategoryPill
            key={cat.id}
            category={cat}
            selected={selectedCategory === cat.id}
            onPress={() => setSelectedCategory(cat.id)}
          />
        ))}
      </ScrollView>

      {/* Projects List */}
      <FlashList
        data={projects}
        renderItem={({ item }) => <ProjectCard project={item} />}
        onEndReached={loadMore}
        estimatedItemSize={400}
      />
    </View>
  );
}
```

---

## 🎯 Step 3: Update Saved Screen (3 mins)

**File**: `app/(tabs)/saved.tsx`

```tsx
import { useSavedProjects } from '@/hooks/useSupabase';

export default function SavedScreen() {
  const { projects, loading, hasMore, loadMore, refresh } = useSavedProjects(20);

  if (loading && projects.length === 0) {
    return <SkeletonLoader />;
  }

  if (projects.length === 0) {
    return <EmptyState message="No saved projects yet" />;
  }

  return (
    <FlashList
      data={projects}
      renderItem={({ item }) => <ProjectCard project={item} />}
      onRefresh={refresh}
      refreshing={loading}
      onEndReached={loadMore}
      estimatedItemSize={400}
    />
  );
}
```

---

## 🎯 Step 4: Add Like/Save Functionality (5 mins)

**Update**: `components/ProjectCard.tsx`

```tsx
import { useLike, useSave } from '@/hooks/useSupabase';
import { Heart, Bookmark } from 'lucide-react-native';

export function ProjectCard({ project }) {
  const { isLiked, toggleLike, loading: liking } = useLike(project.id);
  const { isSaved, toggleSave, loading: saving } = useSave(project.id);

  return (
    <Card>
      <Image source={{ uri: project.image_url }} />
      
      {/* Action buttons */}
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <TouchableOpacity onPress={toggleLike} disabled={liking}>
          <Heart 
            size={24} 
            color={isLiked ? '#ee4d2d' : '#666'}
            fill={isLiked ? '#ee4d2d' : 'transparent'}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleSave} disabled={saving}>
          <Bookmark 
            size={24} 
            color={isSaved ? '#ee4d2d' : '#666'}
            fill={isSaved ? '#ee4d2d' : 'transparent'}
          />
        </TouchableOpacity>
      </View>

      <Text>{project.likes_count} likes</Text>
    </Card>
  );
}
```

---

## 🎯 Step 5: Update Profile Screen (5 mins)

**File**: `app/(tabs)/profile.tsx`

```tsx
import { useProfile } from '@/hooks/useSupabase';
import { useAuth } from '@/lib/store/auth';

export default function ProfileScreen() {
  const { user } = useAuth();
  const { profile, loading, error } = useProfile(user?.id);

  if (loading) return <SkeletonLoader />;
  if (error) return <ErrorView error={error} />;

  return (
    <ScrollView>
      <Avatar uri={profile?.avatar_url} size="xl" />
      <Text>{profile?.display_name}</Text>
      <Text>{profile?.bio}</Text>
      
      <View>
        <Text>{profile?.followers_count} Followers</Text>
        <Text>{profile?.following_count} Following</Text>
      </View>

      {/* User's projects */}
      <MyProjects userId={user?.id} />
    </ScrollView>
  );
}
```

---

## 🎯 Step 6: Project Detail Screen (10 mins)

**File**: `app/project/[id].tsx`

```tsx
import { useProject, useLike, useSave } from '@/hooks/useSupabase';
import { useLocalSearchParams } from 'expo-router';

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams();
  const { project, loading, error } = useProject(id as string);
  const { isLiked, toggleLike } = useLike(id as string);
  const { isSaved, toggleSave } = useSave(id as string);

  if (loading) return <SkeletonLoader />;
  if (error || !project) return <ErrorView />;

  return (
    <ScrollView>
      <Image source={{ uri: project.image_url }} />
      
      <View>
        <Text style={styles.title}>{project.title}</Text>
        <Text style={styles.description}>{project.description}</Text>
      </View>

      {/* Stats */}
      <View>
        <Text>{project.likes_count} likes</Text>
        <Text>{project.views_count} views</Text>
        <Text>{project.saves_count} saves</Text>
      </View>

      {/* Actions */}
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Button onPress={toggleLike}>
          {isLiked ? 'Unlike' : 'Like'}
        </Button>
        <Button onPress={toggleSave} variant="outline">
          {isSaved ? 'Unsave' : 'Save'}
        </Button>
      </View>

      {/* Comments Section */}
      <CommentsSection projectId={id as string} />
    </ScrollView>
  );
}
```

---

## 🎯 Step 7: Image Upload (15 mins)

**File**: `app/(tabs)/create.tsx`

```tsx
import { useImageUpload } from '@/hooks/useSupabase';
import { supabaseService } from '@/lib/supabase/client-unified';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/lib/store/auth';
import { useRouter } from 'expo-router';

export default function CreateScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { uploadImage, uploading, progress } = useImageUpload();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    if (!imageUri || !user?.id) return;

    try {
      // Convert URI to Blob
      const response = await fetch(imageUri);
      const blob = await response.blob();

      // Upload to Supabase Storage
      const imagePath = `${user.id}/${Date.now()}.jpg`;
      const imageUrl = await uploadImage('projects', blob, imagePath);

      if (!imageUrl) throw new Error('Upload failed');

      // Create project in database
      const project = await supabaseService.createProject({
        title,
        description,
        image_url: imageUrl,
        user_id: user.id,
        category_id: category,
        tags: [],
        is_published: true,
      });

      // Navigate to project
      router.push(`/project/${project.id}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to upload project');
    }
  };

  return (
    <ScrollView>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={{ width: '100%', height: 300 }} />
      ) : (
        <TouchableOpacity onPress={pickImage}>
          <Text>Pick an image</Text>
        </TouchableOpacity>
      )}

      <Input
        label="Title"
        value={title}
        onChangeText={setTitle}
        required
      />

      <Input
        label="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <CategoryPicker
        value={category}
        onChange={setCategory}
      />

      <Button
        onPress={handleUpload}
        loading={uploading}
        disabled={!imageUri || !title || !category}
      >
        {uploading ? `Uploading ${progress}%` : 'Publish'}
      </Button>
    </ScrollView>
  );
}
```

---

## 🎯 Step 8: Follow System (5 mins)

**File**: `app/designer/[id].tsx`

```tsx
import { useProfile, useFollow } from '@/hooks/useSupabase';
import { useAuth } from '@/lib/store/auth';
import { useLocalSearchParams } from 'expo-router';

export default function DesignerProfileScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const { profile, loading } = useProfile(id as string);
  const { isFollowing, toggleFollow, loading: followLoading } = useFollow(id as string);

  const isOwnProfile = user?.id === id;

  return (
    <View>
      <Avatar uri={profile?.avatar_url} size="xl" />
      <Text>{profile?.display_name}</Text>
      <Text>{profile?.bio}</Text>

      {!isOwnProfile && (
        <Button
          onPress={toggleFollow}
          loading={followLoading}
          variant={isFollowing ? 'outline' : 'primary'}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </Button>
      )}

      <View>
        <Text>{profile?.followers_count} Followers</Text>
        <Text>{profile?.following_count} Following</Text>
      </View>
    </View>
  );
}
```

---

## 📊 Quick Reference: All Available Hooks

```typescript
import {
  useProjects,          // Get paginated projects
  useProject,           // Get single project
  useCategories,        // Get all categories
  useCategoryProjects,  // Get projects by category
  useLike,              // Like/unlike project
  useSave,              // Save/unsave project
  useSavedProjects,     // Get user's saved projects
  useProfile,           // Get user profile
  useFollow,            // Follow/unfollow user
  useImageUpload,       // Upload images
} from '@/hooks/useSupabase';
```

---

## 🔧 Common Patterns

### Loading State
```tsx
if (loading && data.length === 0) {
  return <SkeletonLoader />;
}
```

### Error State
```tsx
if (error) {
  return <ErrorView error={error} onRetry={refresh} />;
}
```

### Empty State
```tsx
if (!loading && data.length === 0) {
  return <EmptyState message="No items found" />;
}
```

### Pull to Refresh
```tsx
<FlashList
  onRefresh={refresh}
  refreshing={loading}
  // ...
/>
```

### Load More (Pagination)
```tsx
<FlashList
  onEndReached={loadMore}
  onEndReachedThreshold={0.5}
  // ...
/>
```

---

## ✅ Testing Checklist

- [ ] Home screen shows real projects
- [ ] Discover screen filters by category
- [ ] Saved screen shows user's saved projects
- [ ] Like button works and persists
- [ ] Save button works and persists
- [ ] Profile shows correct user data
- [ ] Follow button works
- [ ] Image upload creates project
- [ ] Navigation works everywhere
- [ ] Pull to refresh works
- [ ] Load more pagination works

---

## 🎉 You're Done!

Your app is now connected to Supabase and using real data. All the infrastructure is production-ready.

**Next Steps**:
1. Add FlashList everywhere (replace FlatList)
2. Add loading skeletons
3. Add error boundaries
4. Implement search
5. Add comments
6. Add real-time updates
7. Polish animations
8. Add tests

---

<div align="center">

**Made with ❤️ - Happy Coding!**

</div>
