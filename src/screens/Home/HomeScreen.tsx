import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Image, StatusBar, ActivityIndicator, RefreshControl, TextInput } from 'react-native';
import { Search, Bell, Heart, X, Filter } from 'lucide-react-native';
import { subscribeToPosts, toggleLike } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';

const CATEGORIES = ['All', 'Logo', 'UI/UX', 'Branding', 'Web', '3D'];

const DEMO_POSTS = [
  {
    id: 'demo-1',
    title: 'Neon Financial Dashboard',
    author: 'alex_design',
    authorImage: 'https://avatar.vercel.sh/alex_design',
    postImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
    likes: 124,
    category: 'UI/UX',
    likedBy: []
  },
  {
    id: 'demo-2',
    title: 'Modern Architecture Branding',
    author: 'sarah_studio',
    authorImage: 'https://avatar.vercel.sh/sarah_studio',
    postImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
    likes: 89,
    category: 'Branding',
    likedBy: []
  },
  {
    id: 'demo-4',
    title: 'Smart Home App Flow',
    author: 'ninja.ui',
    authorImage: 'https://avatar.vercel.sh/ninja.ui',
    postImage: 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?q=80&w=800&auto=format&fit=crop',
    likes: 412,
    category: 'UI/UX',
    likedBy: []
  },
  {
    id: 'demo-3',
    title: 'Abstract 3D Renders',
    author: 'pixel_master',
    authorImage: 'https://avatar.vercel.sh/pixel_master',
    postImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
    likes: 256,
    category: '3D',
    likedBy: []
  },
  {
    id: 'demo-5',
    title: 'Minimalist Coffee Logo',
    author: 'brand_guru',
    authorImage: 'https://avatar.vercel.sh/brand_guru',
    postImage: 'https://images.unsplash.com/photo-1557053964-937650ddafeb?q=80&w=800&auto=format&fit=crop',
    likes: 75,
    category: 'Logo',
    likedBy: []
  }
];

const FeedCard = ({ post, currentUserId }: { post: any, currentUserId: string | undefined }) => {
  const isLiked = post.likedBy?.includes(currentUserId);

  const handleLike = () => {
    if (currentUserId && !post.id.startsWith('demo-')) {
      toggleLike(post.id, currentUserId);
    }
  };

  return (
    <View className="mb-6 bg-[#121212] rounded-[32px] border border-[#1A1A1A] overflow-hidden">
      <Image 
        source={{ uri: post.postImage || 'https://picsum.photos/id/1/800/800' }} 
        className="w-full h-80"
        resizeMode="cover"
      />
      <View className="p-6">
        <Text className="text-white text-2xl font-bold mb-4">{post.title}</Text>
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Image 
              source={{ uri: post.authorImage || `https://avatar.vercel.sh/${post.author}` }} 
              className="w-10 h-10 rounded-full mr-3 border border-[#2D3748]"
            />
            <Text className="text-gray-400 font-medium">{post.author}</Text>
          </View>
          <TouchableOpacity 
            onPress={handleLike}
            className={`flex-row items-center px-4 py-2 bg-[#1A1A1A] rounded-xl border ${isLiked ? 'border-[#EF4444]' : 'border-[#2D3748]'}`}
          >
            <Heart color={isLiked ? "#EF4444" : "#94A3B8"} size={16} fill={isLiked ? "#EF4444" : "transparent"} />
            <Text className={`ml-2 font-bold ${isLiked ? "text-[#EF4444]" : "text-white"}`}>{post.likes || 0}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const HomeScreen = () => {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState('All');
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeToPosts((allPosts) => {
      setPosts(allPosts);
      setLoading(false);
      setRefreshing(false);
    });
    return () => unsubscribe();
  }, []);

  const displayPosts = [...posts, ...DEMO_POSTS];

  const filteredPosts = displayPosts.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      <View className="px-6 py-8">
        {searchActive ? (
          <View className="flex-row items-center bg-[#121212] rounded-3xl px-6 py-5 mb-8 border border-[#1A1A1A] mt-2">
            <Search color="#818CF8" size={20} strokeWidth={2.5} />
            <TextInput 
              placeholder="Search designs or users..."
              placeholderTextColor="#4A5568"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
              className="flex-1 text-white ml-4 text-lg font-medium"
            />
            <TouchableOpacity onPress={() => { setSearchActive(false); setSearchQuery(''); }} className="ml-3 bg-[#1A1A1A] p-2 rounded-full">
              <X color="#818CF8" size={16} strokeWidth={3} />
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-row justify-between items-start mb-8">
            <View>
              <Text className="text-gray-400 text-lg mb-1">Good Morning,</Text>
              <Text className="text-white text-4xl font-bold">Aakar Feed</Text>
            </View>
            <View className="flex-row space-x-3">
              <TouchableOpacity onPress={() => setSearchActive(true)} className="bg-[#121212] p-4 rounded-2xl border border-[#1A1A1A]">
                <Search color="white" size={24} strokeWidth={2.5} />
              </TouchableOpacity>
              <TouchableOpacity className="bg-[#121212] p-4 rounded-2xl border border-[#1A1A1A] relative">
                <Bell color="white" size={24} strokeWidth={2.5} />
                <View className="absolute top-3 right-3 w-3 h-3 bg-red-500 rounded-full border-2 border-black" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          className="mb-8 h-16 flex-none"
          contentContainerStyle={{ paddingRight: 40 }}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setActiveCategory(cat)}
              className={`px-8 py-4 rounded-2xl mr-3 border justify-center ${
                activeCategory === cat ? 'bg-[#818CF8] border-[#818CF8]' : 'bg-[#121212] border-[#1A1A1A]'
              }`}
            >
              <Text className={`text-lg font-bold ${
                activeCategory === cat ? 'text-white' : 'text-gray-400'
              }`}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#818CF8" />
        </View>
      ) : (
        <ScrollView 
          className="flex-1 px-6" 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
          refreshControl={
            <RefreshControl 
                refreshing={refreshing} 
                onRefresh={() => setRefreshing(true)} 
                tintColor="#818CF8" 
            />
          }
        >
          {filteredPosts.length === 0 ? (
            <View className="items-center py-20 bg-[#121212] rounded-[32px] border border-[#1A1A1A]">
              <Text className="text-gray-500 text-xl font-bold mb-4 italic">No matching designs found</Text>
              <Text className="text-gray-600 font-medium text-center px-8">Try adjusting your search criteria or explore a different category.</Text>
            </View>
          ) : (
            filteredPosts.map((post) => (
              <FeedCard key={post.id} post={post} currentUserId={user?.uid} />
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;
