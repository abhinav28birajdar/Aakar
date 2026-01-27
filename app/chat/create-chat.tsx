import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/hooks/useTheme';
import { AppHeader } from '../../components/headers/AppHeader';
import { UserCard } from '../../components/cards/UserCard';
import { Input } from '../../components/ui/Input';
import { Search } from 'lucide-react-native';
import { MOCK_USERS } from '../../src/constants/mockData';

export default function CreateChatScreen() {
    const { colors } = useTheme();
    const router = useRouter();
    const [search, setSearch] = useState('');

    const filteredUsers = MOCK_USERS.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.username.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <AppHeader title="New Message" />

            <View style={[styles.searchContainer, { borderBottomColor: colors.border }]}>
                <Input
                    placeholder="Search users..."
                    value={search}
                    onChangeText={setSearch}
                    icon={<Search size={20} color={colors.textSecondary} />}
                    style={{ marginBottom: 0 }}
                />
            </View>

            <FlatList
                data={filteredUsers}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <UserCard
                        name={item.name}
                        username={item.username}
                        avatar={item.avatar}
                        isFollowing={item.isFollowing}
                        onPress={() => router.push(`/chat/chat-room?id=${item.id}&name=${item.name}&avatar=${item.avatar}`)}
                    />
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchContainer: {
        padding: 16,
        borderBottomWidth: 1,
    },
    list: {
        padding: 16,
    },
});
