import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { Search, Plus, MoreHorizontal } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { MOCK_MESSAGES } from '../../src/constants/mockData';
import { ChatCard } from '../../components/cards/ChatCard';

export default function ChatListScreen() {
    const { colors } = useTheme();
    const router = useRouter();
    const [search, setSearch] = useState('');

    const chats = MOCK_MESSAGES.map(m => ({
        id: m.id,
        name: m.sender.full_name,
        avatar: m.sender.avatar_url,
        lastMessage: m.lastMessage,
        time: m.timestamp,
        unreadCount: m.unreadCount || 0,
        online: true,
    }));

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>Messages</Text>
                <TouchableOpacity
                    style={[styles.iconBtn, { backgroundColor: colors.primary }]}
                    onPress={() => router.push('/chat/create-chat')}
                >
                    <Plus size={24} color="white" />
                </TouchableOpacity>
            </View>

            <View style={styles.searchSection}>
                <View style={[styles.searchBar, { backgroundColor: colors.surfaceAlt }]}>
                    <Search size={20} color={colors.textSecondary} />
                    <TextInput
                        placeholder="Search chats..."
                        placeholderTextColor={colors.textSecondary}
                        style={[styles.input, { color: colors.text }]}
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
            </View>

            <FlatList
                data={chats}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <ChatCard
                        name={item.name}
                        avatar={item.avatar}
                        lastMessage={item.lastMessage}
                        time={item.time}
                        unreadCount={item.unreadCount}
                        online={item.online}
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
    },
    iconBtn: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchSection: {
        paddingHorizontal: 24,
        marginBottom: 8,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 54,
        borderRadius: 16,
        gap: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
    },
    listContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
});
