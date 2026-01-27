import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/hooks/useTheme';
import { useRouter } from 'expo-router';
import { MOCK_NOTIFICATIONS } from '../../src/constants/mockData';
import { NotificationCard } from '../../components/cards/NotificationCard';
import { CheckCheck } from 'lucide-react-native';

export default function NotificationsScreen() {
    const { colors } = useTheme();
    const router = useRouter();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>Notifications</Text>
                <TouchableOpacity style={styles.markAll}>
                    <CheckCheck size={20} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={MOCK_NOTIFICATIONS}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <NotificationCard
                        type={item.type as any}
                        user={{
                            name: item.user.full_name,
                            avatar: item.user.avatar_url
                        }}
                        content={item.content}
                        timestamp={item.timestamp}
                        postImage={item.post?.image_url}
                        onPress={() => item.post?.image_url && router.push('/post/1')}
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
    markAll: {
        padding: 8,
    },
    listContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
});
