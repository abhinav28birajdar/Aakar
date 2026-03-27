import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from '../../src/hooks/useTheme';

interface AvatarProps {
    source: string;
    size?: number;
    radius?: number;
    onPress?: () => void;
    border?: boolean;
    online?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
    source,
    size = 50,
    radius = 18,
    onPress,
    border = false,
    online = false,
}) => {
    const { colors } = useTheme();

    const Container = onPress ? TouchableOpacity : View;

    return (
        <Container onPress={onPress} style={[styles.container, { width: size, height: size }]}>
            <Image
                source={{ uri: source }}
                style={[
                    styles.image,
                    { width: size, height: size, borderRadius: radius },
                    border && { borderWidth: 2, borderColor: colors.background }
                ]}
            />
            {online && (
                <View
                    style={[
                        styles.onlineBadge,
                        {
                            backgroundColor: colors.success,
                            borderColor: colors.background,
                            width: size * 0.3,
                            height: size * 0.3,
                            borderRadius: (size * 0.3) / 2
                        }
                    ]}
                />
            )}
        </Container>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    onlineBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        borderWidth: 2,
    },
});
