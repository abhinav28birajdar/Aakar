import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../src/hooks/useTheme';
import { ArrowLeft, MoreVertical, Heart, MessageCircle, UserPlus, Filter, Trash2, CheckCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { MOCK_NOTIFICATIONS } from '../src/constants/mockData';
import { MotiView } from 'moti';

export default function NotificationsScreen() {
    const { colors, typography, spacing } = useTheme();
    const router = useRouter();

    const renderIcon = (type: string) => {
        switch (type) {
            case 'like':
                return <Heart size={12} color="white" fill="white" />;
            case 'comment':
                return <MessageCircle size={12} color="white" fill="white" />;
            case 'follow':
                return <UserPlus size={12} color="white" />;
            default:
                return <CheckCircle size={12} color="white" />;
        }
    };

    const getIconColor = (type: string) => {
        switch (type) {
            case 'like': return colors.error;
            case 'comment': return colors.primary;
            case 'follow': return colors.success;
            default: return colors.primary;
        }
    };

    const renderNotification = ({ item, index }: { item: any, index: number }) => (
        <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: index * 50 }}
            style={[styles.item, { borderBottomColor: colors.border }]}
        >
            <TouchableOpacity style={styles.notificationMain}>
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
                        {item.type === 'comment' && ` commented: "${item.content}"`}
                        {item.type === 'follow' && ' started following you.'}
                    </Text>
                    <Text style={[styles.time, { color: colors.textSecondary }]}>{item.timestamp}</Text>
                </View>

                {item.post && (
                    <Image source={{ uri: item.post.image_url }} style={styles.postPreview} />
                )}
            </TouchableOpacity>
        </MotiView>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                    <ArrowLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>Notifications</Text>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.iconButton}>
                        <CheckCircle size={20} color={colors.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton}>
                        <Filter size={20} color={colors.text} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.categoryScroll}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>
                    {['All', 'Likes', 'Comments', 'Followers', 'Mentions'].map((cat) => (
                        <TouchableOpacity key={cat} style={[styles.catChip, { backgroundColor: cat === 'All' ? colors.primary : colors.surfaceAlt }]}>
                            <Text style={[styles.catText, { color: cat === 'All' ? 'white' : colors.textSecondary }]}>{cat}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <FlatList
                data={MOCK_NOTIFICATIONS}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                renderItem={renderNotification}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={<View style={{ height: 40 }} />}
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
    headerActions: {
        flexDirection: 'row',
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
    categoryScroll: {
        paddingVertical: 12,
    },
    categories: {
        paddingHorizontal: 20,
        gap: 10,
    },
    catChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 10,
    },
    catText: {
        fontSize: 14,
        fontWeight: '600',
    },
    list: {
        paddingHorizontal: 16,
    },
    item: {
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    notificationMain: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 12,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 16,
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
        width: 48,
        height: 48,
        borderRadius: 10,
        marginLeft: 12,
    },
});
