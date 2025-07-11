import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, ViewStyle } from 'react-native';
import { User } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';

interface AvatarProps {
  uri?: string;
  size?: number;
  onPress?: () => void;
  style?: ViewStyle;
}

export const Avatar = ({ uri, size = 40, onPress, style }: AvatarProps) => {
  const content = uri ? (
    <Image
      source={{ uri }}
      style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
    />
  ) : (
    <View
      style={[
        styles.placeholder,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <User size={size * 0.6} color={COLORS.white} />
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={[{ width: size, height: size }, style]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={[{ width: size, height: size }, style]}>{content}</View>;
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