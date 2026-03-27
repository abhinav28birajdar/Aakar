import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useTheme } from '../src/hooks/useTheme';
import { ArrowLeft, Search, HelpCircle, MessageSquare, Book, Shield, PlayCircle, ChevronRight, Mail } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function HelpScreen() {
    const { colors, typography, spacing } = useTheme();
    const router = useRouter();

    const HelpCategory = ({ icon: Icon, title, description }: any) => (
        <TouchableOpacity style={[styles.helpCategory, { backgroundColor: colors.surfaceAlt }]}>
            <View style={[styles.iconBox, { backgroundColor: colors.primary + '15' }]}>
                <Icon size={24} color={colors.primary} />
            </View>
            <View style={styles.helpText}>
                <Text style={[styles.helpTitle, { color: colors.text }]}>{title}</Text>
                <Text style={[styles.helpDesc, { color: colors.textSecondary }]}>{description}</Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                    <ArrowLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>Help Center</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.searchSection}>
                    <Text style={[styles.heroTitle, { color: colors.text }]}>How can we help you?</Text>
                    <View style={[styles.searchBar, { backgroundColor: colors.surfaceAlt }]}>
                        <Search size={20} color={colors.textSecondary} />
                        <TextInput
                            placeholder="Search help articles..."
                            placeholderTextColor={colors.textSecondary}
                            style={[styles.input, { color: colors.text }]}
                        />
                    </View>
                </View>

                <View style={styles.categoriesSection}>
                    <HelpCategory
                        icon={Book}
                        title="Getting Started"
                        description="Learn the basics of using Aakar"
                    />
                    <HelpCategory
                        icon={Shield}
                        title="Privacy & Security"
                        description="Managing your account safety"
                    />
                    <HelpCategory
                        icon={MessageSquare}
                        title="Community Guidelines"
                        description="Rules for a healthy community"
                    />
                    <HelpCategory
                        icon={PlayCircle}
                        title="Video Tutorials"
                        description="Watch and learn design tips"
                    />
                </View>

                <View style={styles.contactSection}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Still need help?</Text>
                    <TouchableOpacity style={[styles.contactCard, { backgroundColor: colors.primary }]}>
                        <Mail size={24} color="white" />
                        <View style={styles.contactText}>
                            <Text style={styles.contactTitle}>Contact Support</Text>
                            <Text style={styles.contactDesc}>We usually respond within 2 hours</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.faqSection}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Popular FAQs</Text>
                    {[
                        'How to change my bio?',
                        'Can I upload multiple images?',
                        'How to verify my account?',
                        'Is my data secure?'
                    ].map((faq, i) => (
                        <TouchableOpacity key={i} style={[styles.faqItem, { borderBottomColor: colors.border }]}>
                            <Text style={[styles.faqText, { color: colors.text }]}>{faq}</Text>
                            <ChevronRight size={18} color={colors.textSecondary} />
                        </TouchableOpacity>
                    ))}
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
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    searchSection: {
        marginTop: 20,
        marginBottom: 32,
    },
    heroTitle: {
        fontSize: 28,
        fontWeight: '800',
        marginBottom: 20,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 56,
        borderRadius: 16,
        gap: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
    },
    categoriesSection: {
        gap: 16,
    },
    helpCategory: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 20,
        gap: 16,
    },
    iconBox: {
        width: 52,
        height: 52,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    helpText: {
        flex: 1,
    },
    helpTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    helpDesc: {
        fontSize: 13,
        marginTop: 2,
    },
    contactSection: {
        marginTop: 32,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 16,
    },
    contactCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 24,
        gap: 20,
    },
    contactText: {
        flex: 1,
    },
    contactTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700',
    },
    contactDesc: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        marginTop: 2,
    },
    faqSection: {
        marginTop: 32,
    },
    faqItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 18,
        borderBottomWidth: 1,
    },
    faqText: {
        fontSize: 15,
        fontWeight: '600',
    },
});
