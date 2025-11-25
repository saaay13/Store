import React from 'react';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  label?: string;
  variant?: 'default' | 'error';
  size?: 'sm' | 'md' | 'lg';
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  variant = 'default',
  size = 'md',
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  const baseClasses = 'rounded border-input text-primary focus:ring-ring focus:ring-2 transition-colors';

  const variantClasses = {
    default: '',
    error: 'border-error focus:ring-error',
  };

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const inputClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  const labelSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={inputId}
        className={inputClasses}
        {...props}
      />
      {label && (
        <label
          htmlFor={inputId}
          className={`ml-2 text-foreground cursor-pointer ${labelSizeClasses[size]}`}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;