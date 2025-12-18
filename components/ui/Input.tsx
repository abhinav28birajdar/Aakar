import { borderRadius, colors, components } from '@/lib/design-system/tokens';
import { useTheme } from '@/lib/store/theme';
import { Eye, EyeOff } from 'lucide-react-native';
import { MotiView } from 'moti';
import { forwardRef, ReactNode, useState } from 'react';
import {
    Text,
    TextInput,
    TextInputProps,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';

// Unified Input Props - supports both old and new API patterns
export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  hint?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outline';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  secureTextEntry?: boolean;
  isPassword?: boolean; // Legacy support
  disabled?: boolean;
  required?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  animate?: boolean;
}

export const Input = forwardRef<TextInput, InputProps>(({
  label,
  error,
  hint,
  size = 'md',
  variant = 'outline',
  leftIcon,
  rightIcon,
  secureTextEntry = false,
  isPassword = false, // Legacy support
  disabled = false,
  required = false,
  containerStyle,
  inputStyle,
  labelStyle,
  animate = true,
  onFocus,
  onBlur,
  ...props
}, ref) => {
  const { isDark, colors: themeColors, reducedMotion } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  
  // Handle both secureTextEntry and isPassword props
  const isSecureInput = secureTextEntry || isPassword;
  const [isPasswordVisible, setIsPasswordVisible] = useState(!isSecureInput);

  const handleFocus = (event: any) => {
    setIsFocused(true);
    onFocus?.(event);
  };

  const handleBlur = (event: any) => {
    setIsFocused(false);
    onBlur?.(event);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const getContainerStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      height: components.input.height[size],
      borderRadius: borderRadius.lg,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
    };

    const focusedStyle = isFocused ? {
      borderColor: error ? colors.error[500] : colors.primary[500],
      borderWidth: 2,
    } : {};

    const errorStyle = error ? {
      borderColor: colors.error[500],
      borderWidth: 1.5,
    } : {};

    switch (variant) {
      case 'default':
        return {
          ...baseStyle,
          borderBottomWidth: 1.5,
          borderBottomColor: error 
            ? colors.error[500] 
            : isFocused 
              ? colors.primary[500] 
              : isDark 
                ? colors.gray[600] 
                : colors.gray[300],
          borderRadius: 0,
          backgroundColor: 'transparent',
          ...focusedStyle,
        };
      
      case 'filled':
        return {
          ...baseStyle,
          backgroundColor: disabled 
            ? isDark ? colors.gray[800] : colors.gray[100] 
            : isDark 
              ? colors.gray[800] 
              : colors.gray[50],
          borderWidth: 0,
          ...focusedStyle,
          ...errorStyle,
        };
      
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: disabled 
            ? isDark ? colors.gray[900] : colors.gray[50]
            : isDark 
              ? themeColors.card 
              : themeColors.background,
          borderWidth: 1.5,
          borderColor: error 
            ? colors.error[500] 
            : isFocused 
              ? colors.primary[500] 
              : isDark 
                ? colors.gray[600] 
                : colors.gray[300],
          ...focusedStyle,
        };
      
      default:
        return baseStyle;
    }
  };

  const getInputStyles = (): TextStyle => {
    return {
      flex: 1,
      fontSize: components.input.fontSize[size],
      fontFamily: 'Inter_400Regular',
      color: disabled 
        ? colors.gray[400] 
        : themeColors.text.primary,
      paddingHorizontal: 0,
      paddingVertical: 0,
    };
  };

  const inputContainer = (
    <View style={[getContainerStyles(), containerStyle]}>
      {leftIcon && (
        <View style={{ marginRight: 8 }}>
          {leftIcon}
        </View>
      )}
      
      <TextInput
        ref={ref}
        style={[getInputStyles(), inputStyle]}
        placeholderTextColor={isDark ? colors.gray[500] : colors.gray[400]}
        secureTextEntry={isSecureInput && !isPasswordVisible}
        editable={!disabled}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
      
      {isSecureInput && (
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          style={{ marginLeft: 8 }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          {isPasswordVisible ? (
            <EyeOff size={20} color={isDark ? colors.gray[500] : colors.gray[400]} />
          ) : (
            <Eye size={20} color={isDark ? colors.gray[500] : colors.gray[400]} />
          )}
        </TouchableOpacity>
      )}
      
      {rightIcon && !isSecureInput && (
        <View style={{ marginLeft: 8 }}>
          {rightIcon}
        </View>
      )}
    </View>
  );

  const content = (
    <View style={{ marginBottom: 16, width: '100%' }}>
      {label && (
        <View style={{ marginBottom: 6, flexDirection: 'row', alignItems: 'center' }}>
          <Text
            style={[
              {
                fontSize: 14,
                fontFamily: 'Inter_500Medium',
                color: themeColors.text.secondary,
              },
              labelStyle,
            ]}
          >
            {label}
          </Text>
          {required && (
            <Text
              style={{
                color: colors.error[500],
                marginLeft: 4,
                fontSize: 14,
                fontFamily: 'Inter_500Medium',
              }}
            >
              *
            </Text>
          )}
        </View>
      )}
      
      {inputContainer}
      
      {(error || hint) && (
        <View style={{ marginTop: 6 }}>
          {error && (
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Inter_400Regular',
                color: colors.error[500],
              }}
            >
              {error}
            </Text>
          )}
          {hint && !error && (
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Inter_400Regular',
                color: themeColors.text.tertiary,
              }}
            >
              {hint}
            </Text>
          )}
        </View>
      )}
    </View>
  );

  if (animate && !reducedMotion) {
    return (
      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{
          type: 'timing',
          duration: 300,
        }}
      >
        {content}
      </MotiView>
    );
  }

  return content;
});

Input.displayName = 'Input';

export default Input;
