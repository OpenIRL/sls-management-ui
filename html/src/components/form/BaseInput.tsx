import React, { forwardRef } from 'react';
import { Form, InputGroup } from 'react-bootstrap';

// Props for BaseInput component
export interface BaseInputProps {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  helpText?: string;
  readOnly?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  type?: string;
  // Slots for additional elements
  leftAddon?: React.ReactNode;
  rightActions?: React.ReactNode;
  // For textarea variant
  as?: 'input' | 'textarea';
  rows?: number;
  // Additional props
  className?: string;
  error?: string;
  disabled?: boolean;
}

// Base input component with flexible slots for actions
export const BaseInput = forwardRef<HTMLInputElement | HTMLTextAreaElement, BaseInputProps>(({
  label,
  value,
  onChange,
  placeholder,
  helpText,
  readOnly = false,
  required = false,
  autoFocus = false,
  type = 'text',
  leftAddon,
  rightActions,
  as = 'input',
  rows = 3,
  className = '',
  error,
  disabled = false
}, ref) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (onChange && !readOnly && !disabled) {
      onChange(e.target.value);
    }
  };

  const inputProps = {
    type,
    value,
    onChange: handleChange,
    placeholder,
    readOnly,
    required,
    autoFocus,
    disabled,
    className: `${error ? 'is-invalid' : ''} ${className}`,
    onClick: readOnly ? (e: React.MouseEvent) => (e.target as HTMLInputElement).select() : undefined,
    as
  };

  const textareaProps = as === 'textarea' ? { rows } : {};

  return (
    <Form.Group className="mb-3">
      {label && <Form.Label>{label}</Form.Label>}
      {(leftAddon || rightActions) ? (
        <InputGroup>
          {leftAddon}
          <Form.Control
            {...inputProps}
            {...textareaProps}
            ref={ref as any}
          />
          {rightActions}
        </InputGroup>
      ) : (
        <Form.Control
          {...inputProps}
          {...textareaProps}
          ref={ref as any}
        />
      )}
      {error && (
        <Form.Control.Feedback type="invalid" className="d-block">
          {error}
        </Form.Control.Feedback>
      )}
      {helpText && !error && (
        <Form.Text className="text-muted">
          {helpText}
        </Form.Text>
      )}
    </Form.Group>
  );
}); 