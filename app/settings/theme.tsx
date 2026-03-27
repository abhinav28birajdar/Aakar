import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { AppHeader } from '../../components/headers/AppHeader';
import { Check, Moon, Sun, Monitor } from 'lucide-react-native';

export default function ThemeScreen() {
    const { colors } = useTheme();
    const [selectedTheme, setSelectedTheme] = useState('system');

    const ThemeOption = ({ id, label, icon: Icon }: any) => {
        const isSelected = selectedTheme === id;
        return (
            <TouchableOpacity
                style={[
                    styles.option,
                    {
                        backgroundColor: colors.surfaceAlt,
                        borderColor: isSelected ? colors.primary : 'transparent',
                        borderWidth: 2
                    }
                ]}
                onPress={() => setSelectedTheme(id)}
            >
                <View style={styles.optionLeft}>
                    <Icon size={24} color={isSelected ? colors.primary : colors.textSecondary} />
                    <Text style={[
                        styles.label,
                        { color: isSelected ? colors.primary : colors.text, fontWeight: isSelected ? '700' : '500' }
                    ]}>
                        {label}
                    </Text>
                </View>
                {isSelected && <Check size={20} color={colors.primary} />}
            </TouchableOpacity>
        )
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <AppHeader title="App Appearance" />
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={[styles.desc, { color: colors.textSecondary }]}>
                    Choose how Aakar looks on your device.
                </Text>

                <View style={styles.options}>
                    <ThemeOption id="light" label="Light Mode" icon={Sun} />
                    <ThemeOption id="dark" label="Dark Mode" icon={Moon} />
                    <ThemeOption id="system" label="System Default" icon={Monitor} />
                </View>
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
    desc: {
        fontSize: 16,
        marginBottom: 32,
    },
    options: {
        gap: 16,
    },
    option: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderRadius: 16,
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    label: {
        fontSize: 16,
    },
});
