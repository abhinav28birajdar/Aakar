import React from 'react';
import { View, StyleSheet, useWindowDimensions, ViewStyle } from 'react-native';

interface ResponsiveContainerProps {
    children: React.ReactNode;
    style?: ViewStyle;
    maxWidth?: number;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
    children,
    style,
    maxWidth = 800,
}) => {
    const { width } = useWindowDimensions();
    const isLargeScreen = width > maxWidth;

    return (
        <View
            style={[
                styles.container,
                isLargeScreen && { maxWidth, alignSelf: 'center', width: '100%' },
                style,
            ]}
        >
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
