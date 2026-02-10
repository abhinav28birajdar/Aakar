// ============================================================
// Features Carousel
// ============================================================
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Palette, TrendingUp, Briefcase, ArrowRight } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/hooks/useTheme';

const { width } = Dimensions.get('window');

const slides = [
  { id: '1', icon: Palette, title: 'Showcase & Portfolio', desc: 'Create a beautiful portfolio to showcase your best work. Get noticed by top companies and clients worldwide.', color: '#667eea' },
  { id: '2', icon: TrendingUp, title: 'Learn & Grow', desc: 'Access tutorials, challenges, and mentorship from industry experts. Level up your design skills every day.', color: '#764ba2' },
  { id: '3', icon: Briefcase, title: 'Work & Earn', desc: 'Find freelance gigs, collaborate with teams, and build your design career. Your next opportunity is here.', color: '#f97316' },
];

export default function FeaturesScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (activeIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1 });
    } else {
      router.push('/(auth)/sign-up');
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.skipRow}>
        <TouchableOpacity onPress={() => router.push('/(auth)/sign-up')}>
          <Text style={[styles.skipText, { color: colors.textMuted }]}>Skip</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={e => setActiveIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <LinearGradient colors={[item.color, item.color + '80']} style={styles.iconCircle}>
              <item.icon size={48} color="#fff" />
            </LinearGradient>
            <Text style={[styles.slideTitle, { color: colors.text }]}>{item.title}</Text>
            <Text style={[styles.slideDesc, { color: colors.textSecondary }]}>{item.desc}</Text>
          </View>
        )}
      />

      {/* Dots */}
      <View style={styles.dotsRow}>
        {slides.map((_, i) => (
          <View key={i} style={[styles.dot, { backgroundColor: i === activeIndex ? colors.primary : colors.border, width: i === activeIndex ? 24 : 8 }]} />
        ))}
      </View>

      {/* Next Button */}
      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={handleNext} activeOpacity={0.8}>
          <LinearGradient colors={['#667eea', '#764ba2']} style={styles.nextBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Text style={styles.nextBtnText}>{activeIndex === slides.length - 1 ? 'Get Started' : 'Next'}</Text>
            <ArrowRight size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  skipRow: { alignItems: 'flex-end', paddingHorizontal: 24, paddingTop: 8 },
  skipText: { fontSize: 16, fontWeight: '600' },
  slide: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  iconCircle: { width: 110, height: 110, borderRadius: 55, justifyContent: 'center', alignItems: 'center', marginBottom: 32 },
  slideTitle: { fontSize: 28, fontWeight: '800', textAlign: 'center', marginBottom: 12 },
  slideDesc: { fontSize: 16, textAlign: 'center', lineHeight: 24 },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 24 },
  dot: { height: 8, borderRadius: 4 },
  buttonRow: { paddingHorizontal: 24, paddingBottom: 20 },
  nextBtn: { height: 56, borderRadius: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  nextBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
