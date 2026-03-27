import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../src/hooks/useTheme';

interface BadgeProps {
    label: string | number;
    variant?: 'primary' | 'secondary' | 'error' | 'success';
    style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'primary', style }) => {
    const { colors } = useTheme();

    const getBgColor = () => {
        switch (variant) {
            case 'primary': return colors.primary;
            case 'secondary': return colors.surfaceAlt;
            case 'error': return colors.error;
            case 'success': return colors.success;
            default: return colors.primary;
        }
    };

    const getTextColor = () => {
        switch (variant) {
            case 'primary':
            case 'error':
            case 'success':
                return 'white';
            case 'secondary':
                return colors.text;
            default:
                return 'white';
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: getBgColor() }, style]}>
            <Text style={[styles.text, { color: getTextColor() }]}>{label}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 20,
    },
    text: {
        fontSize: 10,
        fontWeight: '800',
    },
});
