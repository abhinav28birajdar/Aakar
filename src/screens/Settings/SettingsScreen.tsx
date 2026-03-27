import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Bell, Moon, Lock, Info, ChevronRight, Globe, HelpCircle } from 'lucide-react-native';

const SettingsScreen = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 py-4 border-b border-gray-50">
        <Text className="text-2xl font-bold text-gray-900">Settings</Text>
      </View>

      <ScrollView className="px-6 py-6 pb-20">
        <View className="mb-8">
          <Text className="text-lg font-bold text-gray-900 mb-4 px-1">Notifications</Text>
          <View className="bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-4">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <Bell color="#4b5563" size={20} className="mr-3" />
                <Text className="text-gray-800 font-medium text-base ml-2">Push Notifications</Text>
              </View>
              <Switch 
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#e5e7eb', true: '#3b82f6' }}
                thumbColor="#ffffff"
              />
            </View>
            <View className="h-[1px] bg-gray-200 mb-4" />
            <TouchableOpacity className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Globe color="#4b5563" size={20} className="mr-3" />
                <Text className="text-gray-800 font-medium text-base ml-2">Language</Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-gray-500 mr-2">English</Text>
                <ChevronRight color="#9ca3af" size={20} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-lg font-bold text-gray-900 mb-4 px-1">App Preference</Text>
          <View className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Moon color="#4b5563" size={20} className="mr-3" />
                <Text className="text-gray-800 font-medium text-base ml-2">Dark Mode</Text>
              </View>
              <Switch 
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#e5e7eb', true: '#3b82f6' }}
                thumbColor="#ffffff"
              />
            </View>
          </View>
        </View>

        <View className="mb-10">
          <Text className="text-lg font-bold text-gray-900 mb-4 px-1">Support & About</Text>
          <View className="bg-gray-50 rounded-2xl px-4 py-2 border border-gray-100">
            <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-100">
              <View className="flex-row items-center">
                <HelpCircle color="#4b5563" size={20} className="mr-3" />
                <Text className="text-gray-800 font-medium text-base ml-2">Help Center</Text>
              </View>
              <ChevronRight color="#9ca3af" size={20} />
            </TouchableOpacity>
            
            <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-100">
              <View className="flex-row items-center">
                <Lock color="#4b5563" size={20} className="mr-3" />
                <Text className="text-gray-800 font-medium text-base ml-2">Privacy Policy</Text>
              </View>
              <ChevronRight color="#9ca3af" size={20} />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-between py-4">
              <View className="flex-row items-center">
                <Info color="#4b5563" size={20} className="mr-3" />
                <Text className="text-gray-800 font-medium text-base ml-2">About Aakar</Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-gray-500 mr-2">v1.2.0</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <Text className="text-center text-gray-400 text-sm italic">Designed with ❤️ for learners</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
