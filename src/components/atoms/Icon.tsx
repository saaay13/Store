import React from 'react';
import * as LucideIcons from 'lucide-react';

interface IconProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  color?: string;
}

const sizeClasses = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
};

const iconMap: Record<string, keyof typeof LucideIcons> = {
  home: 'Home',
  user: 'User',
  settings: 'Settings',
  search: 'Search',
  plus: 'Plus',
  minus: 'Minus',
  edit: 'Edit',
  delete: 'Trash2',
  check: 'Check',
  close: 'X',
  arrowLeft: 'ArrowLeft',
  arrowRight: 'ArrowRight',
  arrowUp: 'ArrowUp',
  arrowDown: 'ArrowDown',
  menu: 'Menu',
  loading: 'Loader2',
  success: 'CheckCircle',
  error: 'AlertCircle',
  warning: 'AlertTriangle',
  info: 'Info',
};

const Icon: React.FC<IconProps> = ({
  name,
  size = 'md',
  className = '',
  color = 'currentColor',
}) => {
  const iconKey = iconMap[name] || 'Circle';
  const LucideIcon = LucideIcons[iconKey];

  if (!LucideIcon) {
    return null;
  }

  const spinClass = name === 'loading' ? 'animate-spin' : '';

  return (
    <LucideIcon
      className={`${sizeClasses[size]} ${className} ${spinClass}`.trim()}
      color={color}
      strokeWidth={2}
    />
  );
};

export default Icon;
