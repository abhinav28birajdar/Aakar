import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    Dimensions,
    Share,
    Platform
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useTheme } from '../../contexts/ThemeContext';
import { MOCK_POSTS } from '../../constants/mockData';
import { TYPOGRAPHY, SIZES } from '../../constants/theme';
import {
    ArrowLeft,
    Heart,
    MessageCircle,
    Share2,
    Bookmark,
    MoreHorizontal,
    ExternalLink
} from 'lucide-react-native';
import { Button } from '../../components/Button';
import { MotiView } from 'moti';

const { width } = Dimensions.get('window');

export default function PostDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { colors } = useTheme();

    const post = MOCK_POSTS.find(p => p.id === id) || MOCK_POSTS[0];
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out this amazing design: ${post.title}`,
                url: post.image_url,
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                {/* Header Image */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: post.image_url }}
                        style={styles.image}
                        contentFit="cover"
                        transition={500}
                    />
                    <SafeAreaView style={styles.headerActions}>
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={[styles.backButton, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
                        >
                            <ArrowLeft color="white" size={24} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.backButton, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
                        >
                            <MoreHorizontal color="white" size={24} />
                        </TouchableOpacity>
                    </SafeAreaView>
                </View>

                {/* Content */}
                <View style={[styles.content, { padding: SIZES.md, backgroundColor: colors.background }]}>
                    <View style={styles.titleRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={[TYPOGRAPHY.h2, { color: colors.text }]}>{post.title}</Text>
                            <Text style={[TYPOGRAPHY.body, { color: colors.textSecondary, marginTop: SIZES.xs }]}>
                                {post.category || 'Design'} • {post.views} views
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => setIsSaved(!isSaved)}
                            style={[styles.actionIcon, { backgroundColor: isSaved ? colors.primary : colors.surfaceAlt }]}
                        >
                            <Bookmark size={24} color={isSaved ? colors.white : colors.text} fill={isSaved ? colors.white : 'transparent'} />
                        </TouchableOpacity>
                    </View>

                    {/* Designer info */}
                    <TouchableOpacity
                        onPress={() => router.push(`/profile/${post.creator.username}`)}
                        style={[styles.designerCard, { backgroundColor: colors.surfaceAlt, marginTop: SIZES.lg }]}
                    >
                        <Image
                            source={{ uri: post.creator.avatar_url }}
                            style={styles.designerAvatar}
                        />
                        <View style={{ flex: 1, marginLeft: SIZES.md }}>
                            <Text style={[TYPOGRAPHY.bodyMedium, { color: colors.text }]}>{post.creator.full_name}</Text>
                            <Text style={[TYPOGRAPHY.small, { color: colors.textSecondary }]}>@{post.creator.username}</Text>
                        </View>
                        <Button
                            title="Follow"
                            variant="primary"
                            size="sm"
                            onPress={() => { }}
                            style={{ paddingHorizontal: 16 }}
                        />
                    </TouchableOpacity>

                    <Text style={[TYPOGRAPHY.body, { color: colors.text, marginTop: SIZES.xl, lineHeight: 28 }]}>
                        {post.description}. This work focuses on creating a seamless user experience while maintaining aesthetic excellence.
                    </Text>

                    {/* Tags */}
                    <View style={[styles.tagContainer, { marginTop: SIZES.xl }]}>
                        {['UI', 'Minimal', 'App', 'Clean'].map((tag) => (
                            <View key={tag} style={[styles.tag, { backgroundColor: colors.surfaceAlt }]}>
                                <Text style={[TYPOGRAPHY.small, { color: colors.textSecondary }]}>#{tag}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Similar designs */}
                    <View style={{ marginTop: SIZES.xxl }}>
                        <Text style={[TYPOGRAPHY.h3, { color: colors.text, marginBottom: SIZES.lg }]}>More like this</Text>
                        <View style={styles.grid}>
                            {MOCK_POSTS.filter(p => p.id !== post.id).slice(0, 2).map((p) => (
                                <TouchableOpacity key={p.id} style={styles.gridItem}>
                                    <Image source={{ uri: p.image_url }} style={styles.gridImage} />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Engagement Bar */}
            <View style={[styles.bottomBar, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
                <TouchableOpacity
                    onPress={() => setIsLiked(!isLiked)}
                    style={styles.engagementItem}
                >
                    <Heart size={24} color={isLiked ? colors.error : colors.text} fill={isLiked ? colors.error : 'transparent'} />
                    <Text style={[styles.engagementText, { color: colors.text }]}>{post.likes + (isLiked ? 1 : 0)}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.engagementItem}>
                    <MessageCircle size={24} color={colors.text} />
                    <Text style={[styles.engagementText, { color: colors.text }]}>{post.comments_count}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleShare} style={styles.engagementItem}>
                    <Share2 size={24} color={colors.text} />
                </TouchableOpacity>

                <Button
                    title="Hire Designer"
                    onPress={() => { }}
                    style={styles.hireButton}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imageContainer: {
        position: 'relative',
        width: width,
        height: width * 1.2,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    headerActions: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? 40 : 10,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -30,
        backgroundColor: 'white', // Will be dynamic if I want, but for now standard
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    actionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    designerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 16,
    },
    designerAvatar: {
        width: 48,
        height: 48,
        borderRadius: 14,
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    grid: {
        flexDirection: 'row',
        gap: 16,
    },
    gridItem: {
        flex: 1,
        height: 120,
        borderRadius: 12,
        overflow: 'hidden',
    },
    gridImage: {
        width: '100%',
        height: '100%',
    },
    bottomBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: Platform.OS === 'ios' ? 34 : 16,
        borderTopWidth: 1,
    },
    engagementItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 24,
    },
    engagementText: {
        marginLeft: 6,
        fontWeight: '600',
    },
    hireButton: {
        flex: 1,
        height: 50,
    },
});
