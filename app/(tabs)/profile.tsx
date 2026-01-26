import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { Image } from 'expo-image';
import { Settings, Share2, Grid, Bookmark, Heart, Edit2, Link as LinkIcon, MapPin } from 'lucide-react-native';
import { MOCK_POSTS } from '../../constants/mockData';
import { Button } from '../../components/Button';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
    const { colors } = useTheme();
    const { user } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('posts');
    // user might be null initially if loading, handled by _layout mostly, but safe check needed
    // or just mock if strictly ui focus and auth is bypassed? 
    // AuthContext ensures user is present in (tabs) via _layout check. 

    // Fallback if useAuth user is null.
    const displayUser = {
        full_name: user?.name || 'Guest User',
        username: user?.username || 'guest',
        avatar_url: user?.avatar_url || 'https://i.pravatar.cc/150',
        posts_count: 24,
        bio: 'Product Designer',
        following: 450,
        followers: 1200
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={[styles.headerIcon, { backgroundColor: colors.surfaceAlt }]}>
                        <Share2 size={20} color={colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => router.push('/settings')}
                        style={[styles.headerIcon, { backgroundColor: colors.surfaceAlt }]}
                    >
                        <Settings size={20} color={colors.text} />
                    </TouchableOpacity>
                </View>

                {/* Profile Info */}
                <View style={styles.profileInfo}>
                    <Image source={{ uri: displayUser.avatar_url }} style={styles.avatar} />
                    <Text style={[styles.name, { color: colors.text }]}>{displayUser.full_name}</Text>
                    <Text style={[styles.username, { color: colors.textSecondary }]}>@{displayUser.username}</Text>

                    <View style={styles.metaRow}>
                        <View style={styles.metaItem}>
                            <MapPin size={14} color={colors.textSecondary} />
                            <Text style={[styles.metaText, { color: colors.textSecondary }]}>San Francisco, CA</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <LinkIcon size={14} color={colors.textSecondary} />
                            <Text style={[styles.metaText, { color: colors.primary }]}>ninja.design</Text>
                        </View>
                    </View>

                    <Text style={[styles.bio, { color: colors.text, textAlign: 'center' }]}>
                        {displayUser.bio}. Creating digital experiences that matter.
                    </Text>

                    {/* Stats */}
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: colors.text }]}>{displayUser.posts_count}</Text>
                            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Posts</Text>
                        </View>
                        <TouchableOpacity onPress={() => router.push('/followers')} style={styles.statItem}>
                            <Text style={[styles.statValue, { color: colors.text }]}>{displayUser.followers}</Text>
                            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Followers</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => router.push('/following')} style={styles.statItem}>
                            <Text style={[styles.statValue, { color: colors.text }]}>{displayUser.following}</Text>
                            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Following</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.actionButtons}>
                        <Button
                            title="Edit Profile"
                            variant="outline"
                            onPress={() => router.push('/edit-profile')}
                            style={styles.editButton}
                            icon={<Edit2 size={16} color={colors.text} />}
                        />
                    </View>
                </View>

                {/* Tabs */}
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
                    <TouchableOpacity
                        onPress={() => setActiveTab('saved')}
                        style={[styles.tab, activeTab === 'saved' && { borderBottomColor: colors.primary }]}
                    >
                        <Bookmark size={20} color={activeTab === 'saved' ? colors.primary : colors.textSecondary} />
                    </TouchableOpacity>
                </View>

                {/* Grid */}
                <View style={styles.grid}>
                    {MOCK_POSTS.map((post) => (
                        <TouchableOpacity key={post.id} style={styles.gridItem}>
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
        justifyContent: 'flex-end',
        padding: 24,
        gap: 12,
    },
    headerIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
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
        width: '100%',
        marginBottom: 32,
    },
    editButton: {
        width: '100%',
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
