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
import { THEME } from '../../constants/theme';
import { useTheme } from '../../src/hooks/useTheme';

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
    const { colors } = useTheme();

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
        const baseStyle: TextStyle = { fontSize: 16, fontWeight: '700' };
        switch (variant) {
            case 'primary':
            case 'destructive':
                return { ...baseStyle, color: 'white' };
            case 'outline':
            case 'ghost':
            case 'secondary':
                return { ...baseStyle, color: colors.text };
            default:
                return { ...baseStyle, color: 'white' };
        }
    };

    const getSizeStyles = () => {
        switch (size) {
            case 'sm':
                return { paddingVertical: 8, paddingHorizontal: 16, height: 36 };
            case 'lg':
                return { paddingVertical: 16, paddingHorizontal: 32, height: 56 };
            default:
                return { paddingVertical: 12, paddingHorizontal: 24, height: 48 };
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
                <ActivityIndicator color={variant === 'primary' || variant === 'destructive' ? 'white' : colors.primary} />
            ) : (
                <>
                    {icon}
                    <Text style={[getTextStyle(), icon ? { marginLeft: 8 } : {}, textStyle]}>
                        {title}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
