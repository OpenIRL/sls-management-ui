import React from 'react';
import { Button } from 'react-bootstrap';
import { StreamId } from '../../types/api.types';
import { PlayerIdItem } from './PlayerIdItem';

// Props for PlayerIdList component
interface PlayerIdListProps {
  streamIds: StreamId[];
  publisherName: string;
  onShowUrls: (streamId: StreamId) => void;
  onDelete?: (playerId: string) => void;
  onAddPlayer?: (publisher: string) => void;
}

// Component for managing list of player IDs
export const PlayerIdList: React.FC<PlayerIdListProps> = ({
  streamIds,
  publisherName,
  onShowUrls,
  onDelete,
  onAddPlayer
}) => {
  return (
    <div className="player-ids-section">
      <div className="d-flex justify-content-between align-items-baseline mb-3">
        <h6 className="text-muted small text-uppercase">Player IDs:</h6>
        {onAddPlayer && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onAddPlayer(publisherName)}
            title="Add Player"
            className="d-flex align-items-center"
          >
            <i className="bi bi-plus-lg"></i>
            Add Player
          </Button>
        )}
      </div>
      <div className="player-ids-list">
        {streamIds.map((streamId) => (
          <PlayerIdItem
            key={streamId.player}
            streamId={streamId}
            onShowUrls={onShowUrls}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}; 