import { ImageEditor } from '@/components/ImageEditor';
import { ThemedView } from '@/components/ThemedView';
import * as ImageManipulator from 'expo-image-manipulator';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';

export default function EditDesignScreen() {
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
  const router = useRouter();
  const [editedImageUri, setEditedImageUri] = useState(imageUri);

  const handleSave = async (newImageUri: string) => {
    try {
      // Compress the final image for upload
      const result = await ImageManipulator.manipulateAsync(
        newImageUri,
        [],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );

      // Navigate back to the create tab with the edited image
      router.back();
      // Pass back the edited image URI
      router.setParams({ editedImageUri: result.uri });
    } catch (error) {
      console.error('Error saving edited image:', error);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Edit Design',
          headerStyle: {
            backgroundColor: '#000',
          },
          headerTintColor: '#fff',
        }}
      />
      
      <ImageEditor
        imageUri={editedImageUri}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Always black for the editor
  },
});
