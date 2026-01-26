import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { MOCK_NOTIFICATIONS, MOCK_MESSAGES } from '../../constants/mockData';
import { TYPOGRAPHY } from '../../constants/theme';
import { Image } from 'expo-image';
import { MessageSquare, Heart, UserPlus, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function ActivityScreen() {
    const { colors } = useTheme();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'activity' | 'messages'>('activity');

    const getIcon = (type: string) => {
        switch (type) {
            case 'like':
                return <Heart size={14} color="white" fill="white" />;
            case 'comment':
                return <MessageSquare size={14} color="white" fill="white" />;
            case 'follow':
                return <UserPlus size={14} color="white" />;
            default:
                return null;
        }
    };

    const getIconBg = (type: string) => {
        switch (type) {
            case 'like':
                return '#f43f5e';
            case 'comment':
                return '#3b82f6';
            case 'follow':
                return '#10b981';
            default:
                return colors.primary;
        }
    };

    const renderActivityItem = ({ item }: { item: any }) => (
        <TouchableOpacity style={[styles.notificationItem, { borderBottomColor: colors.border }]}>
            <View style={styles.avatarContainer}>
                <Image source={{ uri: item.user.avatar_url }} style={styles.avatar} />
                <View style={[styles.typeIcon, { backgroundColor: getIconBg(item.type) }]}>
                    {getIcon(item.type)}
                </View>
            </View>

            <View style={styles.content}>
                <Text style={[styles.text, { color: colors.text }]}>
                    <Text style={{ fontWeight: '700' }}>{item.user.username}</Text>
                    {item.type === 'like' && ' liked your post'}
                    {item.type === 'comment' && ` commented: "${item.content}"`}
                    {item.type === 'follow' && ' started following you'}
                    {item.type === 'mention' && ` mentioned you: "${item.content}"`}
                </Text>
                <Text style={[styles.time, { color: colors.textSecondary }]}>{item.timestamp}</Text>
            </View>

            {item.post && (
                <Image source={{ uri: item.post.image_url }} style={styles.postPreview} />
            )}
        </TouchableOpacity>
    );

    const renderMessageItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={[styles.notificationItem, { borderBottomColor: colors.border }]}
            onPress={() => router.push(`/messages/${item.id}`)}
        >
            <Image source={{ uri: item.sender.avatar_url }} style={styles.avatar} />
            <View style={styles.content}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={[styles.messageSender, { color: colors.text }]}>{item.sender.full_name}</Text>
                    <Text style={[styles.time, { color: colors.textSecondary }]}>{item.timestamp}</Text>
                </View>
                <Text style={[styles.messagePreview, { color: item.unreadCount > 0 ? colors.text : colors.textSecondary, fontWeight: item.unreadCount > 0 ? '700' : '400' }]} numberOfLines={1}>
                    {item.unreadCount > 0 ? '● ' : ''}{item.lastMessage}
                </Text>
            </View>
            <ChevronRight size={16} color={colors.textSecondary} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <Text style={[TYPOGRAPHY.h1, { color: colors.text }]}>Inbox</Text>
                {activeTab === 'activity' && (
                    <TouchableOpacity>
                        <Text style={{ color: colors.primary, fontWeight: '600' }}>Mark all read</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'activity' && { borderBottomColor: colors.primary }]}
                    onPress={() => setActiveTab('activity')}
                >
                    <Text style={[styles.tabText, { color: activeTab === 'activity' ? colors.primary : colors.textSecondary }]}>Activity</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'messages' && { borderBottomColor: colors.primary }]}
                    onPress={() => setActiveTab('messages')}
                >
                    <Text style={[styles.tabText, { color: activeTab === 'messages' ? colors.primary : colors.textSecondary }]}>Messages</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={activeTab === 'activity' ? MOCK_NOTIFICATIONS : MOCK_MESSAGES}
                keyExtractor={(item) => item.id}
                renderItem={activeTab === 'activity' ? renderActivityItem : renderMessageItem}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={{ color: colors.textSecondary }}>No items yet</Text>
                    </View>
                }
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
        padding: 24,
    },
    list: {
        paddingHorizontal: 24,
    },
    notificationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 16,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 20,
    },
    typeIcon: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        width: 24,
        height: 24,
        borderRadius: 12,
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
        width: 48,
        height: 48,
        borderRadius: 8,
        marginLeft: 12,
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 100,
    },
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#eee', // Will be overridden by theme usually or just use transparent
        marginBottom: 8,
    },
    tab: {
        marginRight: 24,
        paddingVertical: 12,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabText: {
        fontSize: 16,
        fontWeight: '600',
    },
    messageSender: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    messagePreview: {
        fontSize: 14,
        marginTop: 2,
    },
});
