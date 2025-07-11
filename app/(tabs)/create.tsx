import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  Image,
  TextInput,
  Alert,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Upload, Plus, X } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';
import { TYPOGRAPHY } from '@/constants/typography';
import { Button } from '@/components/Button';
import { categories } from '@/mocks/categories';

export default function CreateScreen() {
  const router = useRouter();
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pickImage = async (isMain = true) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (isMain) {
        setMainImage(result.assets[0].uri);
      } else {
        setAdditionalImages([...additionalImages, result.assets[0].uri]);
      }
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...additionalImages];
    newImages.splice(index, 1);
    setAdditionalImages(newImages);
  };

  const handleSubmit = async () => {
    if (!mainImage) {
      Alert.alert('Error', 'Please upload a main image');
      return;
    }

    if (!title) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    if (!selectedCategory) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In a real app, this would upload images to Firebase Storage
      // and create a new document in Firestore

      Alert.alert(
        'Success',
        'Your project has been uploaded successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setMainImage(null);
              setAdditionalImages([]);
              setTitle('');
              setDescription('');
              setSelectedCategory(null);
              
              // Navigate to home
              router.push('/(tabs)');
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to upload project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.heading}>Create New Project</Text>

      <View style={styles.mainImageContainer}>
        {mainImage ? (
          <View style={styles.mainImageWrapper}>
            <Image source={{ uri: mainImage }} style={styles.mainImage} />
            <TouchableOpacity 
              style={styles.removeImageButton}
              onPress={() => setMainImage(null)}
            >
              <X size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.uploadMainButton}
            onPress={() => pickImage(true)}
          >
            <Upload size={40} color={COLORS.darkGray} />
            <Text style={styles.uploadText}>Upload cover image</Text>
            <Text style={styles.uploadSubtext}>PNG, JPEG (Max 5MB)</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Project Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter project title"
            placeholderTextColor={COLORS.darkGray}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Describe your project..."
            placeholderTextColor={COLORS.darkGray}
            multiline
            numberOfLines={Platform.OS === 'ios' ? 0 : 4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map(category => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryPill,
                  selectedCategory === category.id && styles.selectedCategoryPill,
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text 
                  style={[
                    styles.categoryPillText,
                    selectedCategory === category.id && styles.selectedCategoryPillText,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Additional Images</Text>
          <View style={styles.additionalImagesContainer}>
            {additionalImages.map((image, index) => (
              <View key={index} style={styles.additionalImageWrapper}>
                <Image source={{ uri: image }} style={styles.additionalImage} />
                <TouchableOpacity 
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}
                >
                  <X size={16} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity 
              style={styles.addImageButton}
              onPress={() => pickImage(false)}
            >
              <Plus size={24} color={COLORS.darkGray} />
            </TouchableOpacity>
          </View>
        </View>

        <Button
          title="Upload Project"
          onPress={handleSubmit}
          loading={isSubmitting}
          style={styles.submitButton}
        />
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
    padding: 16,
    paddingBottom: 40,
  },
  heading: {
    ...TYPOGRAPHY.heading,
    marginBottom: 24,
    textAlign: 'center',
  },
  mainImageContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  uploadMainButton: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    ...TYPOGRAPHY.body,
    marginTop: 12,
    fontWeight: '600',
  },
  uploadSubtext: {
    ...TYPOGRAPHY.caption,
    color: COLORS.darkGray,
    marginTop: 4,
  },
  mainImageWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    ...TYPOGRAPHY.label,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.black,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: COLORS.white,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  categoriesContainer: {
    paddingVertical: 8,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.black,
    backgroundColor: COLORS.white,
  },
  selectedCategoryPill: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryPillText: {
    ...TYPOGRAPHY.label,
    color: COLORS.black,
  },
  selectedCategoryPillText: {
    color: COLORS.white,
  },
  additionalImagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  additionalImageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  additionalImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.black,
    borderStyle: 'dashed',
  },
  submitButton: {
    marginTop: 16,
  },
});