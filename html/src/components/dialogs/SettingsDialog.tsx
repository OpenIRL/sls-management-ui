import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';
import config from '../../config';
import { AdvancedModeToggle, HideField } from '../form';

// Props for SettingsDialog component
interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

// Settings dialog component for API configuration
export const SettingsDialog: React.FC<SettingsDialogProps> = ({
  open,
  onClose,
}) => {
  const { apiKey, setApiKey } = useAuth();
  const { advancedMode, setAdvancedMode } = useSettings();
  const [localApiKey, setLocalApiKey] = useState('');
  const [success, setSuccess] = useState(false);

  // Initialize local state when dialog opens
  useEffect(() => {
    if (open) {
      setLocalApiKey(apiKey || '');
      setSuccess(false);
    }
  }, [open, apiKey]);

  // Handle save
  const handleSave = () => {
    setApiKey(localApiKey);
    setSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <Modal show={open} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Settings</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {success && (
          <Alert variant="success" className="mb-3">
            Settings saved successfully!
          </Alert>
        )}
        
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Server URL</Form.Label>
            <Form.Control
              type="text"
              value={config.apiEndpoint}
              readOnly
              disabled
            />
            <Form.Text className="text-muted">
              The server URL is configured at build time or via runtime configuration.
            </Form.Text>
          </Form.Group>
          
          <HideField
            label="API Key"
            value={localApiKey}
            onChange={setLocalApiKey}
            placeholder="Enter your API key"
            helpText="Your SRT Live Server API key for authentication"
          />

          <hr />

          <AdvancedModeToggle
            checked={advancedMode}
            onChange={setAdvancedMode}
          />
        </Form>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          variant="primary"
          onClick={handleSave}
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}; 