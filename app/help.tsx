import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { ArrowLeft, ChevronRight, HelpCircle, Book, MessageSquare, Shield, Info } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function HelpScreen() {
    const { colors, typography, spacing } = useTheme();
    const router = useRouter();

    const HelpItem = ({ icon: Icon, title, description }: any) => (
        <TouchableOpacity style={[styles.item, { borderBottomColor: colors.border }]}>
            <View style={[styles.iconContainer, { backgroundColor: colors.surfaceAlt }]}>
                <Icon size={20} color={colors.primary} />
            </View>
            <View style={styles.content}>
                <Text style={[styles.itemTitle, { color: colors.text }]}>{title}</Text>
                <Text style={[styles.itemDescription, { color: colors.textSecondary }]}>{description}</Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>Help & Support</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Support Center</Text>
                    <HelpItem
                        icon={Book}
                        title="Knowledge Base"
                        description="Find articles and guides on how to use Aakar."
                    />
                    <HelpItem
                        icon={MessageSquare}
                        title="Contact Support"
                        description="Talk to our team for any issues or questions."
                    />
                    <HelpItem
                        icon={Shield}
                        title="Security & Privacy"
                        description="Learn how we protect your data and privacy."
                    />
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Community</Text>
                    <HelpItem
                        icon={HelpCircle}
                        title="Community Guidelines"
                        description="Review our community rules and standards."
                    />
                    <HelpItem
                        icon={Info}
                        title="About Aakar"
                        description="Learn more about our mission and vision."
                    />
                </View>

                <View style={styles.footer}>
                    <Text style={[styles.footerText, { color: colors.textMuted }]}>
                        Aakar v1.0.0 • Made with ❤️ for Designers
                    </Text>
                </View>
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
    scrollContent: {
        padding: 24,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 16,
        paddingLeft: 4,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    content: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    itemDescription: {
        fontSize: 14,
        lineHeight: 20,
    },
    footer: {
        marginTop: 40,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
    },
});
