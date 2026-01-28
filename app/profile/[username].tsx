import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/hooks/useTheme';
import { Image } from 'expo-image';
import { ArrowLeft, Settings, Share2, Grid, Bookmark, Heart, MessageCircle, Link as LinkIcon, MapPin, MoreVertical, UserPlus } from 'lucide-react-native';
import { MOCK_POSTS, MOCK_USERS } from '../../src/constants/mockData';
import { Button } from '../../src/components/atoms/Button';
import { useRouter, useLocalSearchParams } from 'expo-router';

const { width } = Dimensions.get('window');

export default function PublicProfileScreen() {
    const { colors, typography, spacing } = useTheme();
    const router = useRouter();
    const { username } = useLocalSearchParams();
    const [activeTab, setActiveTab] = useState('posts');
    const [isFollowing, setIsFollowing] = useState(false);

    const user = MOCK_USERS.find(u => u.username === username) || MOCK_USERS[1];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={[styles.headerIcon, { backgroundColor: colors.surfaceAlt }]}>
                        <ArrowLeft size={20} color={colors.text} />
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        <TouchableOpacity style={[styles.headerIcon, { backgroundColor: colors.surfaceAlt }]}>
                            <Share2 size={20} color={colors.text} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.headerIcon, { backgroundColor: colors.surfaceAlt }]}>
                            <MoreVertical size={20} color={colors.text} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Profile Info */}
                <View style={styles.profileInfo}>
                    <View style={styles.avatarWrapper}>
                        <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
                        <View style={[styles.onlineIndicator, { backgroundColor: colors.success, borderColor: colors.background }]} />
                    </View>
                    <Text style={[styles.name, { color: colors.text }]}>{user.full_name}</Text>
                    <Text style={[styles.username, { color: colors.textSecondary }]}>@{user.username}</Text>

                    <View style={styles.metaRow}>
                        <View style={styles.metaItem}>
                            <MapPin size={14} color={colors.textSecondary} />
                            <Text style={[styles.metaText, { color: colors.textSecondary }]}>{user.location}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <LinkIcon size={14} color={colors.textSecondary} />
                            <Text style={[styles.metaText, { color: colors.primary }]}>portfolio.design</Text>
                        </View>
                    </View>

                    <Text style={[styles.bio, { color: colors.text }]}>
                        {user.bio}. Passionate about building products that solve real problems.
                    </Text>

                    {/* Stats */}
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: colors.text }]}>{user.posts_count}</Text>
                            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Posts</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: colors.text }]}>{user.followers / 1000}k</Text>
                            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Followers</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: colors.text }]}>{user.following}</Text>
                            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Following</Text>
                        </View>
                    </View>

                    <View style={styles.actionButtons}>
                        <Button
                            title={isFollowing ? "Following" : "Follow"}
                            variant={isFollowing ? "secondary" : "primary"}
                            onPress={() => setIsFollowing(!isFollowing)}
                            style={styles.followButton}
                            icon={!isFollowing && <UserPlus size={18} color="white" />}
                        />
                        <TouchableOpacity
                            onPress={() => router.push({ pathname: '/messages/[id]', params: { id: user.id } })}
                            style={[styles.messageButton, { backgroundColor: colors.surfaceAlt }]}
                        >
                            <MessageCircle size={22} color={colors.text} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Tabs */}
                <View style={[styles.tabs, { borderBottomColor: colors.border }]}>
                    <TouchableOpacity
                        onPress={() => setActiveTab('posts')}
                        style={[styles.tab, activeTab === 'posts' && { borderBottomColor: colors.primary }]}
                    >
                        <Grid size={20} color={activeTab === 'posts' ? colors.primary : colors.textSecondary} />
                        <Text style={[styles.tabText, { color: activeTab === 'posts' ? colors.primary : colors.textSecondary }]}>Work</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setActiveTab('liked')}
                        style={[styles.tab, activeTab === 'liked' && { borderBottomColor: colors.primary }]}
                    >
                        <Heart size={20} color={activeTab === 'liked' ? colors.primary : colors.textSecondary} />
                        <Text style={[styles.tabText, { color: activeTab === 'liked' ? colors.primary : colors.textSecondary }]}>Liked</Text>
                    </TouchableOpacity>
                </View>

                {/* Grid */}
                <View style={styles.grid}>
                    {MOCK_POSTS.map((post) => (
                        <TouchableOpacity
                            key={post.id}
                            style={styles.gridItem}
                            onPress={() => router.push({ pathname: '/post/[id]', params: { id: post.id } })}
                        >
                            <Image source={{ uri: post.image_url }} style={styles.gridImage} />
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
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
        padding: 16,
        paddingHorizontal: 24,
    },
    headerIcon: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileInfo: {
        alignItems: 'center',
        paddingHorizontal: 32,
        marginTop: 10,
    },
    avatarWrapper: {
        position: 'relative',
        marginBottom: 20,
    },
    avatar: {
        width: 110,
        height: 110,
        borderRadius: 40,
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 4,
    },
    name: {
        fontSize: 26,
        fontWeight: '800',
        marginBottom: 4,
    },
    username: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 16,
    },
    metaRow: {
        flexDirection: 'row',
        gap: 20,
        marginBottom: 16,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    metaText: {
        fontSize: 14,
        fontWeight: '600',
    },
    bio: {
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 24,
        textAlign: 'center',
    },
    statsRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
        marginBottom: 32,
        paddingHorizontal: 10,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: '800',
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: 4,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    actionButtons: {
        flexDirection: 'row',
        width: '100%',
        gap: 12,
        marginBottom: 40,
    },
    followButton: {
        flex: 1,
        borderRadius: 16,
    },
    messageButton: {
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabs: {
        flexDirection: 'row',
        borderBottomWidth: 1,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderBottomWidth: 3,
        borderBottomColor: 'transparent',
        gap: 8,
    },
    tabText: {
        fontSize: 15,
        fontWeight: '700',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    gridItem: {
        width: width / 3,
        height: width / 3,
        padding: 1,
    },
    gridImage: {
        width: '100%',
        height: '100%',
    },
});
