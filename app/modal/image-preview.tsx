import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from '../../src/hooks/useTheme';
import { X, Share2, Download } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function ImagePreviewModal() {
    const { colors } = useTheme();
    const router = useRouter();
    const { uri } = useLocalSearchParams();

    if (!uri) return null;

    return (
        <View style={[styles.container, { backgroundColor: 'black' }]}>
            <Image
                source={{ uri: uri as string }}
                style={styles.image}
                contentFit="contain"
            />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                    <X size={24} color="white" />
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.footerBtn}>
                    <Share2 size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerBtn}>
                    <Download size={24} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: width,
        height: height,
    },
    header: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 10,
    },
    iconBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        position: 'absolute',
        bottom: 50,
        right: 20,
        flexDirection: 'column',
        gap: 16,
    },
    footerBtn: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
