import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { CopyFieldProps } from './CopyField';
import {BaseInput} from "./BaseInput";

// Props for CopyFieldWithHide component
export interface CopyFieldWithHideProps extends Omit<CopyFieldProps, 'additionalActions'> {
  showToggleText?: boolean;
}

// Copy field with hide/show functionality (for sensitive data like API keys)
export const HideField: React.FC<CopyFieldWithHideProps> = ({
  showToggleText = false,
  readOnly = false,
  ...props
}) => {
  const [showValue, setShowValue] = useState(false);

  return (
    <BaseInput
      {...props}
      readOnly={readOnly}
      type={showValue ? 'text' : 'password'}
      rightActions={
        <Button
          variant="outline-secondary"
          onClick={() => setShowValue(!showValue)}
          title={showValue ? 'Hide' : 'Show'}
        >
          <i className={`bi bi-eye${showValue ? '-slash' : ''}`}></i>
          {showToggleText && (
            <>
              {' '}
              {showValue ? 'Hide' : 'Show'}
            </>
          )}
        </Button>
      }
    />
  );
}; 