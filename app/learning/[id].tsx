// ============================================================
// Tutorial Detail Screen - learning/[id].tsx
// ============================================================
import React from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Play, Bookmark, Share2, Star, Clock, List } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/hooks/useTheme';
import { MOCK_TUTORIALS } from '../../src/data/mockData';
import { Button } from '../../src/components/atoms';

export default function TutorialDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { colors } = useTheme();

    const tutorial = MOCK_TUTORIALS.find(t => t.id === id) || MOCK_TUTORIALS[0];

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
            {/* Video Placeholder */}
            <View style={styles.videoPlaceholder}>
                <Image source={{ uri: tutorial.coverImage }} style={styles.videoThumb} />
                <View style={styles.videoOverlay}>
                    <TouchableOpacity style={styles.playBtn}>
                        <Play size={32} color="#fff" fill="#fff" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                <View style={styles.content}>
                    <View style={styles.categoryRow}>
                        <Text style={[styles.category, { color: colors.primary }]}>{tutorial.category}</Text>
                        <View style={styles.rating}>
                            <Star size={14} color="#FBBF24" fill="#FBBF24" />
                            <Text style={[styles.ratingText, { color: colors.text }]}>4.9 (1.2k views)</Text>
                        </View>
                    </View>

                    <Text style={[styles.title, { color: colors.text }]}>{tutorial.title}</Text>

                    <View style={styles.metaRow}>
                        <View style={styles.metaItem}>
                            <Clock size={16} color={colors.textMuted} />
                            <Text style={[styles.metaText, { color: colors.textMuted }]}>{tutorial.duration} minutes</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Star size={16} color={colors.textMuted} />
                            <Text style={[styles.metaText, { color: colors.textMuted }]}>{tutorial.difficulty}</Text>
                        </View>
                    </View>

                    {/* Creator Info */}
                    <TouchableOpacity style={[styles.creatorCard, { backgroundColor: colors.surface }]}>
                        <Image source={{ uri: tutorial.creator.avatar }} style={styles.creatorAvatar} />
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.creatorName, { color: colors.text }]}>{tutorial.creator.displayName}</Text>
                            <Text style={[styles.creatorRole, { color: colors.textMuted }]}>Senior Product Designer</Text>
                        </View>
                        <Button title="Follow" onPress={() => { }} variant="outline" size="sm" />
                    </TouchableOpacity>

                    <Text style={[styles.sectionTitle, { color: colors.text }]}>About this tutorial</Text>
                    <Text style={[styles.description, { color: colors.textSecondary }]}>
                        {tutorial.description}
                        \n\nIn this session, we'll dive deep into the fundamentals of {tutorial.category.toLowerCase()} and how to create professional-grade designs that stand out in the Aakar community.
                    </Text>

                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Curriculum</Text>
                    {[
                        'Introduction & Setup',
                        'Core Concepts & Tools',
                        'Advanced Techniques',
                        'Real-world Project Implementation',
                        'Exporting & Best Practices'
                    ].map((lesson, i) => (
                        <TouchableOpacity key={i} style={[styles.lessonRow, { borderBottomColor: colors.border }]}>
                            <View style={[styles.lessonNum, { backgroundColor: colors.surface }]}>
                                <Text style={[styles.lessonNumText, { color: colors.textSecondary }]}>{i + 1}</Text>
                            </View>
                            <Text style={[styles.lessonTitle, { color: colors.text }]}>{lesson}</Text>
                            <Play size={16} color={colors.textMuted} />
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            {/* Bottom Actions */}
            <View style={[styles.bottomBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.surfaceAlt }]}>
                    <Bookmark size={24} color={colors.text} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.surfaceAlt }]}>
                    <Share2 size={24} color={colors.text} />
                </TouchableOpacity>
                <Button
                    title={tutorial.isFree ? "Start Learning" : "Unlock with Premium"}
                    onPress={() => { }}
                    style={{ flex: 1 }}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1 },
    videoPlaceholder: { width: '100%', height: 250, backgroundColor: '#000' },
    videoThumb: { width: '100%', height: '100%', opacity: 0.7 },
    videoOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
    playBtn: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },
    backBtn: { position: 'absolute', top: 20, left: 20, width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
    content: { padding: 20 },
    categoryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    category: { fontSize: 14, fontWeight: '800', letterSpacing: 0.5 },
    rating: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    ratingText: { fontSize: 13, fontWeight: '600' },
    title: { fontSize: 24, fontWeight: '900', marginBottom: 16, lineHeight: 32 },
    metaRow: { flexDirection: 'row', gap: 20, marginBottom: 24 },
    metaItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    metaText: { fontSize: 14, fontWeight: '600' },
    creatorCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 18, marginBottom: 32 },
    creatorAvatar: { width: 44, height: 44, borderRadius: 22 },
    creatorName: { fontSize: 15, fontWeight: '700' },
    creatorRole: { fontSize: 12 },
    sectionTitle: { fontSize: 18, fontWeight: '800', marginBottom: 12, marginTop: 8 },
    description: { fontSize: 15, lineHeight: 24, marginBottom: 24 },
    lessonRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, gap: 16 },
    lessonNum: { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
    lessonNumText: { fontSize: 14, fontWeight: '800' },
    lessonTitle: { flex: 1, fontSize: 15, fontWeight: '600' },
    bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, flexDirection: 'row', gap: 12, borderTopWidth: 1 },
    actionBtn: { width: 56, height: 56, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
});
