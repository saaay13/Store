import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options: SelectOption[];
  variant?: 'default' | 'error';
  size?: 'sm' | 'md' | 'lg';
  placeholder?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  variant = 'default',
  size = 'md',
  placeholder,
  className = '',
  ...props
}) => {
  const baseClasses =
    'block w-full rounded-md border bg-background text-foreground placeholder:text-muted-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors';

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
    <select className={classes} {...props}>
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
