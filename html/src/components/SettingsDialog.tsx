import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import config from '../config';

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
  const [showApiKey, setShowApiKey] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  // Initialize local state when dialog opens
  useEffect(() => {
    if (open) {
      setLocalApiKey(apiKey || '');
      setSuccess(false);
      setCopied(false);
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

  // Copy API key to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(localApiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          
          <Form.Group className="mb-3">
            <Form.Label>API Key</Form.Label>
            <InputGroup>
              <Form.Control
                type={showApiKey ? 'text' : 'password'}
                value={localApiKey}
                onChange={(e) => setLocalApiKey(e.target.value)}
                placeholder="Enter your API key"
              />
              <Button
                variant="outline-secondary"
                onClick={() => setShowApiKey(!showApiKey)}
                title={showApiKey ? 'Hide' : 'Show'}
              >
                <i className={`bi bi-eye${showApiKey ? '-slash' : ''}`}></i>
              </Button>
              {localApiKey && (
                <Button
                  variant="outline-secondary"
                  onClick={copyToClipboard}
                  title="Copy to clipboard"
                >
                  <i className={`bi bi-${copied ? 'check' : 'clipboard'}`}></i>
                </Button>
              )}
            </InputGroup>
            <Form.Text className="text-muted">
              Your SRT Live Server API key for authentication
            </Form.Text>
          </Form.Group>

          <hr />

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
              checked={advancedMode}
              onChange={(e) => setAdvancedMode(e.target.checked)}
            />
          </Form.Group>

          {advancedMode && (
            <Alert variant="warning" className="mb-0">
              <i className="bi bi-exclamation-triangle me-2"></i>
              <strong>Advanced Mode enabled:</strong> You can now manually edit Publisher and Player IDs. 
              Be careful, as duplicate IDs will cause errors.
            </Alert>
          )}
          
          {!advancedMode && (
            <Alert variant="info" className="mb-0">
              <i className="bi bi-info-circle me-2"></i>
              To get your API key, check the server console when starting the SRT Live Server. 
              The default admin API key will be displayed there.
            </Alert>
          )}
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