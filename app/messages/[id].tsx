import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    FlatList,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { ArrowLeft, MoreHorizontal, Send, Image as ImageIcon, Plus } from 'lucide-react-native';
import { Image } from 'expo-image';
import { MOCK_USERS } from '../../constants/mockData';

export default function ChatScreen() {
    const { id } = useLocalSearchParams();
    const { colors } = useTheme();
    const router = useRouter();
    const user = MOCK_USERS.find(u => u.id === id) || MOCK_USERS[1];
    const [message, setMessage] = useState('');

    const messages = [
        { id: '1', text: 'Hi Alex! Love your work.', sender: 'them', time: '10:00 AM' },
        { id: '2', text: 'Hey Sarah, thank you so much! Really appreciate it.', sender: 'me', time: '10:05 AM' },
        { id: '3', text: 'Would you be open for a quick collaboration?', sender: 'them', time: '10:10 AM' },
    ];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <ArrowLeft size={24} color={colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.userInfo} onPress={() => router.push(`/profile/${user.username}`)}>
                        <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
                        <View>
                            <Text style={[styles.name, { color: colors.text }]}>{user.full_name}</Text>
                            <Text style={[styles.status, { color: colors.success }]}>Online</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.iconButton}>
                    <MoreHorizontal size={24} color={colors.text} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.messageList}
                renderItem={({ item }) => (
                    <View style={[
                        styles.messageItem,
                        item.sender === 'me' ? styles.myMessage : styles.theirMessage
                    ]}>
                        <View style={[
                            styles.bubble,
                            { backgroundColor: item.sender === 'me' ? colors.primary : colors.surfaceAlt }
                        ]}>
                            <Text style={[
                                styles.messageText,
                                { color: item.sender === 'me' ? 'white' : colors.text }
                            ]}>
                                {item.text}
                            </Text>
                        </View>
                        <Text style={[styles.time, { color: colors.textSecondary }]}>{item.time}</Text>
                    </View>
                )}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <View style={[styles.inputContainer, { borderTopColor: colors.border }]}>
                    <TouchableOpacity style={styles.attachButton}>
                        <ImageIcon size={24} color={colors.textSecondary} />
                    </TouchableOpacity>
                    <View style={[styles.inputWrapper, { backgroundColor: colors.surfaceAlt }]}>
                        <TextInput
                            style={[styles.input, { color: colors.text }]}
                            placeholder="Type a message..."
                            placeholderTextColor={colors.textMuted}
                            value={message}
                            onChangeText={setMessage}
                            multiline
                        />
                    </View>
                    <TouchableOpacity
                        style={[styles.sendButton, { backgroundColor: colors.primary }]}
                        onPress={() => setMessage('')}
                    >
                        <Send size={20} color="white" />
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
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 4,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 16,
        marginRight: 10,
    },
    name: {
        fontSize: 16,
        fontWeight: '700',
    },
    status: {
        fontSize: 12,
        fontWeight: '600',
    },
    iconButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    messageList: {
        padding: 16,
    },
    messageItem: {
        marginBottom: 20,
        maxWidth: '80%',
    },
    myMessage: {
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
    },
    theirMessage: {
        alignSelf: 'flex-start',
        alignItems: 'flex-start',
    },
    bubble: {
        padding: 12,
        borderRadius: 20,
        marginBottom: 4,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 20,
    },
    time: {
        fontSize: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        gap: 12,
    },
    attachButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputWrapper: {
        flex: 1,
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 8,
        maxHeight: 100,
    },
    input: {
        fontSize: 15,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
