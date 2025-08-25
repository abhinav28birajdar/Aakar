import { cn } from '@/lib/utils/helpers';
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';

interface ButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export const Button = ({
  onPress,
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  className,
}: ButtonProps) => {
  const baseStyles = 'tw-rounded-lg tw-flex tw-flex-row tw-items-center tw-justify-center';
  
  const variantStyles = {
    primary: 'tw-bg-primary tw-text-white active:tw-bg-primary-dark',
    secondary: 'tw-bg-secondary tw-text-white active:tw-bg-secondary/80',
    outline: 'tw-border tw-border-border tw-bg-transparent',
    ghost: 'tw-bg-transparent active:tw-bg-muted-foreground/10',
  };

  const sizeStyles = {
    sm: 'tw-px-3 tw-py-1.5 tw-text-sm',
    md: 'tw-px-4 tw-py-2 tw-text-base',
    lg: 'tw-px-6 tw-py-3 tw-text-lg',
  };

  const disabledStyles = 'tw-opacity-50';
  const fullWidthStyles = 'tw-w-full';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        disabled && disabledStyles,
        fullWidth && fullWidthStyles,
        className
      )}
    >
      {isLoading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' || variant === 'secondary' ? 'white' : '#EE4D2D'} 
        />
      ) : (
        <Text 
          className={cn(
            'tw-font-medium',
            variant === 'primary' || variant === 'secondary' ? 'tw-text-white' : 'tw-text-foreground',
            disabled && 'tw-opacity-50'
          )}
        >
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
