import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { useTheme } from '../src/hooks/useTheme';
import { ArrowLeft, Flag, CheckCircle2, ChevronRight, Upload } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Button } from '../src/components/atoms/Button';

export default function ReportScreen() {
    const { colors, typography, spacing } = useTheme();
    const router = useRouter();
    const [selectedReason, setSelectedReason] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const reasons = [
        'Spam or misleading',
        'Inappropriate content',
        'Harassment or hate speech',
        'Copyright violation',
        'Something else'
    ];

    const handleSubmit = () => {
        if (!selectedReason) return;
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={styles.successContent}>
                    <View style={[styles.successIcon, { backgroundColor: colors.success + '15' }]}>
                        <CheckCircle2 size={60} color={colors.success} />
                    </View>
                    <Text style={[styles.title, { color: colors.text }]}>Report Submitted</Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                        Thank you for helping us keep Aakar safe. Our team will review this report as soon as possible.
                    </Text>
                    <Button
                        title="Back to Home"
                        onPress={() => router.replace('/(tabs)')}
                        style={{ width: '100%', marginTop: 32 }}
                    />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                    <ArrowLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>Report</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Why are you reporting this?</Text>
                    <View style={styles.reasonsList}>
                        {reasons.map((reason) => (
                            <TouchableOpacity
                                key={reason}
                                onPress={() => setSelectedReason(reason)}
                                style={[
                                    styles.reasonItem,
                                    {
                                        backgroundColor: colors.surfaceAlt,
                                        borderColor: selectedReason === reason ? colors.primary : 'transparent',
                                        borderWidth: 2
                                    }
                                ]}
                            >
                                <Text style={[
                                    styles.reasonText,
                                    { color: selectedReason === reason ? colors.primary : colors.text }
                                ]}>
                                    {reason}
                                </Text>
                                {selectedReason === reason && <CheckCircle2 size={20} color={colors.primary} />}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Additional Details</Text>
                    <TextInput
                        placeholder="Tell us more about the issue..."
                        placeholderTextColor={colors.textSecondary}
                        style={[styles.input, { color: colors.text, backgroundColor: colors.surfaceAlt }]}
                        multiline
                        value={description}
                        onChangeText={setDescription}
                    />
                </View>

                <TouchableOpacity style={[styles.uploadSection, { backgroundColor: colors.surfaceAlt }]}>
                    <Upload size={24} color={colors.textSecondary} />
                    <Text style={[styles.uploadText, { color: colors.textSecondary }]}>Attach Screenshot (Optional)</Text>
                </TouchableOpacity>

                <Button
                    title="Submit Report"
                    onPress={handleSubmit}
                    disabled={!selectedReason}
                    style={styles.submitBtn}
                />
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
    successContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    successIcon: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 12,
        lineHeight: 24,
    },
    scrollContent: {
        padding: 24,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 20,
    },
    reasonsList: {
        gap: 12,
    },
    reasonItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 18,
        borderRadius: 16,
    },
    reasonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    input: {
        minHeight: 120,
        borderRadius: 16,
        padding: 16,
        fontSize: 16,
        textAlignVertical: 'top',
    },
    uploadSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 16,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#ccc',
        marginBottom: 40,
        gap: 12,
    },
    uploadText: {
        fontSize: 14,
        fontWeight: '600',
    },
    submitBtn: {
        width: '100%',
    },
});
