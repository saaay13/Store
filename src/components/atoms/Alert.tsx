import React from 'react';
import Button from './Button';
import Icon from './Icon';

interface AlertProps {
  variant?: 'success' | 'warning' | 'error' | 'info';
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  onClose,
  className = ''
}) => {
  const baseClasses = 'p-4 rounded-md border-l-4 flex items-start space-x-3';

  const variantClasses = {
    success: 'bg-success/10 border-success text-success-foreground',
    warning: 'bg-warning/10 border-warning text-warning-foreground',
    error: 'bg-error/10 border-error text-error-foreground',
    info: 'bg-info/10 border-info text-info-foreground',
  };

  const iconNames = {
    success: 'success',
    warning: 'warning',
    error: 'error',
    info: 'info',
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      <Icon name={iconNames[variant]} size="md" className="flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        {title && (
          <h3 className="text-sm font-medium mb-1">
            {title}
          </h3>
        )}
        <div className="text-sm">
          {children}
        </div>
      </div>
      {onClose && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onClose}
          className="flex-shrink-0 p-1 hover:bg-accent"
        >
          <Icon name="close" size="sm" />
        </Button>
      )}
    </div>
  );
};

export default Alert;