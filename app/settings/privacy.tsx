import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Switch, ScrollView } from 'react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { AppHeader } from '../../components/headers/AppHeader';

export default function PrivacyScreen() {
    const { colors } = useTheme();
    const [publicProfile, setPublicProfile] = useState(true);
    const [showActivity, setShowActivity] = useState(true);
    const [allowMentions, setAllowMentions] = useState(true);

    const SwitchItem = ({ label, desc, value, onChange }: any) => (
        <View style={[styles.item, { borderBottomColor: colors.border }]}>
            <View style={styles.textContainer}>
                <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
                <Text style={[styles.desc, { color: colors.textSecondary }]}>{desc}</Text>
            </View>
            <Switch
                value={value}
                onValueChange={onChange}
                trackColor={{ false: colors.textMuted + '40', true: colors.primary }}
                thumbColor={'white'}
            />
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <AppHeader title="Privacy" />
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={[styles.sectionTitle, { color: colors.primary }]}>Profile Visibility</Text>

                <SwitchItem
                    label="Public Profile"
                    desc="Allow anyone to see your profile and designs."
                    value={publicProfile}
                    onChange={setPublicProfile}
                />

                <SwitchItem
                    label="Show Activity Status"
                    desc="Let others see when you're online."
                    value={showActivity}
                    onChange={setShowActivity}
                />

                <View style={{ height: 30 }} />

                <Text style={[styles.sectionTitle, { color: colors.primary }]}>Interactions</Text>

                <SwitchItem
                    label="Allow Mentions"
                    desc="People can mention you in comments and posts."
                    value={allowMentions}
                    onChange={setAllowMentions}
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
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 16,
        textTransform: 'uppercase',
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        marginBottom: 8,
    },
    textContainer: {
        flex: 1,
        paddingRight: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    desc: {
        fontSize: 14,
        lineHeight: 20,
    },
});
