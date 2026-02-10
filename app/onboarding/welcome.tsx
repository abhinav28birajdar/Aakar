// ============================================================
// Welcome Carousel - 3-Slide Onboarding Intro
// ============================================================
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ViewToken,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Palette, Users, Sparkles, TrendingUp } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Showcase Your Work',
    description: 'Build a stunning portfolio and share your creative designs with the world',
    icon: Palette,
    gradient: ['#667eea', '#764ba2'],
  },
  {
    id: '2',
    title: 'Connect with Creators',
    description: 'Join a vibrant community of designers, learners, and creative professionals',
    icon: Users,
    gradient: ['#f97316', '#ef4444'],
  },
  {
    id: '3',
    title: 'Get Inspired & Grow',
    description: 'Discover trending designs, learn new skills, and accelerate your creative journey',
    icon: Sparkles,
    gradient: ['#10b981', '#059669'],
  },
];

interface SlideProps {
  item: typeof SLIDES[0];
}

function Slide({ item }: SlideProps) {
  const Icon = item.icon;

  return (
    <View style={[styles.slide, { width }]}>
      <LinearGradient colors={item.gradient as any} style={styles.iconContainer}>
        <Icon size={64} color="#fff" strokeWidth={1.5} />
      </LinearGradient>

      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );
}

export default function WelcomeCarouselScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index || 0);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.push('/(auth)/sign-up');
    }
  };

  const handleSkip = () => {
    router.push('/(auth)/sign-in');
  };

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        {/* Skip Button */}
        <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        {/* Carousel */}
        <FlatList
          ref={flatListRef}
          data={SLIDES}
          renderItem={({ item }) => <Slide item={item} />}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          bounces={false}
        />

        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex && styles.dotActive,
              ]}
            />
          ))}
        </View>

        {/* Bottom Buttons */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.nextBtn}
            onPress={handleNext}
            activeOpacity={0.9}
          >
            <Text style={styles.nextText}>
              {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signInBtn}
            onPress={handleSkip}
            activeOpacity={0.8}
          >
            <Text style={styles.signInText}>I already have an account</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  skipBtn: {
    alignSelf: 'flex-end',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  skipText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    fontWeight: '600',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 17,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '500',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginVertical: 32,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  dotActive: {
    width: 24,
    backgroundColor: '#fff',
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    gap: 12,
  },
  nextBtn: {
    height: 56,
    backgroundColor: '#fff',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  nextText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#667eea',
  },
  signInBtn: {
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  signInText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
