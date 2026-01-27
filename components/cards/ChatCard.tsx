import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';

interface ChatCardProps {
    name: string;
    avatar: string;
    lastMessage: string;
    time: string;
    unreadCount?: number;
    online?: boolean;
    onPress?: () => void;
}

export const ChatCard: React.FC<ChatCardProps> = ({
    name,
    avatar,
    lastMessage,
    time,
    unreadCount = 0,
    online = false,
    onPress
}) => {
    const { colors } = useTheme();

    return (
        <TouchableOpacity onPress={onPress} style={[styles.container, { borderBottomColor: colors.border }]}>
            <Avatar source={avatar} size={54} radius={18} online={online} />
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
                    <Text style={[styles.time, { color: colors.textSecondary }]}>{time}</Text>
                </View>
                <View style={styles.footer}>
                    <Text numberOfLines={1} style={[styles.lastMessage, { color: unreadCount > 0 ? colors.text : colors.textSecondary }]}>
                        {lastMessage}
                    </Text>
                    {unreadCount > 0 && <Badge label={unreadCount} style={styles.badge} />}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    content: {
        flex: 1,
        marginLeft: 16,
        gap: 4,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    name: {
        fontSize: 16,
        fontWeight: '700',
    },
    time: {
        fontSize: 12,
    },
    lastMessage: {
        flex: 1,
        fontSize: 14,
        marginRight: 8,
    },
    badge: {
        height: 20,
        width: 20,
        borderRadius: 10,
    },
});
