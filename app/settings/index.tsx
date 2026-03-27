import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/hooks/useTheme';
import { AppHeader } from '../../components/headers/AppHeader';
import { Avatar } from '../../components/ui/Avatar';
import { ChevronRight, User, Lock, Shield, Moon, CircleHelp, LogOut } from 'lucide-react-native';

const SECTIONS = [
    {
        title: 'Account',
        items: [
            { icon: User, label: 'Profile Information', route: '/(tabs)/profile' },
            { icon: Lock, label: 'Privacy', route: '/settings/privacy' },
            { icon: Shield, label: 'Security', route: '/settings/security' },
        ]
    },
    {
        title: 'Preferences',
        items: [
            { icon: Moon, label: 'App Theme', route: '/settings/theme' },
        ]
    },
    {
        title: 'Support',
        items: [
            { icon: CircleHelp, label: 'Help & Support', route: '/settings/help' },
        ]
    }
];

export default function SettingsScreen() {
    const { colors } = useTheme();
    const router = useRouter();

    const SettingsItem = ({ icon: Icon, label, route, color }: any) => (
        <TouchableOpacity
            style={[styles.item, { backgroundColor: colors.surfaceAlt }]}
            onPress={() => route && router.push(route)}
        >
            <View style={styles.itemLeft}>
                <View style={[styles.iconBox, { backgroundColor: color ? color + '20' : colors.primary + '20' }]}>
                    <Icon size={20} color={color || colors.primary} />
                </View>
                <Text style={[styles.itemLabel, { color: color || colors.text }]}>{label}</Text>
            </View>
            <ChevronRight size={18} color={colors.textSecondary} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <AppHeader title="Settings" />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

                <View style={[styles.profileCard, { backgroundColor: colors.surfaceAlt }]}>
                    <Avatar source="https://i.pravatar.cc/150?u=1" size={70} radius={24} />
                    <View style={styles.profileInfo}>
                        <Text style={[styles.name, { color: colors.text }]}>Abhinav Birajdar</Text>
                        <Text style={[styles.username, { color: colors.textSecondary }]}>@abhinav</Text>
                        <TouchableOpacity
                            style={[styles.editBtn, { backgroundColor: colors.background }]}
                            onPress={() => router.push('/(tabs)/profile')}
                        >
                            <Text style={[styles.editBtnText, { color: colors.primary }]}>View Profile</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {SECTIONS.map((section, index) => (
                    <View key={index} style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{section.title}</Text>
                        <View style={styles.sectionItems}>
                            {section.items.map((item, i) => (
                                <SettingsItem key={i} {...item} />
                            ))}
                        </View>
                    </View>
                ))}

                <View style={styles.section}>
                    <SettingsItem
                        icon={LogOut}
                        label="Log Out"
                        color={colors.error}
                        route="/(auth)/login"
                    />
                </View>

                <Text style={[styles.version, { color: colors.textMuted }]}>Version 1.0.0 (Build 52)</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 20,
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 24,
        marginBottom: 32,
    },
    profileInfo: {
        marginLeft: 16,
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: '800',
    },
    username: {
        fontSize: 14,
        marginTop: 2,
    },
    editBtn: {
        marginTop: 12,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    editBtnText: {
        fontSize: 12,
        fontWeight: '700',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '700',
        marginBottom: 12,
        marginLeft: 4,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    sectionItems: {
        gap: 12,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 16,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemLabel: {
        fontSize: 16,
        fontWeight: '600',
    },
    version: {
        textAlign: 'center',
        fontSize: 12,
        marginTop: 12,
        marginBottom: 40,
    },
});
