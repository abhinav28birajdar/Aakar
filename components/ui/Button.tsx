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
    ViewStyle,
} from 'react-native';

// Unified Button Props - supports both old and new API patterns
export interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  // Content
  title?: string; // Legacy support
  children?: ReactNode;
  
  // Variants
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'small' | 'md' | 'medium' | 'lg' | 'large' | 'xl';
  
  // States
  loading?: boolean;
  disabled?: boolean;
  
  // Layout
  fullWidth?: boolean;
  
  // Icons
  icon?: ReactNode; // Legacy support
  iconPosition?: 'left' | 'right'; // Legacy support
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  
  // Styling
  style?: ViewStyle;
  textStyle?: TextStyle;
  className?: string; // Legacy support
  
  // Animation
  animate?: boolean;
  
  // Handlers
  onPress: () => void;
}

export const Button = forwardRef<TouchableOpacity, ButtonProps>(({
  title,
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  leftIcon,
  rightIcon,
  style,
  textStyle,
  animate = true,
  onPress,
  onPressIn,
  onPressOut,
  ...props
}, ref) => {
  const { isDark, colors: themeColors, reducedMotion } = useTheme();

  // Normalize size prop
  const normalizedSize = 
    size === 'small' ? 'sm' : 
    size === 'medium' ? 'md' : 
    size === 'large' ? 'lg' : 
    size;

  // Handle legacy icon props
  const effectiveLeftIcon = leftIcon || (icon && iconPosition === 'left' ? icon : undefined);
  const effectiveRightIcon = rightIcon || (icon && iconPosition === 'right' ? icon : undefined);
  
  // Handle content (title vs children)
  const content = children || title;

  const getVariantStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: borderRadius.lg,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: components.button.height[normalizedSize as 'sm' | 'md' | 'lg' | 'xl'] || components.button.height.md,
      paddingHorizontal: normalizedSize === 'sm' ? 12 : normalizedSize === 'md' ? 16 : normalizedSize === 'lg' ? 20 : 24,
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
      fontSize: components.button.fontSize[normalizedSize as 'sm' | 'md' | 'lg' | 'xl'] || components.button.fontSize.md,
      fontWeight: '600',
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseTextStyle,
          color: disabled ? colors.gray[500] : '#ffffff',
        };
      
      case 'secondary':
      case 'ghost':
        return {
          ...baseTextStyle,
          color: disabled 
            ? colors.gray[400] 
            : themeColors.text.primary,
        };
      
      case 'outline':
        return {
          ...baseTextStyle,
          color: disabled ? colors.gray[400] : colors.primary[500],
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

  const isDisabled = disabled || loading;

  const buttonContent = (
    <>
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'destructive' ? '#ffffff' : colors.primary[500]}
          style={{ marginRight: content ? 8 : 0 }}
        />
      )}
      
      {effectiveLeftIcon && !loading && content && (
        <Text style={{ marginRight: 8 }}>
          {effectiveLeftIcon}
        </Text>
      )}
      
      {content && (
        <Text style={[getTextStyles(), textStyle]}>
          {content}
        </Text>
      )}
      
      {effectiveRightIcon && !loading && content && (
        <Text style={{ marginLeft: 8 }}>
          {effectiveRightIcon}
        </Text>
      )}
    </>
  );

  const buttonStyle = [
    getVariantStyles(),
    fullWidth && { width: '100%' },
    style,
  ];

  if (animate && !reducedMotion) {
    return (
      <MotiView
        from={{ scale: 1 }}
        animate={{ scale: 1 }}
        transition={{
          type: 'timing',
          duration: 150,
        }}
        style={fullWidth ? { width: '100%' } : undefined}
      >
        <TouchableOpacity
          ref={ref}
          onPress={onPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          disabled={isDisabled}
          activeOpacity={0.8}
          style={buttonStyle}
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
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={buttonStyle}
      {...props}
    >
      {buttonContent}
    </TouchableOpacity>
  );
});

Button.displayName = 'Button';

export default Button;
