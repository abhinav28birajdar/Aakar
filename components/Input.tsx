import React, { useState } from 'react';
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    TextInputProps,
    TouchableOpacity,
    Platform
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Eye, EyeOff } from 'lucide-react-native';

interface CustomInputProps extends TextInputProps {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    isPassword?: boolean;
}

export const Input: React.FC<CustomInputProps> = ({
    label,
    error,
    leftIcon,
    rightIcon,
    isPassword,
    style,
    onFocus,
    onBlur,
    ...props
}) => {
    const { colors, spacing, borderRadius, typography } = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleFocus = (e: any) => {
        setIsFocused(true);
        onFocus?.(e);
    };

    const handleBlur = (e: any) => {
        setIsFocused(false);
        onBlur?.(e);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <View style={styles.container}>
            {label && <Text style={[styles.label, { color: colors.textSecondary, marginBottom: spacing.xs }]}>{label}</Text>}
            <View
                style={[
                    styles.inputWrapper,
                    {
                        backgroundColor: colors.surface,
                        borderColor: error ? colors.error : isFocused ? colors.primary : colors.border,
                        borderRadius: 12,
                        paddingHorizontal: spacing.md,
                    },
                    style,
                ]}
            >
                {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
                <TextInput
                    style={[
                        styles.input,
                        { color: colors.text, ...typography.body },
                    ]}
                    placeholderTextColor={colors.textMuted}
                    secureTextEntry={isPassword && !showPassword}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    {...props}
                />
                {isPassword ? (
                    <TouchableOpacity onPress={togglePasswordVisibility} style={styles.iconRight}>
                        {showPassword ? (
                            <EyeOff size={20} color={colors.textSecondary} />
                        ) : (
                            <Eye size={20} color={colors.textSecondary} />
                        )}
                    </TouchableOpacity>
                ) : (
                    rightIcon && <View style={styles.iconRight}>{rightIcon}</View>
                )}
            </View>
            {error && <Text style={[styles.errorText, { color: colors.error, marginTop: spacing.xs }]}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        height: 52,
    },
    input: {
        flex: 1,
        height: '100%',
        paddingVertical: 10,
    },
    iconLeft: {
        marginRight: 10,
    },
    iconRight: {
        marginLeft: 10,
    },
    errorText: {
        fontSize: 12,
    },
});
