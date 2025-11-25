import React from "react";
import Input from "../atoms/Input";
import Select from "../atoms/Select";
import Textarea from "../atoms/Textarea";
import { Icon } from "../atoms";

interface BaseFormFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  helperText?: string;
  className?: string;
  /**
   * Tipo de control a renderizar. Se mantiene compatibilidad con `type="select"|"textarea"`.
   */
  fieldType?: "input" | "select" | "textarea";
}

interface InputFormFieldProps
  extends BaseFormFieldProps,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "className" | "type"> {
  /**
   * Tipo HTML del input (password, email, number, file, etc.).
   * Si no se define, usa "text".
   */
  inputType?: React.InputHTMLAttributes<HTMLInputElement>["type"];
  options?: never;
}

interface SelectFormFieldProps
  extends BaseFormFieldProps,
    Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "className"> {
  fieldType: "select";
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

interface TextareaFormFieldProps
  extends BaseFormFieldProps,
    Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "className"> {
  fieldType: "textarea";
  options?: never;
}

type FormFieldProps =
  | InputFormFieldProps
  | SelectFormFieldProps
  | TextareaFormFieldProps
  | (Omit<InputFormFieldProps, "fieldType"> & { type?: string });

const FormField: React.FC<FormFieldProps> = (props) => {
  const {
    label,
    error,
    required = false,
    helperText,
    className = "",
    fieldType,
    inputType,
    ...fieldProps
  } = props as any;

  const rawType = (props as any).type;
  const resolvedFieldType: "input" | "select" | "textarea" =
    fieldType || (rawType === "select" || rawType === "textarea" ? rawType : "input");

  // Si es un input, prioriza inputType; si el caller pasó type="password", etc., se respeta.
  const resolvedInputType =
    resolvedFieldType === "input"
      ? inputType || (rawType && rawType !== "input" ? rawType : "text")
      : undefined;

  const fieldId = `field-${Math.random().toString(36).substr(2, 9)}`;

  const renderField = () => {
    const commonProps = {
      id: fieldId,
      "aria-describedby": error
        ? `${fieldId}-error`
        : helperText
        ? `${fieldId}-helper`
        : undefined,
      "aria-invalid": !!error,
    };

    switch (resolvedFieldType) {
      case "select":
        const selectProps = props as SelectFormFieldProps;
        return (
          <Select
            {...commonProps}
            {...(fieldProps as any)}
            options={selectProps.options}
            placeholder={selectProps.placeholder}
            variant={error ? "error" : "default"}
          />
        );

      case "textarea":
        return (
          <Textarea
            {...commonProps}
            {...(fieldProps as any)}
            variant={error ? "error" : "default"}
          />
        );

      default:
        return (
          <Input
            {...commonProps}
            {...(fieldProps as any)}
            type={resolvedInputType}
            variant={error ? "error" : "default"}
          />
        );
    }
  };

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label
          htmlFor={fieldId}
          className="block text-sm font-medium text-foreground"
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
        <p id={`${fieldId}-helper`} className="text-sm text-muted-foreground">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default FormField;
