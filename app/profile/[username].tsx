import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { Image } from 'expo-image';
import { ArrowLeft, MessageCircle, MoreHorizontal, Grid, Heart, MapPin, Link as LinkIcon } from 'lucide-react-native';
import { MOCK_POSTS, MOCK_USERS } from '../../constants/mockData';
import { Button } from '../../components/Button';

const { width } = Dimensions.get('window');

export default function PublicProfileScreen() {
    const { username } = useLocalSearchParams();
    const router = useRouter();
    const { colors, typography, spacing } = useTheme();

    const user = MOCK_USERS.find(u => u.username === username) || MOCK_USERS[1];
    const [isFollowing, setIsFollowing] = useState(false);
    const [activeTab, setActiveTab] = useState('posts');

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
                    <ArrowLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerIcon}>
                    <MoreHorizontal size={24} color={colors.text} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.profileInfo}>
                    <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
                    <Text style={[styles.name, { color: colors.text }]}>{user.full_name}</Text>
                    <Text style={[styles.username, { color: colors.textSecondary }]}>@{user.username}</Text>

                    <View style={styles.metaRow}>
                        <View style={styles.metaItem}>
                            <MapPin size={14} color={colors.textSecondary} />
                            <Text style={[styles.metaText, { color: colors.textSecondary }]}>London, UK</Text>
                        </View>
                    </View>

                    <Text style={[styles.bio, { color: colors.text, textAlign: 'center' }]}>
                        {user.bio}. Capturing the beauty of minimalism in every pixel.
                    </Text>

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: colors.text }]}>{user.posts_count}</Text>
                            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Posts</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: colors.text }]}>3.5k</Text>
                            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Followers</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: colors.text }]}>800</Text>
                            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Following</Text>
                        </View>
                    </View>

                    <View style={styles.actionButtons}>
                        <Button
                            title={isFollowing ? "Following" : "Follow"}
                            variant={isFollowing ? "outline" : "primary"}
                            onPress={() => setIsFollowing(!isFollowing)}
                            style={styles.followButton}
                        />
                        <TouchableOpacity style={[styles.messageButton, { borderColor: colors.border, borderWidth: 1 }]}>
                            <MessageCircle size={24} color={colors.text} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={[styles.tabs, { borderBottomColor: colors.border }]}>
                    <TouchableOpacity
                        onPress={() => setActiveTab('posts')}
                        style={[styles.tab, activeTab === 'posts' && { borderBottomColor: colors.primary }]}
                    >
                        <Grid size={20} color={activeTab === 'posts' ? colors.primary : colors.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setActiveTab('liked')}
                        style={[styles.tab, activeTab === 'liked' && { borderBottomColor: colors.primary }]}
                    >
                        <Heart size={20} color={activeTab === 'liked' ? colors.primary : colors.textSecondary} />
                    </TouchableOpacity>
                </View>

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
    },
    headerIcon: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileInfo: {
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 35,
        marginBottom: 20,
    },
    name: {
        fontSize: 24,
        fontWeight: '800',
        marginBottom: 4,
    },
    username: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 16,
    },
    metaRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 16,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 14,
        fontWeight: '500',
    },
    bio: {
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 24,
    },
    statsRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
        marginBottom: 24,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 18,
        fontWeight: '700',
    },
    statLabel: {
        fontSize: 12,
        marginTop: 2,
    },
    actionButtons: {
        flexDirection: 'row',
        width: '100%',
        gap: 12,
        marginBottom: 32,
    },
    followButton: {
        flex: 1,
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
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
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
