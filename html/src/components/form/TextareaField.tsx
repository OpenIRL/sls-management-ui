import React from 'react';
import { BaseInput, BaseInputProps } from './BaseInput';

// Props for TextareaField component
export interface TextareaFieldProps extends Omit<BaseInputProps, 'as' | 'type'> {
  // Textarea specific props can be added here
}

// Textarea field component that extends BaseInput
export const TextareaField: React.FC<TextareaFieldProps> = (props) => {
  return (
    <BaseInput
      {...props}
      as="textarea"
    />
  );
}; 