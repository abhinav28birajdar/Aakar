import { borderRadius, colors, components, shadows } from '@/lib/design-system/tokens';
import { useTheme } from '@/lib/store/theme';
import { MotiView } from 'moti';
import { forwardRef, ReactNode } from 'react';
import {
    ActivityIndicator,
    Text,
    TextStyle,
    TouchableOpacity,
    TouchableOpacityProps,
    View,
    ViewStyle,
} from 'react-native';

export interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  animate?: boolean;
}

export const Button = forwardRef<TouchableOpacity, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  style,
  textStyle,
  animate = true,
  onPress,
  onPressIn,
  onPressOut,
  ...props
}, ref) => {
  const { isDark, colors: themeColors, reducedMotion } = useTheme();

  const getVariantStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: borderRadius.lg,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: components.button.height[size],
      paddingHorizontal: size === 'sm' ? 12 : size === 'md' ? 16 : size === 'lg' ? 20 : 24,
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: disabled ? colors.gray[300] : colors.primary[500],
          ...(!disabled && shadows.sm),
        };
      
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: disabled 
            ? colors.gray[100] 
            : isDark 
              ? colors.gray[800] 
              : colors.gray[100],
          borderWidth: 1,
          borderColor: disabled 
            ? colors.gray[200] 
            : isDark 
              ? colors.gray[700] 
              : colors.gray[200],
        };
      
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: disabled ? colors.gray[300] : colors.primary[500],
        };
      
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
      
      case 'destructive':
        return {
          ...baseStyle,
          backgroundColor: disabled ? colors.gray[300] : colors.error[500],
          ...(!disabled && shadows.sm),
        };
      
      default:
        return baseStyle;
    }
  };

  const getTextStyles = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      fontFamily: 'Inter_600SemiBold',
      fontSize: components.button.fontSize[size],
      fontWeight: '600',
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseTextStyle,
          color: disabled ? colors.gray[500] : '#ffffff',
        };
      
      case 'secondary':
        return {
          ...baseTextStyle,
          color: disabled 
            ? colors.gray[400] 
            : isDark 
              ? themeColors.text.primary 
              : themeColors.text.primary,
        };
      
      case 'outline':
        return {
          ...baseTextStyle,
          color: disabled ? colors.gray[400] : colors.primary[500],
        };
      
      case 'ghost':
        return {
          ...baseTextStyle,
          color: disabled 
            ? colors.gray[400] 
            : isDark 
              ? themeColors.text.primary 
              : themeColors.text.primary,
        };
      
      case 'destructive':
        return {
          ...baseTextStyle,
          color: disabled ? colors.gray[500] : '#ffffff',
        };
      
      default:
        return baseTextStyle;
    }
  };

  const handlePressIn = (event: any) => {
    onPressIn?.(event);
  };

  const handlePressOut = (event: any) => {
    onPressOut?.(event);
  };

  const isDisabled = disabled || loading;

  const buttonContent = (
    <View
      style={[
        getVariantStyles(),
        fullWidth && { width: '100%' },
        style,
      ]}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'destructive' ? '#ffffff' : colors.primary[500]}
          style={{ marginRight: children ? 8 : 0 }}
        />
      )}
      
      {leftIcon && !loading && (
        <View style={{ marginRight: children ? 8 : 0 }}>
          {leftIcon}
        </View>
      )}
      
      {children && (
        <Text style={[getTextStyles(), textStyle]}>
          {children}
        </Text>
      )}
      
      {rightIcon && !loading && (
        <View style={{ marginLeft: children ? 8 : 0 }}>
          {rightIcon}
        </View>
      )}
    </View>
  );

  if (animate && !reducedMotion) {
    return (
      <MotiView
        from={{ scale: 1 }}
        animate={{ scale: 1 }}
        transition={{
          type: 'timing',
          duration: 150,
        }}
      >
        <TouchableOpacity
          ref={ref}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={isDisabled}
          activeOpacity={0.8}
          {...props}
        >
          {buttonContent}
        </TouchableOpacity>
      </MotiView>
    );
  }

  return (
    <TouchableOpacity
      ref={ref}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      activeOpacity={0.8}
      {...props}
    >
      {buttonContent}
    </TouchableOpacity>
  );
});

Button.displayName = 'Button';