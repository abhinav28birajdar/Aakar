import {
    Bell,
    BookmarkIcon,
    Check,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    Home,
    LayoutDashboard,
    Palette,
    Plus,
    RefreshCcw,
    RotateCcw,
    Search,
    Settings,
    UserIcon,
    X,
} from 'lucide-react-native';
import { View } from 'react-native';
import { twMerge } from 'tailwind-merge';

const icons = {
  bell: Bell,
  bookmark: BookmarkIcon,
  home: Home,
  plus: Plus,
  search: Search,
  user: UserIcon,
  'layout-dashboard': LayoutDashboard,
  palette: Palette,
  settings: Settings,
  'chevron-down': ChevronDown,
  'chevron-up': ChevronUp,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'rotate-ccw': RotateCcw,
  'refresh-ccw': RefreshCcw,
  x: X,
  check: Check,
};

type IconProps = {
  name: keyof typeof icons;
  size?: number;
  strokeWidth?: number;
  className?: string;
};

export default function Icon({ name, size = 24, strokeWidth = 2, className }: IconProps) {
  const IconComponent = icons[name];
  if (!IconComponent) return null;

  return (
    <View style={{ opacity: 1 }} className={twMerge('text-black dark:text-white', className)}>
      <IconComponent 
        size={size} 
        strokeWidth={strokeWidth} 
      />
    </View>
  );
}
