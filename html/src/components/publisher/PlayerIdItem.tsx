import React from 'react';
import { Button } from 'react-bootstrap';
import { StreamId } from '../../types/api.types';

// Props for PlayerIdItem component
interface PlayerIdItemProps {
  streamId: StreamId;
  onShowUrls: (streamId: StreamId) => void;
  onDelete?: (playerId: string) => void;
}

// Component for displaying a single player ID item
export const PlayerIdItem: React.FC<PlayerIdItemProps> = ({
  streamId,
  onShowUrls,
  onDelete
}) => {
  return (
    <div className="player-id-item d-flex justify-content-between align-items-center p-2 rounded mb-1 gap-2">
      <div className="d-flex align-items-center gap-2" style={{minWidth: 0}}>
        <code className="text-primary publisher-card-player-name">{streamId.player}</code>
        {streamId.description && (
          <span className="text-muted small text-nowrap">- {streamId.description}</span>
        )}
      </div>
      <div className="d-flex align-items-center gap-1">
        <Button
          variant="link"
          size="sm"
          className="text-info p-1"
          onClick={() => onShowUrls(streamId)}
          title="Show URLs"
        >
          <i className="bi bi-link-45deg"></i>
        </Button>
        {onDelete && (
          <Button
            variant="link"
            size="sm"
            className="text-danger p-1"
            onClick={() => onDelete(streamId.player)}
            title="Delete Player ID"
          >
            <i className="bi bi-trash"></i>
          </Button>
        )}
      </div>
    </div>
  );
}; 