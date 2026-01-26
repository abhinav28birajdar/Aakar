import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { ArrowLeft, MoreVertical, Heart, MessageCircle, UserPlus, Filter } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { MOCK_NOTIFICATIONS } from '../constants/mockData';

export default function NotificationsScreen() {
    const { colors } = useTheme();
    const router = useRouter();

    const renderIcon = (type: string) => {
        switch (type) {
            case 'like':
                return <Heart size={14} color="white" fill="white" />;
            case 'comment':
                return <MessageCircle size={14} color="white" fill="white" />;
            case 'follow':
                return <UserPlus size={14} color="white" />;
            default:
                return null;
        }
    };

    const getIconColor = (type: string) => {
        switch (type) {
            case 'like': return colors.error;
            case 'comment': return colors.primary; // Replaced info with primary
            case 'follow': return colors.success;
            default: return colors.primary;
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                    <ArrowLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>Notifications</Text>
                <TouchableOpacity style={styles.iconButton}>
                    <Filter size={20} color={colors.text} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={[...MOCK_NOTIFICATIONS, ...MOCK_NOTIFICATIONS]} // Duplicate for scrolling
                keyExtractor={(item, index) => `${item.id}-${index}`}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <TouchableOpacity style={[styles.item, { borderBottomColor: colors.border }]}>
                        <View style={styles.avatarContainer}>
                            <Image source={{ uri: item.user.avatar_url }} style={styles.avatar} />
                            <View style={[styles.badge, { backgroundColor: getIconColor(item.type) }]}>
                                {renderIcon(item.type)}
                            </View>
                        </View>

                        <View style={styles.content}>
                            <Text numberOfLines={2} style={[styles.text, { color: colors.text }]}>
                                <Text style={{ fontWeight: '700' }}>{item.user.username}</Text>
                                {item.type === 'like' && ' liked your post.'}
                                {item.type === 'comment' && ` commented on your post: "${item.content}"`}
                                {item.type === 'follow' && ' started following you.'}
                            </Text>
                            <Text style={[styles.time, { color: colors.textSecondary }]}>{item.timestamp}</Text>
                        </View>

                        {item.post && (
                            <Image source={{ uri: item.post.image_url }} style={styles.postPreview} />
                        )}
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    iconButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
    },
    list: {
        paddingHorizontal: 16,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 12,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 20,
    },
    badge: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        width: 22,
        height: 22,
        borderRadius: 11,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white',
    },
    content: {
        flex: 1,
    },
    text: {
        fontSize: 14,
        lineHeight: 20,
    },
    time: {
        fontSize: 12,
        marginTop: 4,
    },
    postPreview: {
        width: 44,
        height: 44,
        borderRadius: 8,
        marginLeft: 12,
    },
});
