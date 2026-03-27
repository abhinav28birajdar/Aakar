import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Image, TextInput, Dimensions, ActivityIndicator } from 'react-native';
import { Search, Filter, Sparkles, TrendingUp, Grid, Bell } from 'lucide-react-native';
import { getTrendingPosts } from '../../services/dataService';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48 - 16) / 2;

const FeaturedCategory = ({ title, items, image }: any) => (
  <TouchableOpacity 
    className="bg-[#121212] rounded-[32px] overflow-hidden mr-4 border border-[#1A1A1A]"
    style={{ width: CARD_WIDTH + 20, height: CARD_WIDTH + 40 }}
  >
    <Image 
      source={{ uri: image }} 
      className="w-full h-full opacity-60"
      resizeMode="cover"
    />
    <View className="absolute bottom-5 left-5">
      <Text className="text-white text-lg font-bold tracking-tight">{title}</Text>
      <Text className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">{items} items</Text>
    </View>
  </TouchableOpacity>
);

const TrendingCard = ({ post }: { post: any }) => (
  <TouchableOpacity 
    className="bg-[#121212] rounded-[24px] overflow-hidden mb-4 border border-[#1A1A1A]"
    style={{ width: CARD_WIDTH, height: CARD_WIDTH }}
  >
    <Image 
      source={{ uri: post.postImage || 'https://picsum.photos/id/10/400/400' }} 
      className="w-full h-full"
      resizeMode="cover"
    />
    <View className="absolute bottom-3 left-3 bg-black/60 px-3 py-2 rounded-xl border border-white/10">
      <Text className="text-white text-[10px] font-black" numberOfLines={1}>{post.title}</Text>
    </View>
  </TouchableOpacity>
);

const ExploreScreen = () => {
  const [trending, setTrending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const posts = await getTrendingPosts();
        setTrending(posts);
      } catch (error) {
        console.error("Error fetching trending posts", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView 
        className="flex-1 px-6 pt-8"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className="flex-row justify-between items-center mb-10">
          <Text className="text-white text-5xl font-black tracking-tighter">Explore</Text>
          <View className="flex-row space-x-3 items-center">
            <TouchableOpacity className="bg-[#121212] p-3 rounded-xl border border-[#1A1A1A]">
              <Bell color="#4A5568" size={24} />
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row items-center bg-[#121212] rounded-3xl px-6 py-5 mb-10 border border-[#1A1A1A]">
          <Search color="#818CF8" size={20} strokeWidth={2.5} />
          <TextInput 
            placeholder="Search designs..."
            placeholderTextColor="#4A5568"
            className="flex-1 text-white ml-4 text-lg font-medium"
          />
          <TouchableOpacity className="ml-3">
            <Filter color="#818CF8" size={20} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center justify-between mb-8">
          <View className="flex-row items-center">
            <Sparkles color="#818CF8" size={20} className="mr-2" />
            <Text className="text-white text-2xl font-black tracking-tight ml-2">Featured</Text>
          </View>
          <TouchableOpacity>
            <Text className="text-[#818CF8] font-bold">See All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-14">
          <FeaturedCategory 
            title="UI/UX Design"
            items="12K+"
            image="https://picsum.photos/id/10/400/600"
          />
          <FeaturedCategory 
            title="Logo Design"
            items="8K+"
            image="https://picsum.photos/id/11/400/600"
          />
          <FeaturedCategory 
            title="3D Artworks"
            items="5K+"
            image="https://picsum.photos/id/12/400/600"
          />
        </ScrollView>

        <View className="flex-row items-center justify-between mb-8">
          <View className="flex-row items-center">
            <TrendingUp color="#818CF8" size={20} className="mr-2" />
            <Text className="text-white text-2xl font-black tracking-tight ml-2">Trending Now</Text>
          </View>
          <TouchableOpacity className="bg-[#121212] w-10 h-10 rounded-xl items-center justify-center border border-[#1A1A1A]">
            <Grid color="#818CF8" size={20} />
          </TouchableOpacity>
        </View>

        {loading ? (
             <ActivityIndicator size="large" color="#818CF8" style={{ marginTop: 20 }} />
        ) : (
            <View className="flex-row flex-wrap justify-between">
                {trending.length > 0 ? trending.map(post => (
                    <TrendingCard key={post.id} post={post} />
                )) : (
                    <View className="w-full items-center py-10">
                        <Text className="text-gray-500 italic font-bold text-center">No trending posts right now. Return later!</Text>
                    </View>
                )}
            </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ExploreScreen;
