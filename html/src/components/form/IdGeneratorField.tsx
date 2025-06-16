import React from 'react';
import { Button } from 'react-bootstrap';
import { BaseInput, BaseInputProps } from './BaseInput';

// Props for IdGeneratorField component
export interface IdGeneratorFieldProps extends Omit<BaseInputProps, 'rightActions' | 'leftAddon'> {
  onRegenerate: () => void;
  showLock?: boolean;
  showRegenerateButton?: boolean;
}

// ID generator field component that extends BaseInput
export const IdGeneratorField: React.FC<IdGeneratorFieldProps> = ({
  onRegenerate,
  showRegenerateButton = true,
  readOnly = false,
  ...baseInputProps
}) => {
  return (
    <BaseInput
      {...baseInputProps}
      readOnly={readOnly}
      leftAddon={
        readOnly ? (
          <span className="input-group-text" title="Enable Advanced Mode in settings to edit">
            <i className="bi bi-lock-fill text-muted"></i>
          </span>
        ) : undefined
      }
      rightActions={
        showRegenerateButton && (
          <Button
            variant="outline-secondary"
            type="button"
            onClick={onRegenerate}
            title={`Generate new ${baseInputProps.label}`}
          >
            <i className="bi bi-arrow-clockwise"></i>
          </Button>
        )
      }
    />
  );
}; 