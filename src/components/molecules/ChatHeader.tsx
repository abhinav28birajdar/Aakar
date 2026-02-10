import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { ArrowLeft, Video, Phone } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Avatar } from '../atoms/Avatar';

interface ChatHeaderProps {
    name: string;
    avatar: string;
    online?: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ name, avatar, online = true }) => {
    const { colors } = useTheme();
    const router = useRouter();

    return (
        <SafeAreaView style={{ backgroundColor: colors.background }}>
            <View style={[styles.container, { borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={24} color={colors.text} />
                </TouchableOpacity>

                <View style={styles.userInfo}>
                    <Avatar source={avatar} size={36} radius={12} online={online} />
                    <View style={styles.textInfo}>
                        <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
                        <Text style={[styles.status, { color: online ? colors.success : colors.textSecondary }]}>
                            {online ? 'Online' : 'Offline'}
                        </Text>
                    </View>
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity style={styles.actionBtn}>
                        <Phone size={22} color={colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn}>
                        <Video size={22} color={colors.text} />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 64,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        borderBottomWidth: 1,
    },
    backBtn: {
        marginRight: 12,
    },
    userInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    textInfo: {
        gap: 2,
    },
    name: {
        fontSize: 16,
        fontWeight: '700',
    },
    status: {
        fontSize: 12,
        fontWeight: '600',
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
