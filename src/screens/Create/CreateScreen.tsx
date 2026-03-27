import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, Alert, Image } from 'react-native';
import { X, Plus, Layout, Image as ImageIcon } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { createPost } from '../../services/dataService';
import * as ImagePicker from 'expo-image-picker';

const CATEGORIES = ['UI/UX', 'Logo', 'Branding', 'Web', '3D'];

const CreateScreen = () => {
  const navigation = useNavigation<any>();
  const { user, userData } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('UI/UX');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    // Request permissions
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You've refused to allow this app to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 5],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handlePublish = async () => {
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please give your design a title before publishing.');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in to publish a post.');
      return;
    }

    setLoading(true);
    try {
      await createPost(
        user.uid,
        userData?.name || user.displayName || 'Designer',
        title,
        description,
        imageUri || '',
        category
      );
      Alert.alert('Success!', 'Your design has been published to the Aakar Feed.');
      setTitle('');
      setDescription('');
      setImageUri(null);
      navigation.navigate('Home');
    } catch (error) {
      console.error(error);
      Alert.alert('Publishing Failed', 'There was an error saving your post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-row justify-between items-center px-6 py-6 border-b border-[#1A1A1A]">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <X color="white" size={28} />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold">New Design</Text>
        <TouchableOpacity 
          onPress={handlePublish}
          disabled={loading}
          className="bg-[#818CF8]/10 px-6 py-2.5 rounded-full"
        >
          {loading ? (
             <ActivityIndicator size="small" color="#818CF8" />
          ) : (
            <Text className="text-[#818CF8] font-bold text-lg">Publish</Text>
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          className="flex-1 px-8 pt-10"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <TouchableOpacity 
             onPress={pickImage}
             className="group w-full h-80 bg-[#121212] rounded-[32px] border-2 border-dashed border-[#2D3748] items-center justify-center mb-12 overflow-hidden shadow-inner"
          >
            {imageUri ? (
                <Image source={{ uri: imageUri }} className="w-full h-full" resizeMode="cover" />
            ) : (
                <View className="items-center">
                    <View className="bg-[#1A1A1A] p-5 rounded-full mb-4">
                        <ImageIcon color="#818CF8" size={40} strokeWidth={2} />
                    </View>
                    <Text className="text-gray-400 font-bold text-lg">Tap to upload design</Text>
                    <Text className="text-gray-600 font-medium mt-1">PNG, JPG up to 10MB</Text>
                </View>
            )}
          </TouchableOpacity>

          <View className="mb-12">
            <TextInput
              placeholder="Title of your work"
              placeholderTextColor="#2D3748"
              value={title}
              onChangeText={setTitle}
              className="text-white text-4xl font-bold border-b border-[#1A1A1A] pb-4"
              multiline
            />
          </View>

          <View className="flex-row items-center mb-16">
            <View className="mr-6">
              <Plus color="#2D3748" size={28} />
              <View className="w-[2px] h-6 bg-[#1A1A1A] absolute -bottom-6 left-3" />
            </View>
            <TextInput
              placeholder="Tell us about your process..."
              placeholderTextColor="#4A5568"
              value={description}
              onChangeText={setDescription}
              className="flex-1 text-gray-500 text-xl font-medium"
              multiline
            />
          </View>

          <View className="space-y-4">
            <View className="flex-row items-center justify-between py-6 border-b border-[#1A1A1A]">
                <View className="flex-row items-center">
                    <Layout color="#94A3B8" size={24} className="mr-4" />
                    <Text className="text-white text-xl font-bold ml-3">Category</Text>
                </View>
            </View>

            <View className="flex-row flex-wrap mt-4">
                {CATEGORIES.map(cat => (
                   <TouchableOpacity 
                    key={cat}
                    onPress={() => setCategory(cat)}
                    className={`px-6 py-3 rounded-full mr-3 mb-3 border ${category === cat ? 'bg-[#818CF8] border-[#818CF8]' : 'bg-[#121212] border-[#2D3748]'}`}
                   >
                       <Text className={`font-bold text-lg ${category === cat ? 'text-white' : 'text-gray-500'}`}>{cat}</Text>
                   </TouchableOpacity> 
                ))}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateScreen;
