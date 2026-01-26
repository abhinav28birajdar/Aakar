import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
    Platform
} from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface CustomButtonProps {
    onPress: () => void;
    title: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    icon?: React.ReactNode;
}

export const Button: React.FC<CustomButtonProps> = ({
    onPress,
    title,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    style,
    textStyle,
    icon,
}) => {
    const { colors, spacing, borderRadius, typography } = useTheme();

    const getVariantStyles = () => {
        switch (variant) {
            case 'primary':
                return { backgroundColor: colors.primary };
            case 'secondary':
                return { backgroundColor: colors.surfaceAlt };
            case 'outline':
                return { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border };
            case 'ghost':
                return { backgroundColor: 'transparent' };
            case 'destructive':
                return { backgroundColor: colors.error };
            default:
                return { backgroundColor: colors.primary };
        }
    };

    const getTextStyle = () => {
        const baseStyle: TextStyle = { ...typography.bodyMedium };
        switch (variant) {
            case 'primary':
            case 'destructive':
                return { ...baseStyle, color: colors.white };
            case 'outline':
            case 'ghost':
            case 'secondary':
                return { ...baseStyle, color: colors.text };
            default:
                return { ...baseStyle, color: colors.white };
        }
    };

    const getSizeStyles = () => {
        switch (size) {
            case 'sm':
                return { paddingVertical: spacing.xs, paddingHorizontal: spacing.md, height: 36 };
            case 'lg':
                return { paddingVertical: spacing.md, paddingHorizontal: spacing.xl, height: 56 };
            default:
                return { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg, height: 48 };
        }
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            style={[
                styles.button,
                getVariantStyles(),
                getSizeStyles(),
                disabled && { opacity: 0.5 },
                style,
            ]}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'primary' || variant === 'destructive' ? colors.white : colors.primary} />
            ) : (
                <>
                    {icon}
                    <Text style={[getTextStyle(), icon ? { marginLeft: spacing.sm } : {}, textStyle]}>
                        {title}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
});
