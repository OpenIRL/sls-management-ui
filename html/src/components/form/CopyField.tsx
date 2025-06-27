import React, { useState, useRef, useCallback } from 'react';
import { Button } from 'react-bootstrap';
import { BaseInput, BaseInputProps } from './BaseInput';

// Props for CopyField component (extends BaseInput but makes some fields optional)
export interface CopyFieldProps extends Omit<BaseInputProps, 'rightActions'> {
  onCopy?: (value: string) => void;
  copyButtonText?: string;
  successDuration?: number;
  additionalActions?: React.ReactNode;
}

// Fallback copy function using existing input field
const fallbackCopyToClipboard = (inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement>): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const input = inputRef.current;
      if (!input) {
        reject(new Error('Input element not found'));
        return;
      }

      // Select the text in the existing input
      input.focus();
      input.select();
      
      // Try to copy using execCommand
      const successful = document.execCommand('copy');
        
      // Deselect the input
      input.blur();

      if (successful) {
        resolve();
      } else {
        reject(new Error('Fallback copy failed'));
      }
    } catch (err) {
      reject(err);
    }
  });
};

// Copy field component that extends BaseInput with copy functionality
export const CopyField: React.FC<CopyFieldProps> = ({
  onCopy,
  copyButtonText = 'Copy',
  successDuration = 2000,
  additionalActions,
  readOnly = true,
  ...baseInputProps
}) => {
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Handle copy to clipboard with fallback for HTTP environments
  const handleCopy = useCallback(async () => {
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(baseInputProps.value);
      } else {
        // Fallback for HTTP environments
        await fallbackCopyToClipboard(inputRef);
      }
      
      setCopied(true);
      setTimeout(() => setCopied(false), successDuration);
      
      // Call custom onCopy handler if provided
      if (onCopy) {
        onCopy(baseInputProps.value);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [baseInputProps.value, onCopy, successDuration, inputRef]);

  return (
    <BaseInput
      {...baseInputProps}
      readOnly={readOnly}
      ref={inputRef}
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