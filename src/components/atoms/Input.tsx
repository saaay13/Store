import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'error';
}

const Input: React.FC<InputProps> = ({
  variant = 'default',
  className = '',
  ...props
}) => {
  const baseClasses = 'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors';

  const variantClasses = {
    default: 'border-gray-300 focus:border-primary focus:ring-primary-500',
    error: 'border-error focus:border-error focus:ring-error',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <input className={classes} {...props} />
  );
};

export default Input;