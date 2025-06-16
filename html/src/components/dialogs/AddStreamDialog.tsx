import React, { useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { apiService } from '../../services/api.service';
import { useSettings } from '../../contexts/SettingsContext';
import { StreamId } from '../../types/api.types';
import { IdGeneratorField, TextareaField } from '../form';
import { generateUUID, generateDefaultStreamIds } from '../../utils/uuid';

// Props for AddStreamDialog component
interface AddStreamDialogProps {
  open: boolean;
  onClose: () => void;
  onStreamAdded: (streamId: StreamId) => void;
  prefillPublisher?: string;
}

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
      const { publisherId, playerId } = generateDefaultStreamIds();
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
      const newStreamId: StreamId = {
        publisher: publisher.trim(),
        player: player.trim(),
        description: description.trim() || undefined,
      };

      await apiService.addStreamId(newStreamId);

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
          <Modal.Title className="add-stream-dialog-title">
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
          
          <IdGeneratorField
            label="Publisher ID"
            value={publisher}
            onChange={advancedMode ? setPublisher : undefined}
            onRegenerate={handleRegeneratePublisher}
            placeholder="e.g., live_abc123"
            helpText={
              prefillPublisher 
                ? 'Adding a new player to this publisher'
                : advancedMode 
                  ? 'Unique identifier for the publisher (editable in advanced mode)'
                  : 'Unique identifier for the publisher (auto-generated)'
            }
            readOnly={!!prefillPublisher || !advancedMode}
            autoFocus={!prefillPublisher && advancedMode}
            showRegenerateButton={!prefillPublisher}
            required
          />
          
          <IdGeneratorField
            label="Player ID"
            value={player}
            onChange={advancedMode ? setPlayer : undefined}
            onRegenerate={handleRegeneratePlayer}
            placeholder="e.g., play_abc123"
            helpText={
              advancedMode 
                ? 'Unique identifier for the player (editable in advanced mode)'
                : 'Unique identifier for the player (auto-generated)'
            }
            readOnly={!advancedMode}
            autoFocus={!!prefillPublisher && advancedMode}
            required
          />
          
          <TextareaField
            label="Description (Optional)"
            value={description}
            onChange={setDescription}
            placeholder="e.g., Main studio feed"
            helpText="Optional description for this stream"
            rows={2}
            autoFocus={!advancedMode}
          />
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