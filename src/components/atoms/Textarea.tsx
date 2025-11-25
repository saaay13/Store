import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'default' | 'error';
  size?: 'sm' | 'md' | 'lg';
}

const Textarea: React.FC<TextareaProps> = ({
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseClasses =
    'block w-full rounded-md border bg-background text-foreground placeholder:text-muted-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors resize-vertical';

  const variantClasses = {
    default: 'border-input focus:border-ring focus:ring-ring',
    error: 'border-error focus:border-error focus:ring-error',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-4 py-3 text-lg',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} disabled:opacity-60 disabled:cursor-not-allowed ${className}`;

  return (
    <textarea
      className={classes}
      rows={4}
      {...props}
    />
  );
};

export default Textarea;
