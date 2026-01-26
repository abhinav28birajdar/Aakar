import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, User, Lock, Bell, Eye, HelpCircle, Info, LogOut, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
    const { colors, theme, toggleTheme } = useTheme();
    const { signOut } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut();
    };

    const SettingItem = ({ icon: Icon, label, value, onPress, isSwitch, switchValue, onSwitchChange }: any) => (
        <TouchableOpacity
            onPress={onPress}
            disabled={isSwitch}
            style={[styles.item, { borderBottomColor: colors.border }]}
        >
            <View style={styles.itemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: colors.surfaceAlt }]}>
                    <Icon size={20} color={colors.text} />
                </View>
                <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
            </View>
            <View style={styles.itemRight}>
                {isSwitch ? (
                    <Switch
                        value={switchValue}
                        onValueChange={onSwitchChange}
                        trackColor={{ false: colors.border, true: colors.primary }}
                    />
                ) : (
                    <>
                        {value && <Text style={[styles.value, { color: colors.textSecondary }]}>{value}</Text>}
                        <ChevronRight size={20} color={colors.textSecondary} />
                    </>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Account</Text>
                    <SettingItem icon={User} label="Personal Information" onPress={() => router.push('/edit-profile')} />
                    <SettingItem icon={Lock} label="Security" />
                    <SettingItem icon={Bell} label="Notifications" onPress={() => router.push('/notifications')} />
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Preferences</Text>
                    <SettingItem
                        icon={Eye}
                        label="Dark Mode"
                        isSwitch
                        switchValue={theme === 'dark'}
                        onSwitchChange={toggleTheme}
                    />
                    <SettingItem icon={Info} label="Language" value="English" />
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Support</Text>
                    <SettingItem icon={HelpCircle} label="Help Center" onPress={() => router.push('/help')} />
                    <SettingItem icon={Info} label="About Aakar" />
                </View>

                <TouchableOpacity
                    onPress={handleLogout}
                    style={[styles.logoutButton, { backgroundColor: colors.surfaceAlt }]}
                >
                    <LogOut size={20} color={colors.error} />
                    <Text style={[styles.logoutText, { color: colors.error }]}>Log Out</Text>
                </TouchableOpacity>

                <Text style={[styles.version, { color: colors.textMuted }]}>Version 1.0.0 (Build 124)</Text>
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
    backButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
    },
    section: {
        marginTop: 24,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
        paddingLeft: 4,
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
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
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 24,
        marginTop: 40,
        padding: 16,
        borderRadius: 16,
        gap: 12,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '700',
    },
    version: {
        textAlign: 'center',
        fontSize: 12,
    },
});
