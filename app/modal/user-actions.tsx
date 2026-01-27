import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useRouter } from 'expo-router';
import { Flag, Slash, UserMinus, X } from 'lucide-react-native';

export default function UserActionsModal() {
    const { colors } = useTheme();
    const router = useRouter();

    const ActionItem = ({ icon: Icon, label, color, onPress }: any) => (
        <TouchableOpacity style={styles.item} onPress={onPress}>
            <View style={[styles.iconBox, { backgroundColor: color ? color + '15' : colors.surfaceAlt }]}>
                <Icon size={20} color={color || colors.text} />
            </View>
            <Text style={[styles.label, { color: color || colors.text }]}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.overlay}>
            <TouchableOpacity style={styles.backdrop} onPress={() => router.back()} />
            <View style={[styles.content, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
                <View style={styles.handle} />
                <Text style={[styles.title, { color: colors.text }]}>Actions</Text>

                <ActionItem
                    icon={Slash}
                    label="Block User"
                    color={colors.error}
                    onPress={() => router.back()}
                />
                <ActionItem
                    icon={Flag}
                    label="Report User"
                    color={colors.accent}
                    onPress={() => {
                        router.back();
                        router.push('/report');
                    }}
                />
                <ActionItem
                    icon={UserMinus}
                    label="Unfollow"
                    onPress={() => router.back()}
                />

                <TouchableOpacity style={[styles.cancelBtn, { backgroundColor: colors.surfaceAlt }]} onPress={() => router.back()}>
                    <Text style={[styles.cancelText, { color: colors.text }]}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    content: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
        borderTopWidth: 1,
    },
    handle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#ccc',
        alignSelf: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 20,
        textAlign: 'center',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        gap: 16,
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
    },
    cancelBtn: {
        marginTop: 20,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    cancelText: {
        fontSize: 16,
        fontWeight: '700',
    },
});
