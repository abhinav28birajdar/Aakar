import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Avatar } from '../atoms/Avatar';
import { Button } from '../atoms/Button';

interface UserCardProps {
    name: string;
    username: string;
    avatar: string;
    isFollowing?: boolean;
    onPress?: () => void;
}

export const UserCard: React.FC<UserCardProps> = ({ name, username, avatar, isFollowing, onPress }) => {
    const { colors } = useTheme();

    return (
        <TouchableOpacity onPress={onPress} style={[styles.container, { backgroundColor: colors.surfaceAlt }]}>
            <Avatar source={avatar} size={50} radius={18} />
            <View style={styles.textContainer}>
                <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
                <Text style={[styles.username, { color: colors.textSecondary }]}>@{username}</Text>
            </View>
            <Button
                title={isFollowing ? "Following" : "Follow"}
                variant={isFollowing ? "secondary" : "primary"}
                size="sm"
                onPress={() => { }}
                style={styles.btn}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
    },
    textContainer: {
        flex: 1,
        marginLeft: 16,
    },
    name: {
        fontSize: 16,
        fontWeight: '700',
    },
    username: {
        fontSize: 14,
        fontWeight: '500',
    },
    btn: {
        minWidth: 90,
    },
});
