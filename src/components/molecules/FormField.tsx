import React from 'react';
import Input from '../atoms/Input';
import Select from '../atoms/Select';
import Textarea from '../atoms/Textarea';
import { Icon } from '../atoms';

interface BaseFormFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  helperText?: string;
  className?: string;
}

interface InputFormFieldProps extends BaseFormFieldProps {
  type?: 'input';
}

interface SelectFormFieldProps extends BaseFormFieldProps {
  type: 'select';
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

interface TextareaFormFieldProps extends BaseFormFieldProps {
  type: 'textarea';
}

type FormFieldProps = InputFormFieldProps | SelectFormFieldProps | TextareaFormFieldProps;

const FormField: React.FC<FormFieldProps> = (props) => {
  const {
    label,
    error,
    required = false,
    helperText,
    className = '',
    type = 'input',
    ...fieldProps
  } = props;

  const fieldId = `field-${Math.random().toString(36).substr(2, 9)}`;

  const renderField = () => {
    const commonProps = {
      id: fieldId,
      'aria-describedby': error ? `${fieldId}-error` : helperText ? `${fieldId}-helper` : undefined,
      'aria-invalid': !!error,
    };

    switch (type) {
      case 'select':
        const selectProps = fieldProps as SelectFormFieldProps;
        return (
          <Select
            {...commonProps}
            {...(fieldProps as any)}
            options={selectProps.options}
            placeholder={selectProps.placeholder}
            variant={error ? 'error' : 'default'}
          />
        );

      case 'textarea':
        return (
          <Textarea
            {...commonProps}
            {...(fieldProps as any)}
            variant={error ? 'error' : 'default'}
          />
        );

      default:
        return (
          <Input
            {...commonProps}
            {...(fieldProps as any)}
            variant={error ? 'error' : 'default'}
          />
        );
    }
  };

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label
          htmlFor={fieldId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}

      {renderField()}

      {error && (
        <div
          id={`${fieldId}-error`}
          className="flex items-center space-x-1 text-sm text-error"
          role="alert"
        >
          <Icon name="error" size="sm" />
          <span>{error}</span>
        </div>
      )}

      {helperText && !error && (
        <p
          id={`${fieldId}-helper`}
          className="text-sm text-gray-500"
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

export default FormField;