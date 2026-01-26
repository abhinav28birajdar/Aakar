import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Platform
} from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from '../hooks/useTheme';
import { Heart, Eye, MessageCircle } from 'lucide-react-native';
import { Link } from 'expo-router';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2;

interface DesignCardProps {
    post: {
        id: string;
        title: string;
        image_url: string;
        likes: number;
        views: number;
        comments_count: number;
        creator: {
            username: string;
            avatar_url: string;
        };
    };
    onPress?: () => void;
}

export const DesignCard: React.FC<DesignCardProps> = ({ post, onPress }) => {
    const { colors, spacing, borderRadius, typography, shadows } = useTheme();

    return (
        <TouchableOpacity
            style={[
                styles.container,
                {
                    backgroundColor: colors.surface,
                    borderRadius: 20,
                    ...shadows.sm
                }
            ]}
            onPress={onPress}
            activeOpacity={0.9}
        >
            <Image
                source={{ uri: post.image_url }}
                style={[styles.image, { borderTopLeftRadius: 20, borderTopRightRadius: 20 }]}
                contentFit="cover"
                transition={1000}
            />

            <View style={[styles.content, { padding: spacing.md }]}>
                <Text numberOfLines={1} style={[typography.bodyMedium, { color: colors.text, marginBottom: spacing.xs }]}>
                    {post.title}
                </Text>

                <View style={styles.footer}>
                    <View style={styles.creatorInfo}>
                        <Image
                            source={{ uri: post.creator.avatar_url }}
                            style={[styles.avatar, { borderRadius: 10 }]}
                        />
                        <Text numberOfLines={1} style={[typography.small, { color: colors.textSecondary, marginLeft: spacing.xs, flex: 1 }]}>
                            {post.creator.username}
                        </Text>
                    </View>

                    <View style={styles.stats}>
                        <View style={styles.statItem}>
                            <Heart size={12} color={colors.textSecondary} />
                            <Text style={[styles.statText, { color: colors.textSecondary }]}>{post.likes}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        width: '100%',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 10,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    image: {
        width: '100%',
        height: 200,
    },
    content: {
        width: '100%',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    creatorInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        width: 20,
        height: 20,
    },
    stats: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8,
    },
    statText: {
        fontSize: 10,
        marginLeft: 2,
        fontWeight: '600',
    },
});
