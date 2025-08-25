import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils/helpers';
import React from 'react';
import { Text, TextProps } from 'react-native';

interface ThemedTextProps extends TextProps {
  children?: React.ReactNode;
  className?: string;
}

export default function ThemedText({ children, className, style, ...props }: ThemedTextProps) {
  const { isDark } = useTheme();
  
  return (
    <Text
      className={cn(
        'text-black dark:text-white',
        className,
      )}
      style={style}
      {...props}
    >
      {children}
    </Text>
  );
}
