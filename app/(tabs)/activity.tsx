import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { Bell, MessageSquare, Heart, UserPlus, MessageCircle, Filter, Search } from 'lucide-react-native';
import { Image } from 'expo-image';
import { MOCK_NOTIFICATIONS, MOCK_USERS } from '../../src/constants/mockData';
import { MotiView } from 'moti';
import { useRouter } from 'expo-router';

export default function ActivityScreen() {
    const { colors, typography, spacing } = useTheme();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('activity');

    const renderNotification = ({ item, index }: { item: any, index: number }) => (
        <MotiView
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: index * 100 }}
            style={[styles.notificationItem, { borderBottomColor: colors.border }]}
        >
            <TouchableOpacity style={styles.notificationContent}>
                <View style={styles.avatarContainer}>
                    <Image source={{ uri: item.user.avatar_url }} style={styles.avatar} />
                    <View style={[styles.typeIcon, { backgroundColor: item.type === 'like' ? colors.error : item.type === 'follow' ? colors.success : colors.primary }]}>
                        {item.type === 'like' ? <Heart size={10} color="white" fill="white" /> :
                            item.type === 'follow' ? <UserPlus size={10} color="white" /> :
                                <MessageCircle size={10} color="white" fill="white" />}
                    </View>
                </View>
                <View style={styles.textContainer}>
                    <Text style={[styles.notificationText, { color: colors.text }]}>
                        <Text style={{ fontWeight: '700' }}>{item.user.username}</Text>
                        {item.type === 'like' ? ' liked your post' :
                            item.type === 'follow' ? ' started following you' :
                                ' commented on your post'}
                    </Text>
                    <Text style={[styles.time, { color: colors.textSecondary }]}>{item.timestamp}</Text>
                </View>
                {item.post && (
                    <Image source={{ uri: item.post.image_url }} style={styles.postThumb} />
                )}
            </TouchableOpacity>
        </MotiView>
    );

    const renderMessageItem = ({ item, index }: { item: any, index: number }) => (
        <TouchableOpacity
            style={[styles.messageItem, { borderBottomColor: colors.border }]}
            onPress={() => router.push({ pathname: '/messages/[id]', params: { id: item.id } })}
        >
            <View style={styles.avatarContainer}>
                <Image source={{ uri: item.avatar_url }} style={styles.avatar} />
                <View style={[styles.onlineBadge, { backgroundColor: colors.success }]} />
            </View>
            <View style={styles.textContainer}>
                <View style={styles.messageHeader}>
                    <Text style={[styles.userName, { color: colors.text }]}>{item.full_name}</Text>
                    <Text style={[styles.time, { color: colors.textSecondary }]}>2m ago</Text>
                </View>
                <Text numberOfLines={1} style={[styles.lastMessage, { color: colors.textSecondary }]}>
                    Hey! I saw your latest UI design and I'm really impressed...
                </Text>
            </View>
            <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.unreadText}>2</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>Inbox</Text>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.surfaceAlt }]}>
                        <Search size={22} color={colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.surfaceAlt }]}>
                        <Filter size={22} color={colors.text} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    onPress={() => setActiveTab('activity')}
                    style={[styles.tab, activeTab === 'activity' && { borderBottomColor: colors.primary, borderBottomWidth: 3 }]}
                >
                    <Text style={[styles.tabText, { color: activeTab === 'activity' ? colors.text : colors.textSecondary }]}>Activity</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setActiveTab('messages')}
                    style={[styles.tab, activeTab === 'messages' && { borderBottomColor: colors.primary, borderBottomWidth: 3 }]}
                >
                    <Text style={[styles.tabText, { color: activeTab === 'messages' ? colors.text : colors.textSecondary }]}>Messages</Text>
                    <View style={[styles.dot, { backgroundColor: colors.primary }]} />
                </TouchableOpacity>
            </View>

            {activeTab === 'activity' ? (
                <FlatList
                    data={MOCK_NOTIFICATIONS}
                    renderItem={renderNotification}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <FlatList
                    data={MOCK_USERS.slice(1)}
                    renderItem={renderMessageItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                />
            )}
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
    title: {
        fontSize: 32,
        fontWeight: '800',
    },
    headerActions: {
        flexDirection: 'row',
        gap: 12,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        marginBottom: 16,
        gap: 24,
    },
    tab: {
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    tabText: {
        fontSize: 16,
        fontWeight: '700',
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginLeft: 6,
    },
    list: {
        paddingHorizontal: 24,
    },
    notificationItem: {
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    notificationContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 54,
        height: 54,
        borderRadius: 18,
    },
    typeIcon: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
        marginLeft: 16,
    },
    notificationText: {
        fontSize: 14,
        lineHeight: 20,
    },
    time: {
        fontSize: 12,
        marginTop: 4,
    },
    postThumb: {
        width: 50,
        height: 50,
        borderRadius: 12,
        marginLeft: 12,
    },
    messageItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    messageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    userName: {
        fontSize: 16,
        fontWeight: '700',
    },
    lastMessage: {
        fontSize: 14,
        marginTop: 4,
    },
    onlineBadge: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 14,
        height: 14,
        borderRadius: 7,
        borderWidth: 2,
        borderColor: 'white',
    },
    unreadBadge: {
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 12,
    },
    unreadText: {
        color: 'white',
        fontSize: 10,
        fontWeight: '800',
    },
});
