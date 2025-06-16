import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { BaseInput, BaseInputProps } from './BaseInput';

// Props for CopyField component (extends BaseInput but makes some fields optional)
export interface CopyFieldProps extends Omit<BaseInputProps, 'rightActions'> {
  onCopy?: (value: string) => void;
  copyButtonText?: string;
  successDuration?: number;
  additionalActions?: React.ReactNode;
}

// Copy field component that extends BaseInput with copy functionality
export const CopyField: React.FC<CopyFieldProps> = ({
  onCopy,
  copyButtonText = 'Copy',
  successDuration = 2000,
  additionalActions,
  ...baseInputProps
}) => {
  const [copied, setCopied] = useState(false);

  // Handle copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(baseInputProps.value);
      setCopied(true);
      setTimeout(() => setCopied(false), successDuration);
      
      // Call custom onCopy handler if provided
      if (onCopy) {
        onCopy(baseInputProps.value);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <BaseInput
      {...baseInputProps}
      readOnly={true}
      rightActions={
        <>
          {additionalActions}
          {baseInputProps.value && (
            <Button
              variant={copied ? 'success' : 'outline-secondary'}
              onClick={handleCopy}
              title="Copy to clipboard"
            >
              <i className={`bi bi-${copied ? 'check2' : 'clipboard'}`}></i>
              {copyButtonText && (
                <>
                  {' '}
                  {copied ? 'Copied!' : copyButtonText}
                </>
              )}
            </Button>
          )}
        </>
      }
    />
  );
}; 