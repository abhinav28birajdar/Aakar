import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/hooks/useTheme';
import { Button } from '../../components/ui/Button';
import { Bell, Camera, Image as ImageIcon, ShieldCheck } from 'lucide-react-native';
import { MotiView } from 'moti';

export default function PermissionsScreen() {
    const { colors } = useTheme();
    const router = useRouter();

    const PermissionItem = ({ icon: Icon, title, desc }: any) => (
        <View style={styles.item}>
            <View style={[styles.iconBox, { backgroundColor: colors.surfaceAlt }]}>
                <Icon size={24} color={colors.primary} />
            </View>
            <View style={styles.textBox}>
                <Text style={[styles.itemTitle, { color: colors.text }]}>{title}</Text>
                <Text style={[styles.itemDesc, { color: colors.textSecondary }]}>{desc}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.content}>
                <MotiView
                    from={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={styles.hero}
                >
                    <ShieldCheck size={80} color={colors.primary} />
                    <Text style={[styles.title, { color: colors.text }]}>Data Privacy</Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                        To provide the best experience, we need access to a few things.
                    </Text>
                </MotiView>

                <View style={styles.list}>
                    <PermissionItem
                        icon={Bell}
                        title="Notifications"
                        desc="Stay updated with new designs, likes and messages."
                    />
                    <PermissionItem
                        icon={ImageIcon}
                        title="Photo Library"
                        desc="Upload your beautiful designs and change profile picture."
                    />
                    <PermissionItem
                        icon={Camera}
                        title="Camera"
                        desc="Take photos directly for your posts or profile."
                    />
                </View>
            </View>

            <View style={styles.footer}>
                <Button
                    title="Allow & Continue"
                    onPress={() => router.replace('/(auth)/register')}
                    style={styles.btn}
                />
                <TouchableOpacity onPress={() => router.replace('/(auth)/register')}>
                    <Text style={[styles.later, { color: colors.textSecondary }]}>I'll do it later</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 32,
        paddingTop: 40,
    },
    hero: {
        alignItems: 'center',
        marginBottom: 48,
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        marginTop: 20,
    },
    subtitle: {
        fontSize: 15,
        textAlign: 'center',
        marginTop: 12,
        lineHeight: 22,
    },
    list: {
        gap: 24,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    iconBox: {
        width: 50,
        height: 50,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textBox: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    itemDesc: {
        fontSize: 13,
        marginTop: 2,
    },
    footer: {
        padding: 40,
        gap: 16,
        alignItems: 'center',
    },
    btn: {
        width: '100%',
    },
    later: {
        fontSize: 14,
        fontWeight: '700',
    },
});
