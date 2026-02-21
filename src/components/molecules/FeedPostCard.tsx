import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Heart, MessageCircle, Bookmark, Share2, Eye, MoreHorizontal } from 'lucide-react-native';
import { useTheme } from '../../hooks/useTheme';
import { Post } from '../../types';
import { formatNumber, timeAgo } from '../../utils/helpers';
import { Avatar } from '../atoms/Avatar';

const { width: screenWidth } = Dimensions.get('window');

interface FeedPostCardProps {
    post: Post;
    onPress?: () => void;
    onLike?: () => void;
    onComment?: () => void;
    onSave?: () => void;
    onShare?: () => void;
}

export const FeedPostCard = React.memo<FeedPostCardProps>(({
    post,
    onPress,
    onLike,
    onComment,
    onSave,
}) => {
    const { colors, spacing, shadows } = useTheme();

    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor: colors.card, ...shadows.sm }]}
            onPress={onPress}
            activeOpacity={0.9}
        >
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.userSection} activeOpacity={0.7}>
                    <Avatar source={post.user.avatar} size={40} radius={12} />
                    <View style={styles.userInfo}>
                        <View style={styles.nameRow}>
                            <Text style={[styles.name, { color: colors.text }]}>{post.user.displayName}</Text>
                            {post.user.isVerified && <View style={[styles.verifiedBadge, { backgroundColor: colors.primary }]} />}
                        </View>
                        <Text style={[styles.time, { color: colors.textMuted }]}>{timeAgo(post.createdAt)}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity hitSlop={12}>
                    <MoreHorizontal size={20} color={colors.textMuted} />
                </TouchableOpacity>
            </View>

            {/* Main Image */}
            {post.images.length > 0 && (
                <Image
                    source={{ uri: post.images[0] }}
                    style={styles.image}
                    contentFit="cover"
                    transition={500}
                />
            )}

            {/* Content */}
            <View style={styles.content}>
                <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>{post.title}</Text>

                {/* Tags */}
                {post.tags.length > 0 && (
                    <View style={styles.tagRow}>
                        {post.tags.slice(0, 3).map(tag => (
                            <View key={tag} style={[styles.tagChip, { backgroundColor: colors.primary + '15' }]}>
                                <Text style={[styles.tagText, { color: colors.primary }]}>#{tag}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Actions */}
                <View style={styles.actions}>
                    <View style={styles.leftActions}>
                        <TouchableOpacity style={styles.actionBtn} onPress={onLike}>
                            <Heart
                                size={22}
                                color={post.isLiked ? '#FF6B6B' : colors.textMuted}
                                fill={post.isLiked ? '#FF6B6B' : 'none'}
                            />
                            <Text style={[styles.actionText, { color: post.isLiked ? '#FF6B6B' : colors.textMuted }]}>
                                {formatNumber(post.likesCount)}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionBtn} onPress={onComment}>
                            <MessageCircle size={22} color={colors.textMuted} />
                            <Text style={[styles.actionText, { color: colors.textMuted }]}>
                                {formatNumber(post.commentsCount)}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionBtn} onPress={onSave}>
                            <Bookmark
                                size={22}
                                color={post.isSaved ? colors.primary : colors.textMuted}
                                fill={post.isSaved ? colors.primary : 'none'}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.viewsContainer}>
                        <Eye size={16} color={colors.textMuted} />
                        <Text style={[styles.viewsText, { color: colors.textMuted }]}>
                            {formatNumber(post.viewsCount)}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
    },
    userSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    userInfo: {
        justifyContent: 'center',
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    name: {
        fontSize: 15,
        fontWeight: '700',
    },
    verifiedBadge: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    time: {
        fontSize: 12,
        marginTop: 1,
    },
    image: {
        width: '100%',
        aspectRatio: 1.2,
        maxHeight: 600,
        backgroundColor: '#f0f0f0',
    },
    content: {
        padding: 14,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        lineHeight: 22,
        marginBottom: 8,
    },
    tagRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginBottom: 12,
    },
    tagChip: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    tagText: {
        fontSize: 12,
        fontWeight: '600',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    leftActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    actionText: {
        fontSize: 13,
        fontWeight: '600',
    },
    viewsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    viewsText: {
        fontSize: 12,
        fontWeight: '600',
    },
});
