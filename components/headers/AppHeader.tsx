import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/hooks/useTheme';
import { ArrowLeft, MoreVertical } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface AppHeaderProps {
    title?: string;
    showBack?: boolean;
    rightElement?: React.ReactNode;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ title, showBack = true, rightElement }) => {
    const { colors } = useTheme();
    const router = useRouter();

    return (
        <SafeAreaView style={{ backgroundColor: colors.background }}>
            <View style={[styles.container, { borderBottomColor: colors.border }]}>
                <View style={styles.left}>
                    {showBack && (
                        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                            <ArrowLeft size={24} color={colors.text} />
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.center}>
                    {title && <Text style={[styles.title, { color: colors.text }]}>{title}</Text>}
                </View>

                <View style={styles.right}>
                    {rightElement ? rightElement : (
                        <TouchableOpacity style={styles.iconBtn}>
                            <MoreVertical size={24} color={colors.text} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    left: {
        flex: 1,
        alignItems: 'flex-start',
    },
    center: {
        flex: 3,
        alignItems: 'center',
    },
    right: {
        flex: 1,
        alignItems: 'flex-end',
    },
    title: {
        fontSize: 18,
        fontWeight: '800',
    },
    iconBtn: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
