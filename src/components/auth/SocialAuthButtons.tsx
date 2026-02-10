// ============================================================
// Social Auth Buttons Component
// Google & Apple Sign-In Buttons
// ============================================================
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../hooks/useTheme';

interface SocialAuthButtonsProps {
    onGooglePress: () => void;
    onApplePress: () => void;
    isLoading?: boolean;
    disabled?: boolean;
}

export const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({
    onGooglePress,
    onApplePress,
    isLoading = false,
    disabled = false,
}) => {
    const { colors } = useTheme();

    return (
        <View style={styles.container}>
            {/* Divider */}
            <View style={styles.divider}>
                <View style={[styles.line, { backgroundColor: colors.border }]} />
                <Text style={[styles.dividerText, { color: colors.textMuted }]}>or continue with</Text>
                <View style={[styles.line, { backgroundColor: colors.border }]} />
            </View>

            {/* Social Buttons */}
            <View style={styles.buttonsRow}>
                {/* Google Sign-In */}
                <TouchableOpacity
                    style={[styles.socialButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    onPress={onGooglePress}
                    disabled={isLoading || disabled}
                    activeOpacity={0.7}
                >
                    {isLoading ? (
                        <ActivityIndicator size="small" color={colors.primary} />
                    ) : (
                        <>
                            <GoogleIcon />
                            <Text style={[styles.socialButtonText, { color: colors.text }]}>Google</Text>
                        </>
                    )}
                </TouchableOpacity>

                {/* Apple Sign-In (iOS only) */}
                {Platform.OS === 'ios' && (
                    <TouchableOpacity
                        style={[styles.socialButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                        onPress={onApplePress}
                        disabled={isLoading || disabled}
                        activeOpacity={0.7}
                    >
                        {isLoading ? (
                            <ActivityIndicator size="small" color={colors.primary} />
                        ) : (
                            <>
                                <AppleIcon />
                                <Text style={[styles.socialButtonText, { color: colors.text }]}>Apple</Text>
                            </>
                        )}
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

// Google Icon SVG Component
const GoogleIcon = () => (
    <View style={styles.iconContainer}>
        <svg width="20" height="20" viewBox="0 0 24 24">
            <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
        </svg>
    </View>
);

// Apple Icon Component
const AppleIcon = () => (
    <View style={styles.iconContainer}>
        <Text style={{ fontSize: 20 }}>🍎</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        marginVertical: 24,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    line: {
        flex: 1,
        height: 1,
    },
    dividerText: {
        marginHorizontal: 16,
        fontSize: 14,
        fontWeight: '500',
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
        borderRadius: 12,
        borderWidth: 1.5,
        gap: 10,
    },
    socialButtonText: {
        fontSize: 15,
        fontWeight: '600',
    },
    iconContainer: {
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
