import React, { useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { apiService } from '../services/api.service';
import { useSettings } from '../contexts/SettingsContext';
import { StreamId } from '../types/api.types';

// Props for AddStreamDialog component
interface AddStreamDialogProps {
  open: boolean;
  onClose: () => void;
  onStreamAdded: (streamId: StreamId) => void;
  prefillPublisher?: string;
}

// Generate UUID v4
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Dialog component for adding new stream IDs
export const AddStreamDialog: React.FC<AddStreamDialogProps> = ({
  open,
  onClose,
  onStreamAdded,
  prefillPublisher,
}) => {
  const { advancedMode } = useSettings();
  const [publisher, setPublisher] = useState('');
  const [player, setPlayer] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Generate default IDs
  const generateDefaultIds = () => {
    const publisherUuid = generateUUID().replace(/-/g, '');
    const playerUuid = generateUUID().replace(/-/g, '');
    return {
      publisherId: `live_${publisherUuid}`,
      playerId: `play_${playerUuid}`
    };
  };

  // Reset form when dialog opens/closes
  React.useEffect(() => {
    if (!open) {
      setPublisher('');
      setPlayer('');
      setDescription('');
      setError(null);
    } else if (prefillPublisher) {
      setPublisher(prefillPublisher);
      // Generate only player ID when publisher is prefilled
      const uuid = generateUUID().replace(/-/g, '');
      setPlayer(`play_${uuid}`);
    } else {
      // Generate both IDs for new stream
      const { publisherId, playerId } = generateDefaultIds();
      setPublisher(publisherId);
      setPlayer(playerId);
    }
  }, [open, prefillPublisher]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!publisher.trim() || !player.trim()) {
      setError('Publisher and Player IDs are required');
      return;
    }

    // Check if publisher and player are identical
    if (publisher.trim() === player.trim()) {
      setError('Publisher and Player IDs must be different');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await apiService.addStreamId({
        publisher: publisher.trim(),
        player: player.trim(),
        description: description.trim() || undefined,
      });

      const newStreamId: StreamId = {
        publisher: publisher.trim(),
        player: player.trim(),
        description: description.trim() || undefined,
      };

      onStreamAdded(newStreamId);
      onClose();
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError(`Stream ID with player '${player}' already exists`);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to add stream ID. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Regenerate Publisher ID
  const handleRegeneratePublisher = () => {
    if (!prefillPublisher) {
      const uuid = generateUUID().replace(/-/g, '');
      setPublisher(`live_${uuid}`);
    }
  };

  // Regenerate Player ID
  const handleRegeneratePlayer = () => {
    const uuid = generateUUID().replace(/-/g, '');
    setPlayer(`play_${uuid}`);
  };

  // Check if IDs are identical (for real-time validation)
  const areIdsIdentical = !!publisher.trim() && !!player.trim() && publisher.trim() === player.trim();

  return (
    <Modal show={open} onHide={onClose} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>
            {prefillPublisher ? `Add Player to ${prefillPublisher}` : 'Add New Stream ID'}
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {!advancedMode && (
            <Alert variant="info" className="mb-3">
              <i className="bi bi-shield-check me-2"></i>
              IDs are auto-generated for security. Enable <strong>Advanced Mode</strong> in settings to edit manually.
            </Alert>
          )}

          {areIdsIdentical && (
            <Alert variant="warning" className="mb-3">
              <i className="bi bi-exclamation-triangle me-2"></i>
              Publisher and Player IDs must be different
            </Alert>
          )}
          
          <Form.Group className="mb-3">
            <Form.Label>Publisher ID</Form.Label>
            <div className="input-group">
              {(!advancedMode && !prefillPublisher) && (
                <span className="input-group-text" title="Enable Advanced Mode in settings to edit">
                  <i className="bi bi-lock-fill text-muted"></i>
                </span>
              )}
              <Form.Control
                type="text"
                value={publisher}
                onChange={(e) => advancedMode && setPublisher(e.target.value)}
                required
                autoFocus={!prefillPublisher && advancedMode}
                readOnly={!!prefillPublisher || !advancedMode}
                placeholder="e.g., live_abc123"
              />
              {!prefillPublisher && (
                <Button
                  variant="outline-secondary"
                  type="button"
                  onClick={handleRegeneratePublisher}
                  title="Generate new Publisher ID"
                >
                  <i className="bi bi-arrow-clockwise"></i>
                </Button>
              )}
            </div>
            <Form.Text className="text-muted">
              {prefillPublisher 
                ? 'Adding a new player to this publisher'
                : advancedMode 
                  ? 'Unique identifier for the publisher (editable in advanced mode)'
                  : 'Unique identifier for the publisher (auto-generated)'
              }
            </Form.Text>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Player ID</Form.Label>
            <div className="input-group">
              {!advancedMode && (
                <span className="input-group-text" title="Enable Advanced Mode in settings to edit">
                  <i className="bi bi-lock-fill text-muted"></i>
                </span>
              )}
              <Form.Control
                type="text"
                value={player}
                onChange={(e) => advancedMode && setPlayer(e.target.value)}
                required
                autoFocus={!!prefillPublisher && advancedMode}
                readOnly={!advancedMode}
                placeholder="e.g., play_abc123"
              />
              <Button
                variant="outline-secondary"
                type="button"
                onClick={handleRegeneratePlayer}
                title="Generate new Player ID"
              >
                <i className="bi bi-arrow-clockwise"></i>
              </Button>
            </div>
            <Form.Text className="text-muted">
              {advancedMode 
                ? 'Unique identifier for the player (editable in advanced mode)'
                : 'Unique identifier for the player (auto-generated)'
              }
            </Form.Text>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Description (Optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Main studio feed"
              autoFocus={!advancedMode}
            />
            <Form.Text className="text-muted">
              Optional description for this stream
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            disabled={loading || !publisher.trim() || !player.trim() || areIdsIdentical}
          >
            {loading ? 'Adding...' : 'Add Stream'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}; 