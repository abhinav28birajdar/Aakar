import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { ArrowRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Welcome to Aakar',
    description: 'A minimal, modern ed-tech platform for your learning journey.',
    color: '#E6F4FE',
  },
  {
    id: '2',
    title: 'Clean & Simple',
    description: 'Focus on what matters most with our distraction-free interface.',
    color: '#CCE9FD',
  },
  {
    id: '3',
    title: 'Ready to Start?',
    description: 'Join thousands of learners today and elevate your skills.',
    color: '#0091F5',
  },
];

const OnboardingScreen = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigation = useNavigation<any>();

  const handleNext = async () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      await AsyncStorage.setItem('hasBoarded', 'true');
      navigation.navigate('Login');
    }
  };

  const slide = slides[currentSlide];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center px-10">
        <View 
          className="w-64 h-64 rounded-full mb-10 items-center justify-center"
          style={{ backgroundColor: slide.color }}
        >
          {/* Placeholder for illustration */}
          <Text className="text-4xl">📚</Text>
        </View>
        <Text className="text-3xl font-bold text-center text-gray-900 mb-4">{slide.title}</Text>
        <Text className="text-lg text-center text-gray-500 mb-10">{slide.description}</Text>
        
        {/* Pagination Dots */}
        <View className="flex-row mb-12">
          {slides.map((_, index) => (
            <View 
              key={index}
              className={`h-2 rounded-full mx-1 ${index === currentSlide ? 'w-6 bg-blue-500' : 'w-2 bg-blue-200'}`}
            />
          ))}
        </View>

        <TouchableOpacity 
          onPress={handleNext}
          className="bg-blue-600 px-8 py-4 rounded-2xl flex-row items-center justify-center w-full shadow-lg"
        >
          <Text className="text-white text-lg font-semibold mr-2">
            {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <ArrowRight color="white" size={20} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;
