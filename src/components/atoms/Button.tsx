import React from 'react';
import Spinner from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'danger' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled = false,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:opacity-90 focus:ring-ring',
    secondary: 'bg-muted text-foreground hover:bg-accent focus:ring-ring',
    success: 'bg-success text-success-foreground hover:opacity-90 focus:ring-success',
    warning: 'bg-warning text-warning-foreground hover:opacity-90 focus:ring-warning',
    error: 'bg-error text-error-foreground hover:opacity-90 focus:ring-error',
    danger: 'bg-error text-error-foreground hover:opacity-90 focus:ring-error',
    outline: 'bg-transparent border border-border text-foreground hover:bg-accent focus:ring-ring',
  };

  const sizeClasses = {
    xs: 'px-2.5 py-1.5 text-xs rounded-sm',
    sm: 'px-3 py-2 text-sm rounded-md',
    md: 'px-4 py-2 text-base rounded-md',
    lg: 'px-4 py-2 text-lg rounded-lg',
    xl: 'px-6 py-3 text-xl rounded-lg',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  const spinnerSizeMap: Record<typeof size, 'xs' | 'sm' | 'md' | 'lg' | 'xl'> = {
    xs: 'xs',
    sm: 'xs',
    md: 'sm',
    lg: 'md',
    xl: 'md',
  };

  return (
    <button className={classes} disabled={disabled || isLoading} {...props}>
      {isLoading && (
        <Spinner size={spinnerSizeMap[size]} color="white" className="mr-2" />
      )}
      {children}
    </button>
  );
};

export default Button;