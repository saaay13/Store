import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface ThemeToggleProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ThemeToggle = ({ size = 'md', className = '' }: ThemeToggleProps) => {
  const { theme, setTheme } = useTheme();

  const handleToggle = () => {
    const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    setTheme(nextTheme);
  };

  const iconSize = {
    sm: 16,
    md: 20,
    lg: 24,
  }[size];

  const buttonSize = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  }[size];

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun size={iconSize} />;
      case 'dark':
        return <Moon size={iconSize} />;
      case 'system':
        return <Monitor size={iconSize} />;
    }
  };

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Cambiar a modo oscuro';
      case 'dark':
        return 'Cambiar a modo sistema';
      case 'system':
        return 'Cambiar a modo claro';
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        ${buttonSize}
        flex items-center justify-center
        rounded-md
        bg-transparent
        text-muted-foreground
        hover:bg-accent hover:text-accent-foreground
        transition-colors
        ${className}
      `}
      aria-label={getLabel()}
      title={getLabel()}
    >
      {getIcon()}
    </button>
  );
};
