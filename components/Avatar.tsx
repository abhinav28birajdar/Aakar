import { COLORS } from '@/constants/colors';
import { User } from 'lucide-react-native';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';

interface AvatarProps {
  uri?: string;
  size?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  onPress?: () => void;
  style?: ViewStyle;
  fallback?: string;
}

const sizeMap = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 56,
};

export const Avatar = ({ uri, size = 40, onPress, style, fallback }: AvatarProps) => {
  const sizeValue = typeof size === 'string' ? sizeMap[size] : size;
  const borderRadius = sizeValue / 2;
  const content = uri ? (
    <Image
      source={{ uri }}
      style={[styles.image, { width: sizeValue, height: sizeValue, borderRadius }]}
    />
  ) : (
    <View
      style={[
        styles.placeholder,
        { width: sizeValue, height: sizeValue, borderRadius },
      ]}
    >
      <User size={sizeValue * 0.6} color={COLORS.white} />
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={[{ width: sizeValue, height: sizeValue }, style]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={[{ width: sizeValue, height: sizeValue }, style]}>{content}</View>;
};

const styles = StyleSheet.create({
  image: {
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  placeholder: {
    backgroundColor: COLORS.darkGray,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.black,
  },
});