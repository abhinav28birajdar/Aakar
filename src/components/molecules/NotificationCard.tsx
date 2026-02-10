import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Avatar } from '../atoms/Avatar';
import { Heart, MessageCircle, UserPlus, Star } from 'lucide-react-native';
import { Image } from 'expo-image';

interface NotificationCardProps {
    type: 'like' | 'comment' | 'follow' | 'mention';
    user: {
        name: string;
        avatar: string;
    };
    content?: string;
    timestamp: string;
    postImage?: string;
    onPress?: () => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
    type,
    user,
    content,
    timestamp,
    postImage,
    onPress
}) => {
    const { colors } = useTheme();

    const getIcon = () => {
        switch (type) {
            case 'like': return <Heart size={12} color="white" fill="white" />;
            case 'comment': return <MessageCircle size={12} color="white" fill="white" />;
            case 'follow': return <UserPlus size={12} color="white" />;
            case 'mention': return <Star size={12} color="white" fill="white" />;
        }
    };

    const getIconBg = () => {
        switch (type) {
            case 'like': return colors.error;
            case 'comment': return colors.primary;
            case 'follow': return colors.success;
            case 'mention': return colors.accent;
        }
    };

    return (
        <TouchableOpacity onPress={onPress} style={[styles.container, { borderBottomColor: colors.border }]}>
            <View style={styles.avatarWrapper}>
                <Avatar source={user.avatar} size={48} radius={16} />
                <View style={[styles.iconBadge, { backgroundColor: getIconBg() }]}>
                    {getIcon()}
                </View>
            </View>

            <View style={styles.content}>
                <Text numberOfLines={2} style={[styles.text, { color: colors.text }]}>
                    <Text style={{ fontWeight: '700' }}>{user.name}</Text>
                    {type === 'like' && ' liked your post.'}
                    {type === 'comment' && ` commented: "${content}"`}
                    {type === 'follow' && ' started following you.'}
                    {type === 'mention' && ' mentioned you in a post.'}
                </Text>
                <Text style={[styles.time, { color: colors.textSecondary }]}>{timestamp}</Text>
            </View>

            {postImage && (
                <Image source={{ uri: postImage }} style={styles.postThumb} />
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    avatarWrapper: {
        position: 'relative',
    },
    iconBadge: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white',
    },
    content: {
        flex: 1,
        marginLeft: 16,
        gap: 2,
    },
    text: {
        fontSize: 14,
        lineHeight: 20,
    },
    time: {
        fontSize: 12,
    },
    postThumb: {
        width: 48,
        height: 48,
        borderRadius: 10,
        marginLeft: 12,
    },
});
