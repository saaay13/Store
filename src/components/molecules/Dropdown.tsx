import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../atoms';
import { Icon } from '../atoms';

interface DropdownItem {
  label: string;
  value: string;
  icon?: string;
  disabled?: boolean;
  onClick?: () => void;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  align = 'left',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemClick = (item: DropdownItem) => {
    if (!item.disabled) {
      item.onClick?.();
      setIsOpen(false);
    }
  };

  const alignClasses = {
    left: 'left-0',
    right: 'right-0'
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>

      {isOpen && (
        <div className={`absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 ${alignClasses[align]}`}>
          <div className="py-1">
            {items.map((item, index) => (
              <button
                key={index}
                className={`w-full text-left px-4 py-2 text-sm flex items-center space-x-2 hover:bg-gray-100 ${
                  item.disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'
                }`}
                onClick={() => handleItemClick(item)}
                disabled={item.disabled}
              >
                {item.icon && <Icon name={item.icon} size="sm" />}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Pre-built trigger components
interface DropdownButtonProps extends Omit<DropdownProps, 'trigger'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export const DropdownButton: React.FC<DropdownButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  ...dropdownProps
}) => (
  <Dropdown
    {...dropdownProps}
    trigger={
      <Button variant={variant} size={size}>
        {children}
        <Icon name="arrowDown" size="sm" className="ml-2" />
      </Button>
    }
  />
);

export default Dropdown;