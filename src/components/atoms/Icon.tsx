import React from 'react';

interface IconProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  color?: string;
}

const Icon: React.FC<IconProps> = ({
  name,
  size = 'md',
  className = '',
  color = 'currentColor'
}) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  };

  // Simple icon mapping - in a real app, you'd use a proper icon library
  const iconMap: Record<string, string> = {
    home: '🏠',
    user: '👤',
    settings: '⚙️',
    search: '🔍',
    plus: '➕',
    minus: '➖',
    edit: '✏️',
    delete: '🗑️',
    check: '✓',
    close: '✕',
    arrowLeft: '←',
    arrowRight: '→',
    arrowUp: '↑',
    arrowDown: '↓',
    menu: '☰',
    loading: '⏳',
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  const icon = iconMap[name] || '❓';

  return (
    <span
      className={`${sizeClasses[size]} inline-flex items-center justify-center ${className}`}
      style={{ color }}
      role="img"
      aria-label={name}
    >
      {icon}
    </span>
  );
};

export default Icon;