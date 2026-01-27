import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/hooks/useTheme';
import { Button } from '../../components/ui/Button';
import { MotiView, AnimatePresence } from 'moti';
import { ChevronRight, Layout, Share2, Users } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const FEATURES = [
    {
        title: 'Curated Inspiration',
        desc: 'Access thousands of high-quality designs from world-class creators.',
        icon: Layout,
        color: '#667eea',
    },
    {
        title: 'Share Your Work',
        desc: 'Showcase your portfolio and get feedback from the global community.',
        icon: Share2,
        color: '#FF6B6B',
    },
    {
        title: 'Connect & Collab',
        desc: 'Build your network and find opportunities to work with top designers.',
        icon: Users,
        color: '#4CAF50',
    },
];

export default function FeaturesScreen() {
    const { colors } = useTheme();
    const router = useRouter();
    const [index, setIndex] = useState(0);

    const handleNext = () => {
        if (index < FEATURES.length - 1) {
            setIndex(index + 1);
        } else {
            router.push('/onboarding/permissions');
        }
    };

    const Feature = FEATURES[index];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                    <Text style={[styles.skip, { color: colors.textSecondary }]}>Skip</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <AnimatePresence exitBeforeEnter>
                    <MotiView
                        key={index}
                        from={{ opacity: 0, translateX: 50 }}
                        animate={{ opacity: 1, translateX: 0 }}
                        exit={{ opacity: 0, translateX: -50 }}
                        transition={{ type: 'timing', duration: 400 }}
                        style={styles.slide}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: Feature.color + '15' }]}>
                            <Feature.icon size={60} color={Feature.color} />
                        </View>
                        <Text style={[styles.title, { color: colors.text }]}>{Feature.title}</Text>
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{Feature.desc}</Text>
                    </MotiView>
                </AnimatePresence>

                <View style={styles.pagination}>
                    {FEATURES.map((_, i) => (
                        <View
                            key={i}
                            style={[
                                styles.dot,
                                { backgroundColor: i === index ? colors.primary : colors.border, width: i === index ? 24 : 8 }
                            ]}
                        />
                    ))}
                </View>
            </View>

            <View style={styles.footer}>
                <Button
                    title={index === FEATURES.length - 1 ? "Finish" : "Next"}
                    onPress={handleNext}
                    icon={<ChevronRight size={20} color="white" />}
                    style={styles.btn}
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
        alignItems: 'flex-end',
        padding: 24,
    },
    skip: {
        fontSize: 16,
        fontWeight: '700',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    slide: {
        alignItems: 'center',
    },
    iconContainer: {
        width: 140,
        height: 140,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        textAlign: 'center',
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginTop: 60,
    },
    dot: {
        height: 8,
        borderRadius: 4,
    },
    footer: {
        padding: 40,
    },
    btn: {
        width: '100%',
    },
});
