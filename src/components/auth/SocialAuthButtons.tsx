// ============================================================
// Social Auth Buttons Component
// Google & Apple Sign-In Buttons
// ============================================================
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { Chrome, Apple, Phone } from 'lucide-react-native';
import { useTheme } from '../../hooks/useTheme';
interface SocialAuthButtonsProps {
    onGooglePress: () => void;
    onApplePress: () => void;
    onPhonePress?: () => void;
    isLoading?: boolean;
    disabled?: boolean;
}

export const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({
    onGooglePress,
    onApplePress,
    onPhonePress,
    isLoading = false,
    disabled = false,
}) => {
    const { colors } = useTheme();

    return (
        <View style={styles.container}>
            {/* Social Buttons Row */}
            <View style={styles.buttonsRow}>
                {/* Google Sign-In */}
                <TouchableOpacity
                    style={[styles.socialButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    onPress={onGooglePress}
                    disabled={isLoading || disabled}
                    activeOpacity={0.7}
                >
                    <Chrome size={20} color={colors.text} />
                    <Text style={[styles.socialButtonText, { color: colors.text }]}>Google</Text>
                </TouchableOpacity>

                {/* Apple Sign-In (iOS only) */}
                {Platform.OS === 'ios' && (
                    <TouchableOpacity
                        style={[styles.socialButton, { backgroundColor: colors.text, borderColor: colors.text }]}
                        onPress={onApplePress}
                        disabled={isLoading || disabled}
                        activeOpacity={0.7}
                    >
                        <Apple size={20} color={colors.background} />
                        <Text style={[styles.socialButtonText, { color: colors.background }]}>Apple</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Phone Login Button */}
            {onPhonePress && (
                <TouchableOpacity
                    style={[
                        styles.socialButton,
                        {
                            backgroundColor: colors.surface,
                            borderColor: colors.border,
                            marginTop: 12,
                            width: '100%'
                        }
                    ]}
                    onPress={onPhonePress}
                    disabled={isLoading || disabled}
                    activeOpacity={0.7}
                >
                    <Phone size={20} color={colors.text} />
                    <Text style={[styles.socialButtonText, { color: colors.text }]}>Continue with Phone</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 12,
    },
    buttonsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    socialButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 54,
        borderRadius: 14,
        borderWidth: 1,
        gap: 10,
    },
    socialButtonText: {
        fontSize: 15,
        fontWeight: '600',
    },
});
