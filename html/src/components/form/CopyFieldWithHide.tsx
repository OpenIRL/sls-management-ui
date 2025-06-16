import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { CopyField, CopyFieldProps } from './CopyField';

// Props for CopyFieldWithHide component
export interface CopyFieldWithHideProps extends Omit<CopyFieldProps, 'additionalActions'> {
  showToggleText?: boolean;
}

// Copy field with hide/show functionality (for sensitive data like API keys)
export const CopyFieldWithHide: React.FC<CopyFieldWithHideProps> = ({
  showToggleText = false,
  ...props
}) => {
  const [showValue, setShowValue] = useState(false);

  return (
    <CopyField
      {...props}
      type={showValue ? 'text' : 'password'}
      additionalActions={
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