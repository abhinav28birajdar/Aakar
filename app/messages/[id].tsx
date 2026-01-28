import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/hooks/useTheme';
import { ArrowLeft, MoreVertical, Send, Image as ImageIcon, Smile, Mic, CheckCheck, PlusSquare } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { MOCK_USERS } from '../../src/constants/mockData';
import { MotiView } from 'moti';

const MOCK_CHAT_MESSAGES = [
    { id: '1', text: 'Hi Alex! I saw your recent dashboard design.', sender: 'other', time: '10:00 AM' },
    { id: '2', text: 'Hey Sarah! Thanks so much. Glad you liked it.', sender: 'me', time: '10:02 AM' },
    { id: '3', text: 'The color palette is actually very refreshing. What font did you use?', sender: 'other', time: '10:05 AM' },
    { id: '4', text: 'I used SF Pro for the primary text and Outfit for headings.', sender: 'me', time: '10:06 AM' },
    { id: '5', text: 'That explains the premium feel!', sender: 'other', time: '10:07 AM' },
];

export default function ChatScreen() {
    const { colors, typography, spacing } = useTheme();
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [message, setMessage] = useState('');
    const user = MOCK_USERS[1]; // Sarah Chen

    const renderMessage = ({ item }: { item: any }) => {
        const isMe = item.sender === 'me';
        return (
            <View style={[styles.messageRow, { justifyContent: isMe ? 'flex-end' : 'flex-start' }]}>
                {!isMe && <Image source={{ uri: user.avatar_url }} style={styles.chatAvatar} />}
                <View style={[
                    styles.messageBubble,
                    {
                        backgroundColor: isMe ? colors.primary : colors.surfaceAlt,
                        borderBottomLeftRadius: isMe ? 20 : 4,
                        borderBottomRightRadius: isMe ? 4 : 20,
                    }
                ]}>
                    <Text style={[styles.messageText, { color: isMe ? 'white' : colors.text }]}>{item.text}</Text>
                    <View style={styles.messageFooter}>
                        <Text style={[styles.messageTime, { color: isMe ? 'rgba(255,255,255,0.7)' : colors.textSecondary }]}>{item.time}</Text>
                        {isMe && <CheckCheck size={14} color="rgba(255,255,255,0.7)" style={{ marginLeft: 4 }} />}
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                    <ArrowLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push(`/profile/${user.username}`)} style={styles.headerUser}>
                    <Image source={{ uri: user.avatar_url }} style={styles.headerAvatar} />
                    <View>
                        <Text style={[styles.headerName, { color: colors.text }]}>{user.full_name}</Text>
                        <Text style={[styles.headerStatus, { color: colors.success }]}>Online</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                    <MoreVertical size={24} color={colors.text} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={MOCK_CHAT_MESSAGES}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.chatList}
                showsVerticalScrollIndicator={false}
            />

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 20}>
                <View style={[styles.inputContainer, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
                    <TouchableOpacity style={styles.inputAction}>
                        <PlusSquare color={colors.textSecondary} size={24} />
                    </TouchableOpacity>
                    <View style={[styles.inputWrapper, { backgroundColor: colors.surfaceAlt }]}>
                        <TextInput
                            placeholder="Type a message..."
                            placeholderTextColor={colors.textSecondary}
                            style={[styles.input, { color: colors.text }]}
                            value={message}
                            onChangeText={setMessage}
                            multiline
                        />
                        <TouchableOpacity style={styles.emojiButton}>
                            <Smile size={24} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={[styles.sendButton, { backgroundColor: colors.primary }]}
                        onPress={() => setMessage('')}
                    >
                        {message.length > 0 ? (
                            <Send size={20} color="white" />
                        ) : (
                            <Mic size={20} color="white" />
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'transparent', // Can change on scroll
    },
    iconButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerUser: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    headerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 14,
    },
    headerName: {
        fontSize: 16,
        fontWeight: '700',
    },
    headerStatus: {
        fontSize: 12,
        fontWeight: '600',
    },
    chatList: {
        padding: 24,
        paddingBottom: 40,
        gap: 20,
    },
    messageRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 10,
    },
    chatAvatar: {
        width: 32,
        height: 32,
        borderRadius: 12,
        marginBottom: 2,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 14,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 22,
    },
    messageFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 4,
    },
    messageTime: {
        fontSize: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        paddingHorizontal: 20,
        gap: 12,
        borderTopWidth: 1,
    },
    inputAction: {
        padding: 4,
    },
    inputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 24,
        paddingHorizontal: 16,
        minHeight: 48,
        maxHeight: 120,
    },
    input: {
        flex: 1,
        fontSize: 15,
        paddingVertical: 10,
    },
    emojiButton: {
        padding: 4,
    },
    sendButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
