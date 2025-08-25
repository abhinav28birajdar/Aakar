import { Lucide } from 'lucide-react-native';
import { View } from 'react-native';
import { twMerge } from 'tailwind-merge';

type IconProps = {
  name: keyof typeof Lucide;
  size?: number;
  strokeWidth?: number;
  className?: string;
};

export default function Icon({ name, size = 24, strokeWidth = 2, className }: IconProps) {
  const IconComponent = Lucide[name];
  if (!IconComponent) return null;

  return (
    <View className={twMerge('text-black dark:text-white', className)}>
      <IconComponent 
        size={size} 
        strokeWidth={strokeWidth} 
        className={className} 
      />
    </View>
  );
}
