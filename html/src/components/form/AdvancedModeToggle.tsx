import React from 'react';
import { Form, Alert } from 'react-bootstrap';

// Props for AdvancedModeToggle component
interface AdvancedModeToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

// Reusable advanced mode toggle component
export const AdvancedModeToggle: React.FC<AdvancedModeToggleProps> = ({
  checked,
  onChange
}) => {
  return (
    <>
      <Form.Group className="mb-3">
        <Form.Check
          type="switch"
          id="advanced-mode-switch"
          label={
            <div>
              <span className="fw-medium">Advanced Mode</span>
              <div className="small text-muted">
                Enable manual editing of Publisher and Player IDs
              </div>
            </div>
          }
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
      </Form.Group>

      {checked && (
        <Alert variant="warning" className="mb-0">
          <i className="bi bi-exclamation-triangle me-2"></i>
          <strong>Advanced Mode enabled:</strong> You can now manually edit Publisher and Player IDs. 
          Be careful, as duplicate IDs will cause errors.
        </Alert>
      )}
      
      {!checked && (
        <Alert variant="info" className="mb-0">
          <i className="bi bi-info-circle me-2"></i>
          To get your API key, check the server console when starting the SRT Live Server. 
          The default admin API key will be displayed there.
        </Alert>
      )}
    </>
  );
}; 