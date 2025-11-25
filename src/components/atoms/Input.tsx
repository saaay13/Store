import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'error';
}

const Input: React.FC<InputProps> = ({
  variant = 'default',
  className = '',
  ...props
}) => {
  const baseClasses =
    'w-full px-3 py-2 rounded-md transition-colors bg-background text-foreground placeholder:text-muted-foreground border focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClasses = {
    default: 'border-input focus:border-ring focus:ring-ring',
    error: 'border-error focus:border-error focus:ring-error',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} disabled:opacity-60 disabled:cursor-not-allowed ${className}`;

  return (
    <input className={classes} {...props} />
  );
};

export default Input;
