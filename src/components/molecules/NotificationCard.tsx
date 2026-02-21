import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Avatar } from '../atoms/Avatar';
import { Heart, MessageCircle, UserPlus, Star, Share2, Award, TrendingUp, Briefcase, Bell } from 'lucide-react-native';
import { Image } from 'expo-image';
import { NotificationType } from '../../types';

interface NotificationCardProps {
    type: NotificationType;
    user?: {
        name: string;
        avatar: string;
    };
    title?: string;
    content?: string;
    timestamp: string;
    postImage?: string;
    isRead?: boolean;
    onPress?: () => void;
}

export const NotificationCard = React.memo<NotificationCardProps>(({
    type,
    user,
    title,
    content,
    timestamp,
    postImage,
    isRead = true,
    onPress
}) => {
    const { colors } = useTheme();

    const getIconInfo = () => {
        switch (type) {
            case 'like': return { icon: Heart, color: colors.error, label: 'liked your post.' };
            case 'comment': return { icon: MessageCircle, color: colors.primary, label: 'commented on your post.' };
            case 'follow': return { icon: UserPlus, color: colors.success, label: 'started following you.' };
            case 'mention': return { icon: AtSign, color: colors.accent, label: 'mentioned you.' };
            case 'share': return { icon: Share2, color: '#06B6D4', label: 'shared your post.' };
            case 'milestone': return { icon: Award, color: '#F97316', label: '' };
            case 'trending': return { icon: TrendingUp, color: '#10B981', label: '' };
            case 'gig_inquiry': return { icon: Briefcase, color: '#059669', label: 'sent a gig inquiry.' };
            default: return { icon: Bell, color: colors.textSecondary, label: '' };
        }
    };

    const info = getIconInfo();
    const Icon = info.icon;

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.container,
                {
                    borderBottomColor: colors.border,
                    backgroundColor: isRead ? 'transparent' : colors.primary + '08'
                }
            ]}
        >
            <View style={styles.avatarWrapper}>
                {user ? (
                    <Avatar source={user.avatar} size={48} radius={16} />
                ) : (
                    <View style={[styles.placeholderAvatar, { backgroundColor: colors.surface, borderRadius: 16 }]}>
                        <Icon size={24} color={info.color} />
                    </View>
                )}
                <View style={[styles.iconBadge, { backgroundColor: info.color }]}>
                    <Icon size={10} color="white" fill={type === 'like' || type === 'comment' ? 'white' : 'none'} />
                </View>
            </View>

            <View style={styles.contentContainer}>
                <Text numberOfLines={3} style={[styles.text, { color: colors.text }]}>
                    {user ? (
                        <>
                            <Text style={{ fontWeight: '700' }}>{user.name}</Text>
                            <Text> {content || info.label}</Text>
                        </>
                    ) : (
                        <Text style={{ fontWeight: '700' }}>{title}</Text>
                    )}
                </Text>
                {!user && content && (
                    <Text numberOfLines={2} style={[styles.bodyText, { color: colors.textSecondary }]}>
                        {content}
                    </Text>
                )}
                <Text style={[styles.time, { color: colors.textMuted }]}>{timestamp}</Text>
            </View>

            {postImage && (
                <Image source={{ uri: postImage }} style={styles.postThumb} contentFit="cover" />
            )}
            {!isRead && <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />}
        </TouchableOpacity>
    );
});

// Placeholder for AtSign if not imported (Lucide fix)
const AtSign = (props: any) => <Text style={{ color: props.color, fontSize: props.size }}>@</Text>;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 0.5,
    },
    avatarWrapper: {
        position: 'relative',
    },
    placeholderAvatar: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconBadge: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        width: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white',
    },
    contentContainer: {
        flex: 1,
        marginLeft: 14,
        gap: 2,
    },
    text: {
        fontSize: 14,
        lineHeight: 20,
    },
    bodyText: {
        fontSize: 13,
        lineHeight: 18,
    },
    time: {
        fontSize: 11,
        marginTop: 2,
    },
    postThumb: {
        width: 44,
        height: 44,
        borderRadius: 8,
        marginLeft: 12,
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginLeft: 8,
    },
});
