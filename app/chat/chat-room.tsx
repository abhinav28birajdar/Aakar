import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    FlatList,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../src/hooks/useTheme';
import { Send, Image as ImageIcon, Mic, MoreVertical } from 'lucide-react-native';
import { ChatHeader } from '../../components/headers/ChatHeader';

const MOCK_MESSAGES = [
    { id: '1', text: 'Hey! I saw your latest UI Kit, it looks amazing!', sender: 'other', time: '10:00 AM' },
    { id: '2', text: 'Thanks so much! I really appreciate the feedback.', sender: 'me', time: '10:05 AM' },
    { id: '3', text: 'Are you available for a quick collaboration project?', sender: 'other', time: '10:06 AM' },
    { id: '4', text: 'Sure! Tell me more about it.', sender: 'me', time: '10:07 AM' },
];

export default function ChatRoomScreen() {
    const { colors } = useTheme();
    const { name, avatar } = useLocalSearchParams();
    const [message, setMessage] = useState('');

    const renderMessage = ({ item }: any) => {
        const isMe = item.sender === 'me';
        return (
            <View style={[
                styles.messageContainer,
                isMe ? styles.myMessage : styles.otherMessage,
                { backgroundColor: isMe ? colors.primary : colors.surfaceAlt }
            ]}>
                <Text style={[styles.messageText, { color: isMe ? 'white' : colors.text }]}>{item.text}</Text>
                <Text style={[styles.messageTime, { color: isMe ? 'rgba(255,255,255,0.7)' : colors.textSecondary }]}>{item.time}</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ChatHeader
                name={(name as string) || 'John Doe'}
                avatar={(avatar as string) || 'https://i.pravatar.cc/150?u=1'}
            />

            <FlatList
                data={MOCK_MESSAGES}
                keyExtractor={(item) => item.id}
                renderItem={renderMessage}
                contentContainerStyle={styles.listContent}
                inverted={false}
            />

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
                <View style={[styles.inputContainer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
                    <TouchableOpacity style={styles.attachmentBtn}>
                        <ImageIcon size={24} color={colors.textSecondary} />
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
                        <TouchableOpacity style={styles.micBtn}>
                            <Mic size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={[styles.sendBtn, { backgroundColor: message ? colors.primary : colors.surfaceAlt }]}
                        disabled={!message}
                    >
                        <Send size={24} color={message ? 'white' : colors.textMuted} />
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
    listContent: {
        padding: 20,
        gap: 16,
    },
    messageContainer: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 20,
        gap: 4,
    },
    myMessage: {
        alignSelf: 'flex-end',
        borderBottomRightRadius: 4,
    },
    otherMessage: {
        alignSelf: 'flex-start',
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 15,
        fontWeight: '500',
        lineHeight: 20,
    },
    messageTime: {
        fontSize: 10,
        alignSelf: 'flex-end',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        paddingBottom: Platform.OS === 'ios' ? 24 : 12,
        borderTopWidth: 1,
        gap: 12,
    },
    attachmentBtn: {
        padding: 4,
    },
    inputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        borderRadius: 24,
        minHeight: 48,
    },
    input: {
        flex: 1,
        fontSize: 15,
        paddingVertical: 8,
    },
    micBtn: {
        padding: 4,
    },
    sendBtn: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
