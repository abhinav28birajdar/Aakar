import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { ArrowLeft, Edit3, Search } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { MOCK_USERS } from '../../constants/mockData';
import { Input } from '../../components/Input';

export default function MessagesScreen() {
    const { colors, typography, spacing } = useTheme();
    const router = useRouter();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                    <ArrowLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>Messages</Text>
                <TouchableOpacity style={styles.iconButton}>
                    <Edit3 size={20} color={colors.text} />
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <Input
                    placeholder="Search messages..."
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
                        onPress={() => router.push(`/messages/${item.id}`)}
                    >
                        <View style={styles.avatarContainer}>
                            <Image source={{ uri: item.avatar_url }} style={styles.avatar} />
                            <View style={[styles.onlineIndicator, { backgroundColor: colors.success, borderColor: colors.background }]} />
                        </View>
                        <View style={styles.content}>
                            <View style={styles.row}>
                                <Text style={[styles.name, { color: colors.text }]}>{item.full_name}</Text>
                                <Text style={[styles.time, { color: colors.textSecondary }]}>2m ago</Text>
                            </View>
                            <Text numberOfLines={1} style={[styles.message, { color: colors.textSecondary }]}>
                                Hey, I saw your latest design! It's absolutely stunning...
                            </Text>
                        </View>
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
        marginBottom: 24,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 24,
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 14,
        height: 14,
        borderRadius: 7,
        borderWidth: 2,
    },
    content: {
        flex: 1,
        marginLeft: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    name: {
        fontSize: 16,
        fontWeight: '700',
    },
    time: {
        fontSize: 12,
    },
    message: {
        fontSize: 14,
    },
});
