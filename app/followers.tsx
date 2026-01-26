import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { ArrowLeft, Search, UserMinus } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { MOCK_USERS } from '../constants/mockData';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export default function FollowersScreen() {
    const { colors, typography, spacing } = useTheme();
    const router = useRouter();
    const [search, setSearch] = useState('');

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
                <Input
                    placeholder="Search followers..."
                    value={search}
                    onChangeText={setSearch}
                    leftIcon={<Search size={20} color={colors.textSecondary} />}
                    style={styles.searchInput}
                />
            </View>

            <FlatList
                data={MOCK_USERS}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.item}
                        onPress={() => router.push(`/profile/${item.username}`)}
                    >
                        <Image source={{ uri: item.avatar_url }} style={styles.avatar} />
                        <View style={styles.content}>
                            <Text style={[styles.name, { color: colors.text }]}>{item.full_name}</Text>
                            <Text style={[styles.username, { color: colors.textSecondary }]}>@{item.username}</Text>
                        </View>
                        <Button
                            title="Remove"
                            variant="outline"
                            size="sm"
                            onPress={() => { }}
                            style={styles.actionButton}
                        />
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
    searchContainer: {
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    searchInput: {
        height: 48,
    },
    list: {
        padding: 16,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 20,
    },
    content: {
        flex: 1,
        marginLeft: 12,
    },
    name: {
        fontSize: 16,
        fontWeight: '700',
    },
    username: {
        fontSize: 14,
    },
    actionButton: {
        paddingHorizontal: 16,
    },
});
