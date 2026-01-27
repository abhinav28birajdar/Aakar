import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useTheme } from '../src/hooks/useTheme';
import { ArrowLeft, User, Lock, Bell, Eye, HelpCircle, Info, LogOut, ChevronRight, Shield, Database, Globe, Zap } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';

export default function SettingsScreen() {
    const { colors, typography, spacing, isDark } = useTheme();
    const router = useRouter();

    const [notifications, setNotifications] = useState(true);
    const [biometric, setBiometric] = useState(false);

    const SettingItem = ({ icon: Icon, label, value, onPress, isSwitch, switchValue, onSwitchChange, isDestructive }: any) => (
        <TouchableOpacity
            onPress={onPress}
            disabled={isSwitch}
            style={[styles.item, { borderBottomColor: colors.border }]}
        >
            <View style={styles.itemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: isDestructive ? colors.error + '10' : colors.surfaceAlt }]}>
                    <Icon size={20} color={isDestructive ? colors.error : colors.text} />
                </View>
                <Text style={[styles.label, { color: isDestructive ? colors.error : colors.text }]}>{label}</Text>
            </View>
            <View style={styles.itemRight}>
                {isSwitch ? (
                    <Switch
                        value={switchValue}
                        onValueChange={onSwitchChange}
                        trackColor={{ true: colors.primary, false: colors.border }}
                        thumbColor="white"
                    />
                ) : (
                    <>
                        {value && <Text style={[styles.value, { color: colors.textSecondary }]}>{value}</Text>}
                        <ChevronRight size={18} color={colors.textSecondary} />
                    </>
                )}
            </View>
        </TouchableOpacity>
    );

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to log out?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', style: 'destructive', onPress: () => router.replace('/(auth)/sign-in') }
        ]);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                    <ArrowLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Account Settings</Text>
                    <SettingItem
                        icon={User}
                        label="Personal Information"
                        onPress={() => router.push('/edit-profile')}
                    />
                    <SettingItem icon={Lock} label="Security & Password" />
                    <SettingItem
                        icon={Bell}
                        label="Push Notifications"
                        isSwitch
                        switchValue={notifications}
                        onSwitchChange={setNotifications}
                    />
                    <SettingItem icon={Shield} label="Privacy Center" />
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>App Preferences</Text>
                    <SettingItem icon={Eye} label="Appearance" value={isDark ? 'Dark' : 'Light'} />
                    <SettingItem icon={Globe} label="Language" value="English (US)" />
                    <SettingItem icon={Database} label="Data & Storage" />
                    <SettingItem icon={Zap} label="Performance Mode" isSwitch switchValue={false} />
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Support & Legal</Text>
                    <SettingItem icon={HelpCircle} label="Help Center" />
                    <SettingItem icon={Info} label="Terms of Service" />
                    <SettingItem icon={Shield} label="Privacy Policy" />
                </View>

                <View style={styles.section}>
                    <SettingItem
                        icon={LogOut}
                        label="Log Out"
                        onPress={handleLogout}
                        isDestructive
                    />
                </View>

                <View style={styles.footer}>
                    <Text style={[styles.versionText, { color: colors.textMuted }]}>Aakar Design Community</Text>
                    <Text style={[styles.versionText, { color: colors.textMuted }]}>Version 1.0.4 (2024)</Text>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
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
        padding: 16,
    },
    iconButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    section: {
        marginTop: 24,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 12,
        paddingLeft: 4,
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    iconContainer: {
        width: 42,
        height: 42,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
    },
    itemRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    value: {
        fontSize: 14,
        fontWeight: '500',
    },
    footer: {
        marginTop: 48,
        alignItems: 'center',
        gap: 4,
    },
    versionText: {
        fontSize: 12,
        fontWeight: '500',
    },
});
