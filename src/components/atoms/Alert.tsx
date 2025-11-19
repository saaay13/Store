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
    success: 'bg-green-50 border-green-400 text-green-800',
    warning: 'bg-yellow-50 border-yellow-400 text-yellow-800',
    error: 'bg-red-50 border-red-400 text-red-800',
    info: 'bg-blue-50 border-blue-400 text-blue-800',
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
          className="flex-shrink-0 p-1 hover:bg-gray-200"
        >
          <Icon name="close" size="sm" />
        </Button>
      )}
    </div>
  );
};

export default Alert;