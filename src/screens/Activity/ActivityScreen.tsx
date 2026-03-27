import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Image, StatusBar, ActivityIndicator, TextInput } from 'react-native';
import { Search, Filter, Heart, MessageCircle, UserPlus, X } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { subscribeToActivity, subscribeToMessages } from '../../services/dataService';

const DEMO_ACTIVITY = [
  {
    id: 'act-1',
    user: 'creative_mind',
    action: 'liked your post',
    time: '2m ago',
    avatar: 'https://avatar.vercel.sh/creative_mind',
    type: 'like',
    postPreview: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 'act-2',
    user: 'pixel_art',
    action: 'commented on your post',
    time: '15m ago',
    avatar: 'https://avatar.vercel.sh/pixel_art',
    type: 'comment',
    postPreview: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 'act-3',
    user: 'sarah_studio',
    action: 'started following you',
    time: '1h ago',
    avatar: 'https://avatar.vercel.sh/sarah_studio',
    type: 'follow',
    postPreview: null,
  }
];

const DEMO_MESSAGES = [
  {
    id: 'msg-1',
    user: 'Sarah Chen',
    message: 'Hey! I saw your latest UI design and wanted to ask about the grid system you used...',
    time: '2m ago',
    avatar: 'https://avatar.vercel.sh/sarah_chen',
    unread: 2,
    online: true,
  },
  {
    id: 'msg-2',
    user: 'Mike Ross',
    message: 'Are we still on for the design review tomorrow?',
    time: '1h ago',
    avatar: 'https://avatar.vercel.sh/mike_ross',
    unread: 0,
    online: false,
  },
  {
    id: 'msg-3',
    user: 'Elena Ford',
    message: 'Loved the new branding concepts! The color palette is so premium.',
    time: '1d ago',
    avatar: 'https://avatar.vercel.sh/elena_ford',
    unread: 1,
    online: true,
  }
];

const ActivityItem = ({ item }: any) => {
  const getIcon = () => {
    switch (item.type) {
      case 'like': return <Heart color="white" size={10} fill="white" />;
      case 'comment': return <MessageCircle color="white" size={10} fill="white" />;
      case 'follow': return <UserPlus color="white" size={10} fill="white" />;
      default: return null;
    }
  };

  const getBgColor = () => {
    switch (item.type) {
      case 'like': return 'bg-red-500';
      case 'comment': return 'bg-blue-500';
      case 'follow': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <TouchableOpacity className="flex-row items-center mb-10 px-6">
      <View className="relative">
        <Image 
          source={{ uri: item.avatar || `https://avatar.vercel.sh/${item.user}` }} 
          className="w-20 h-20 rounded-full border-2 border-slate-900"
        />
        <View className={`absolute -right-2 -bottom-2 ${getBgColor()} w-10 h-10 rounded-full border-4 border-black items-center justify-center`}>
          {getIcon()}
        </View>
      </View>
      
      <View className="flex-1 ml-6 mr-6 justify-center">
        <Text className="text-white text-xl font-bold leading-7">
          {item.user} <Text className="text-gray-400 font-medium">{item.action}</Text>
        </Text>
        <Text className="text-gray-500 text-lg font-bold mt-1.5">{item.time || 'now'}</Text>
      </View>

      {item.postPreview && (
        <Image 
          source={{ uri: item.postPreview }} 
          className="w-20 h-20 rounded-[20px]"
          resizeMode="cover"
        />
      )}
    </TouchableOpacity>
  );
};

const MessageItem = ({ item }: any) => (
  <TouchableOpacity className="flex-row items-center mb-10 px-6">
    <View className="relative">
      <Image 
        source={{ uri: item.avatar || `https://avatar.vercel.sh/${item.user}` }} 
        className="w-20 h-20 rounded-full"
      />
      {item.online && (
        <View className="absolute right-0 bottom-0 bg-green-500 w-6 h-6 rounded-full border-4 border-black" />
      )}
    </View>
    
    <View className="flex-1 ml-6 mr-4 justify-center">
      <View className="flex-row justify-between items-center mb-1">
        <Text className="text-white text-xl font-bold">{item.user}</Text>
        <Text className="text-gray-500 text-base font-bold">{item.time || 'now'}</Text>
      </View>
      <Text className={`text-lg ${item.unread > 0 ? 'text-white font-bold' : 'text-gray-400 font-medium'}`} numberOfLines={1}>
        {item.message || 'Hey! I saw your latest work...'}
      </Text>
    </View>

    {item.unread > 0 && (
      <View className="bg-[#818CF8] w-8 h-8 rounded-full items-center justify-center">
        <Text className="text-white font-bold text-xs">{item.unread}</Text>
      </View>
    )}
  </TouchableOpacity>
);

const ActivityScreen = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Activity');
  const [activity, setActivity] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!user) {
        setLoading(false);
        return;
    }
    
    const unsubActivity = subscribeToActivity(user.uid, (data) => {
        setActivity(data);
        if (activeTab === 'Activity') setLoading(false);
    });

    const unsubMessages = subscribeToMessages(user.uid, (data) => {
        setMessages(data);
        if (activeTab === 'Messages') setLoading(false);
    });

    setLoading(false);

    return () => {
        unsubActivity();
        unsubMessages();
    };
  }, [user, activeTab]);

  const displayActivity = activity.length > 0 ? activity : DEMO_ACTIVITY;
  const displayMessages = messages.length > 0 ? messages : DEMO_MESSAGES;

  const filteredActivity = displayActivity.filter(i => i.user.toLowerCase().includes(searchQuery.toLowerCase()) || i.action?.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredMessages = displayMessages.filter(m => m.user.toLowerCase().includes(searchQuery.toLowerCase()) || m.message?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      
      <View className="px-6 py-8">
        {searchActive ? (
            <View className="flex-row items-center bg-[#121212] rounded-3xl px-6 py-5 mb-2 border border-[#1A1A1A] mt-2">
                <Search color="#818CF8" size={20} strokeWidth={2.5} />
                <TextInput 
                    placeholder="Search people or messages..."
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
            <View className="flex-row justify-between items-center">
                <Text className="text-white text-5xl font-bold">Inbox</Text>
                <View className="flex-row space-x-6 items-center">
                    <TouchableOpacity onPress={() => setSearchActive(true)} className="bg-[#1A1A1A] p-3.5 rounded-2xl">
                        <Search color="white" size={32} />
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-[#1A1A1A] p-3.5 rounded-2xl relative">
                        <Filter color="white" size={32} />
                        <View className="absolute top-2 right-2 w-3 h-3 bg-[#818CF8] rounded-full border-2 border-[#1A1A1A]" />
                    </TouchableOpacity>
                </View>
            </View>
        )}
      </View>

      <View className="flex-row px-6 mb-10 border-b border-[#1A1A1A]">
        {['Activity', 'Messages'].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => {
                setActiveTab(tab);
                setSearchActive(false);
                setSearchQuery('');
            }}
            className={`mr-10 pb-6 items-center relative`}
            style={{ minWidth: 100 }}
          >
            <View className="flex-row items-center">
              <Text className={`text-2xl font-bold ${
                activeTab === tab ? 'text-white' : 'text-gray-500'
              }`}>
                {tab}
              </Text>
              {tab === 'Messages' && displayMessages.some(m => m.unread > 0) && (
                <View className="w-2.5 h-2.5 bg-[#818CF8] rounded-full ml-1" />
              )}
            </View>
            {activeTab === tab && (
              <View className="absolute bottom-[-2px] left-0 right-0 h-[4px] bg-[#818CF8] rounded-full" />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#818CF8" />
        </View>
      ) : (
        <ScrollView 
          className="flex-1" 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {activeTab === 'Activity' ? (
            filteredActivity.length === 0 ? (
                <View className="items-center py-20 px-10">
                    <Text className="text-gray-500 text-xl font-bold italic text-center">No matching activity found.</Text>
                </View>
            ) : (
                filteredActivity.map((item) => (
                    <ActivityItem key={item.id} item={item} />
                ))
            )
          ) : (
            filteredMessages.length === 0 ? (
                <View className="items-center py-20 px-10">
                    <Text className="text-gray-500 text-xl font-bold italic text-center">No matching messages found.</Text>
                </View>
            ) : (
                filteredMessages.map((item) => (
                    <MessageItem key={item.id} item={item} />
                ))
            )
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default ActivityScreen;
