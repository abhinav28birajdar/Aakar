// ============================================================
// Image Preview Modal
// ============================================================
import React from 'react';
import {
  View, StyleSheet, Image, TouchableOpacity, Dimensions, StatusBar,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { X, Download, Share2 } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function ImagePreviewModal() {
  const router = useRouter();
  const { imageUrl } = useLocalSearchParams<{ imageUrl: string }>();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />

      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <X size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.topRight}>
          <TouchableOpacity style={styles.iconBtn}>
            <Share2 size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Download size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center' },
  image: { width, height: height * 0.8 },
  topBar: { position: 'absolute', top: 60, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between' },
  topRight: { flexDirection: 'row', gap: 12 },
  iconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
});
