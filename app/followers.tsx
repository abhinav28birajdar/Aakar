import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useTheme } from '../src/hooks/useTheme';
import { ArrowLeft, Search, UserPlus, UserCheck } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { MOCK_USERS } from '../src/constants/mockData';
import { Button } from '../src/components/atoms/Button';

export default function FollowersScreen() {
    const { colors, typography, spacing } = useTheme();
    const router = useRouter();

    const renderUser = ({ item }: { item: any }) => (
        <View style={[styles.userItem, { borderBottomColor: colors.border }]}>
            <TouchableOpacity
                style={styles.userInfo}
                onPress={() => router.push(`/profile/${item.username}`)}
            >
                <Image source={{ uri: item.avatar_url }} style={styles.avatar} />
                <View style={styles.textContainer}>
                    <Text style={[styles.name, { color: colors.text }]}>{item.full_name}</Text>
                    <Text style={[styles.username, { color: colors.textSecondary }]}>@{item.username}</Text>
                </View>
            </TouchableOpacity>
            <Button
                title="Follow"
                variant="outline"
                size="sm"
                onPress={() => { }}
                style={styles.followButton}
            />
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                    <ArrowLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>Followers</Text>
                <View style={{ width: 44 }} />
            </View>

            <View style={styles.searchContainer}>
                <View style={[styles.searchBar, { backgroundColor: colors.surfaceAlt }]}>
                    <Search size={18} color={colors.textSecondary} />
                    <TextInput
                        placeholder="Search followers"
                        placeholderTextColor={colors.textSecondary}
                        style={[styles.input, { color: colors.text }]}
                    />
                </View>
            </View>

            <FlatList
                data={[...MOCK_USERS, ...MOCK_USERS, ...MOCK_USERS]}
                renderItem={renderUser}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
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
    searchContainer: {
        paddingHorizontal: 24,
        marginBottom: 16,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 48,
        borderRadius: 12,
        gap: 12,
    },
    input: {
        flex: 1,
        fontSize: 15,
        fontWeight: '500',
    },
    list: {
        paddingHorizontal: 24,
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 18,
    },
    textContainer: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: '700',
    },
    username: {
        fontSize: 14,
        fontWeight: '500',
    },
    followButton: {
        minWidth: 90,
    },
});
