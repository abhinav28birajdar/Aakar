import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { AppHeader } from '../../components/headers/AppHeader';
import { ChevronRight, Smartphone, Key } from 'lucide-react-native';

export default function SecurityScreen() {
    const { colors } = useTheme();

    const SecurityItem = ({ icon: Icon, label, value, onPress }: any) => (
        <TouchableOpacity
            style={[styles.item, { borderBottomColor: colors.border }]}
            onPress={onPress}
        >
            <View style={styles.left}>
                <View style={[styles.iconBox, { backgroundColor: colors.surfaceAlt }]}>
                    <Icon size={20} color={colors.text} />
                </View>
                <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
            </View>
            <View style={styles.right}>
                {value && <Text style={[styles.value, { color: colors.textSecondary }]}>{value}</Text>}
                <ChevronRight size={18} color={colors.textSecondary} />
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <AppHeader title="Security" />
            <ScrollView contentContainerStyle={styles.content}>
                <SecurityItem
                    icon={Key}
                    label="Change Password"
                    value="Last changed 3mo ago"
                    onPress={() => { }}
                />
                <SecurityItem
                    icon={Smartphone}
                    label="Two-Factor Authentication"
                    value="Off"
                    onPress={() => { }}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 24,
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    iconBox: {
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
    right: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    value: {
        fontSize: 14,
    },
});
