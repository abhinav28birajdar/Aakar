import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/hooks/useTheme';
import { Button } from '../../src/components/atoms/Button';
import { MotiView, AnimatePresence } from 'moti';
import { ChevronRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const SLIDES = [
    {
        id: 1,
        title: 'Discover amazing designs',
        description: 'Explore thousands of projects from top digital designers across the globe.',
        icon: '✨',
    },
    {
        id: 2,
        title: 'Share your creative work',
        description: 'Showcase your best work to get feedback and grow your professional presence.',
        icon: '🚀',
    },
    {
        id: 3,
        title: 'Connect with designers',
        description: 'Build relationships with other creatives and find your next collaboration.',
        icon: '🤝',
    },
];

export default function OnboardingScreen() {
    const router = useRouter();
    const { colors, typography, spacing } = useTheme();
    const [currentSlide, setCurrentSlide] = useState(0);

    const handleNext = () => {
        if (currentSlide < SLIDES.length - 1) {
            setCurrentSlide(currentSlide + 1);
        } else {
            router.push('/(auth)/sign-up');
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push('/(auth)/sign-in')}>
                    <Text style={[styles.skip, { color: colors.textSecondary }]}>Skip</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <AnimatePresence exitBeforeEnter>
                    <MotiView
                        key={`slide-${currentSlide}`}
                        from={{ opacity: 0, scale: 0.9, translateX: 50 }}
                        animate={{ opacity: 1, scale: 1, translateX: 0 }}
                        exit={{ opacity: 0, scale: 0.9, translateX: -50 }}
                        transition={{ type: 'timing', duration: 400 }}
                        style={styles.slide}
                    >
                        <Text style={styles.icon}>{SLIDES[currentSlide].icon}</Text>
                        <Text style={[styles.title, { color: colors.text }]}>{SLIDES[currentSlide].title}</Text>
                        <Text style={[styles.description, { color: colors.textSecondary }]}>
                            {SLIDES[currentSlide].description}
                        </Text>
                    </MotiView>
                </AnimatePresence>
            </View>

            <View style={styles.footer}>
                <View style={styles.pagination}>
                    {SLIDES.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                {
                                    backgroundColor: currentSlide === index ? colors.primary : colors.border,
                                    width: currentSlide === index ? 24 : 8,
                                },
                            ]}
                        />
                    ))}
                </View>

                <Button
                    title={currentSlide === SLIDES.length - 1 ? 'Get Started' : 'Next'}
                    onPress={handleNext}
                    icon={currentSlide < SLIDES.length - 1 ? <ChevronRight size={20} color={colors.white} /> : undefined}
                    style={styles.button}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingHorizontal: 24,
    },
    skip: {
        fontSize: 16,
        fontWeight: '600',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    slide: {
        alignItems: 'center',
    },
    icon: {
        fontSize: 80,
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
    },
    footer: {
        padding: 24,
        paddingBottom: 40,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 32,
        gap: 8,
    },
    dot: {
        height: 8,
        borderRadius: 4,
    },
    button: {
        width: '100%',
    },
});
