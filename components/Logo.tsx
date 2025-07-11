import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@/constants/colors';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showTagline?: boolean;
}

export const Logo = ({ size = 'medium', showTagline = false }: LogoProps) => {
  const getFontSize = () => {
    switch (size) {
      case 'small':
        return 20;
      case 'medium':
        return 28;
      case 'large':
        return 36;
      default:
        return 28;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.logo, { fontSize: getFontSize() }]}>Aakar</Text>
      {showTagline && <Text style={styles.tagline}>Craft your vision</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  logo: {
    fontWeight: 'bold',
    color: COLORS.primary,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 12,
    color: COLORS.darkGray,
    marginTop: 2,
  },
});