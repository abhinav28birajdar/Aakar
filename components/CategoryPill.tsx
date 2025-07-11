import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '@/constants/colors';
import { TYPOGRAPHY } from '@/constants/typography';

interface CategoryPillProps {
  title: string;
  isSelected: boolean;
  onPress: () => void;
}

export const CategoryPill = ({ title, isSelected, onPress }: CategoryPillProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.pill,
        isSelected ? styles.selectedPill : styles.unselectedPill,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.pillText,
          isSelected ? styles.selectedText : styles.unselectedText,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  selectedPill: {
    backgroundColor: COLORS.primary,
  },
  unselectedPill: {
    backgroundColor: COLORS.white,
  },
  pillText: {
    ...TYPOGRAPHY.label,
    fontWeight: '600',
  },
  selectedText: {
    color: COLORS.white,
  },
  unselectedText: {
    color: COLORS.black,
  },
});