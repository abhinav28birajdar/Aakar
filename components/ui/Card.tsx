import { borderRadius, colors, shadows } from '@/lib/design-system/tokens';
import { useTheme } from '@/lib/store/theme';
import { MotiView } from 'moti';
import React, { ReactNode } from 'react';
import { TouchableOpacity, TouchableOpacityProps, View, ViewStyle } from 'react-native';

export interface CardProps extends TouchableOpacityProps {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  padding?: number;
  margin?: number;
  style?: ViewStyle;
  animate?: boolean;
  pressable?: boolean;
  shadow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  size = 'md',
  padding,
  margin,
  style,
  animate = true,
  pressable = false,
  shadow = false,
  onPress,
  ...props
}) => {
  const { isDark, colors: themeColors, reducedMotion } = useTheme();

  const getPadding = () => {
    if (padding !== undefined) return padding;
    
    switch (size) {
      case 'sm':
        return 12;
      case 'md':
        return 16;
      case 'lg':
        return 24;
      default:
        return 16;
    }
  };

  const getCardStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: borderRadius.lg,
      padding: getPadding(),
      margin: margin,
    };

    const shadowStyle = shadow ? shadows.md : {};

    switch (variant) {
      case 'default':
        return {
          ...baseStyle,
          backgroundColor: isDark ? themeColors.card : themeColors.card,
          ...shadowStyle,
        };
      
      case 'elevated':
        return {
          ...baseStyle,
          backgroundColor: isDark ? themeColors.card : themeColors.card,
          ...shadows.lg,
        };
      
      case 'outlined':
        return {
          ...baseStyle,
          backgroundColor: isDark ? themeColors.card : themeColors.card,
          borderWidth: 1,
          borderColor: isDark ? colors.gray[700] : colors.gray[200],
          ...shadowStyle,
        };
      
      case 'filled':
        return {
          ...baseStyle,
          backgroundColor: isDark ? colors.gray[800] : colors.gray[50],
          ...shadowStyle,
        };
      
      default:
        return baseStyle;
    }
  };

  const cardContent = (
    <View style={[getCardStyles(), style]}>
      {children}
    </View>
  );

  if (pressable && onPress) {
    const animatedCard = animate && !reducedMotion ? (
      <MotiView
        from={{ scale: 1 }}
        animate={{ scale: 1 }}
        whileTap={{ scale: 0.98 }}
        transition={{
          type: 'timing',
          duration: 150,
        }}
      >
        {cardContent}
      </MotiView>
    ) : cardContent;

    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}
        {...props}
      >
        {animatedCard}
      </TouchableOpacity>
    );
  }

  if (animate && !reducedMotion) {
    return (
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{
          type: 'timing',
          duration: 400,
        }}
      >
        {cardContent}
      </MotiView>
    );
  }

  return cardContent;
};