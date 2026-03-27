import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image, Dimensions, StatusBar, ActivityIndicator, Modal, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { MapPin, Link, Edit3, Grid, Heart, Bookmark, Plus, X } from 'lucide-react-native';
import { subscribeToUserPosts, updateProfile } from '../../services/dataService';

const { width } = Dimensions.get('window');
const GRID_SIZE = width / 3;

const ProfileScreen = () => {
  const { user, userData } = useAuth();
  const [activeTab, setActiveTab] = useState('grid');
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editWebsite, setEditWebsite] = useState('');
  const [saving, setSaving] = useState(false);

  const name = userData?.name || user?.displayName || 'Alex Rivera';
  const handle = `@${name.toLowerCase().replace(/\s+/g, '_')}`;
  const bio = userData?.bio || 'Product Designer & Coffee Enthusiast. Creating digital experiences that matter.';
  const location = userData?.location || 'San Francisco, CA';
  const website = userData?.website || 'ninja.design';

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToUserPosts(user.uid, (userPosts) => {
      setPosts(userPosts);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const openEditModal = () => {
    setEditName(name);
    setEditBio(bio);
    setEditLocation(location);
    setEditWebsite(website);
    setEditModalVisible(true);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateProfile(user.uid, {
        name: editName,
        bio: editBio,
        location: editLocation,
        website: editWebsite
      });
      setEditModalVisible(false);
      Alert.alert('Success', 'Profile updated successfully.');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const PROFILE_STATS = [
    { label: 'Posts', value: posts.length.toString() },
    { label: 'Followers', value: '1.2k' },
    { label: 'Following', value: '450' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        <View className="items-center px-6 pt-12">
          <View className="w-32 h-32 bg-[#1A1A1A] rounded-full border-4 border-black items-center justify-center mb-8 shadow-2xl relative">
            <Image 
              source={{ uri: `https://avatar.vercel.sh/${name}` }} 
              className="w-28 h-28 rounded-full"
            />
            <TouchableOpacity className="absolute bottom-0 right-0 bg-[#818CF8] w-10 h-10 rounded-full border-4 border-black items-center justify-center">
              <Plus color="white" size={16} />
            </TouchableOpacity>
          </View>
          
          <Text className="text-white text-4xl font-black mb-1">{name}</Text>
          <Text className="text-gray-500 text-xl font-bold mb-6">{handle}</Text>

          <View className="flex-row space-x-6 items-center mb-10 w-full justify-center flex-wrap">
            {location && (
                <View className="flex-row items-center bg-[#121212] px-4 py-2 rounded-xl border border-[#1A1A1A] mb-2 mr-2">
                <MapPin color="#4A5568" size={20} className="mr-2" />
                <Text className="text-gray-400 text-lg font-bold">{location}</Text>
                </View>
            )}
            {website && (
                <TouchableOpacity className="flex-row items-center bg-[#121212] px-4 py-2 rounded-xl border border-[#1A1A1A] mb-2">
                <Link color="#818CF8" size={20} className="mr-2" />
                <Text className="text-[#818CF8] text-lg font-black">{website}</Text>
                </TouchableOpacity>
            )}
          </View>

          <Text className="text-gray-300 text-center text-xl leading-8 mb-10 px-4 font-medium">
            {bio}
          </Text>

          <View className="flex-row justify-around w-full mb-12 border-t border-b border-[#1A1A1A] py-8">
            {PROFILE_STATS.map((stat) => (
              <View key={stat.label} className="items-center">
                <Text className="text-white text-3xl font-black mb-1">{stat.value}</Text>
                <Text className="text-gray-500 text-lg font-bold uppercase tracking-widest">{stat.label}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity 
            onPress={openEditModal}
            className="bg-[#121212] flex-row items-center justify-center w-full py-6 rounded-[28px] border border-[#1A1A1A] mb-12 shadow-lg"
          >
            <Edit3 color="white" size={24} className="mr-3" />
            <Text className="text-white text-2xl font-black ml-3">Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row px-8 mb-1 border-b border-[#1A1A1A]">
          {['grid', 'heart', 'bookmark'].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              className={`flex-1 items-center pb-8 border-b-4 ${
                activeTab === tab ? 'border-[#818CF8]' : 'border-transparent'
              }`}
            >
              {tab === 'grid' && <Grid color={activeTab === tab ? '#818CF8' : '#4A5568'} size={28} />}
              {tab === 'heart' && <Heart color={activeTab === tab ? '#818CF8' : '#4A5568'} size={28} />}
              {tab === 'bookmark' && <Bookmark color={activeTab === tab ? '#818CF8' : '#4A5568'} size={28} />}
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#818CF8" style={{ marginTop: 40 }} />
        ) : (
          <View className="flex-row flex-wrap">
            {posts.length === 0 ? (
                <View className="w-full items-center py-20">
                    <Text className="text-gray-600 text-lg font-bold italic">No designs shared yet</Text>
                </View>
            ) : (
                posts.map((post) => (
                  <TouchableOpacity 
                    key={post.id} 
                    className="border-[0.5px] border-black"
                    style={{ width: GRID_SIZE, height: GRID_SIZE }}
                  >
                    <Image source={{ uri: post.postImage }} className="w-full h-full" />
                  </TouchableOpacity>
                ))
            )}
          </View>
        )}
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={editModalVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView className="flex-1 bg-black">
          <View className="flex-row justify-between items-center px-6 py-6 border-b border-[#1A1A1A]">
            <TouchableOpacity onPress={() => setEditModalVisible(false)} className="p-2">
              <X color="white" size={28} />
            </TouchableOpacity>
            <Text className="text-white text-2xl font-bold">Edit Profile</Text>
            <TouchableOpacity 
              onPress={handleSaveProfile}
              disabled={saving}
              className="bg-[#818CF8]/10 px-6 py-2.5 rounded-full"
            >
              {saving ? (
                <ActivityIndicator size="small" color="#818CF8" />
              ) : (
                <Text className="text-[#818CF8] font-bold text-lg">Save</Text>
              )}
            </TouchableOpacity>
          </View>
          
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
            <ScrollView className="flex-1 px-8 pt-8">
              <View className="mb-8">
                <Text className="text-gray-400 font-bold mb-3 ml-1 uppercase text-xs tracking-widest">Name</Text>
                <TextInput 
                  value={editName}
                  onChangeText={setEditName}
                  className="bg-[#121212] flex-row items-center rounded-2xl px-6 py-5 border border-[#1A1A1A] text-white text-lg font-bold"
                  placeholderTextColor="#4A5568"
                />
              </View>

              <View className="mb-8">
                <Text className="text-gray-400 font-bold mb-3 ml-1 uppercase text-xs tracking-widest">Bio</Text>
                <TextInput 
                  value={editBio}
                  onChangeText={setEditBio}
                  multiline
                  className="bg-[#121212] pt-5 rounded-2xl px-6 pb-5 border border-[#1A1A1A] text-white text-lg font-bold min-h-[120px]"
                  placeholderTextColor="#4A5568"
                />
              </View>

              <View className="mb-8">
                <Text className="text-gray-400 font-bold mb-3 ml-1 uppercase text-xs tracking-widest">Location</Text>
                <TextInput 
                  value={editLocation}
                  onChangeText={setEditLocation}
                  className="bg-[#121212] rounded-2xl px-6 py-5 border border-[#1A1A1A] text-white text-lg font-bold"
                  placeholderTextColor="#4A5568"
                />
              </View>

              <View className="mb-12">
                <Text className="text-gray-400 font-bold mb-3 ml-1 uppercase text-xs tracking-widest">Website</Text>
                <TextInput 
                  value={editWebsite}
                  onChangeText={setEditWebsite}
                  className="bg-[#121212] rounded-2xl px-6 py-5 border border-[#1A1A1A] text-white text-lg font-bold"
                  placeholderTextColor="#4A5568"
                  autoCapitalize="none"
                />
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default ProfileScreen;
