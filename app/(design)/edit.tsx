import { ImageEditor } from '@/components/ImageEditor';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import ThemedText from '@/components/ui/ThemedText';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { IS_IOS } from '@/lib/utils/env';
import * as ImageManipulator from 'expo-image-manipulator';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native';

export default function DesignEditScreen() {
  const router = useRouter();
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
  const { isDark } = useTheme();
  const { user } = useAuth();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editedImageUri, setEditedImageUri] = useState(imageUri);
  const [loading, setLoading] = useState(false);

  const handleSave = async (newImageUri: string) => {
    if (!title.trim()) {
      // Show error
      return;
    }

    setLoading(true);
    try {
      // Compress the final image for upload
      const result = await ImageManipulator.manipulateAsync(
        newImageUri,
        [],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );

      // TODO: Save design with title, description, and image

      router.back();
      // Pass back the edited image URI
      router.setParams({ editedImageUri: result.uri });
    } catch (error) {
      console.error('Error saving design:', error);
      // Show error
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  // If we have an image, show the editor
  if (imageUri) {
    return (
      <ThemedView style={styles.container}>
        <ImageEditor
          imageUri={editedImageUri}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </ThemedView>
    );
  }

  // Otherwise show the design creation form
  return (
    <KeyboardAvoidingView
      behavior={IS_IOS ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, minHeight: '100%' }}
      >
        <ThemedView className="flex-1 space-y-6">
          {/* Design Preview */}
          <View className="aspect-square rounded-2xl bg-gray-100 dark:bg-gray-900 justify-center items-center">
            <Icon 
              name="palette" 
              size={48}
              className="text-gray-400"
            />
            <ThemedText className="mt-4 text-base font-medium text-gray-600 dark:text-gray-400">
              Tap to add your design
            </ThemedText>
          </View>

          {/* Design Details */}
          <View className="space-y-4">
            <Input
              label="Title"
              value={title}
              onChangeText={setTitle}
              placeholder="Give your design a title"
              returnKeyType="next"
              autoCapitalize="words"
              maxLength={100}
            />

            <Input
              label="Description"
              value={description}
              onChangeText={setDescription}
              placeholder="Add a description (optional)"
              returnKeyType="done"
              multiline
              numberOfLines={4}
              maxLength={500}
            />
          </View>

          {/* Actions */}
          <View className="flex-row space-x-4">
            <Button
              variant="outline"
              className="flex-1"
              onPress={handleCancel}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onPress={() => handleSave(editedImageUri)}
              loading={loading}
            >
              Save
            </Button>
          </View>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
