import React, { useState } from 'react';
import { Card, Collapse, Button } from 'react-bootstrap';
import { StreamId } from '../../types/api.types';
import { StreamUrlsDialog } from '../dialogs/StreamUrlsDialog';
import { StatusBadge, RefreshTimer, LoadingBar } from '../ui';
import { PublisherStats, PlayerIdList } from './';
import { usePublisherStats } from '../../hooks';

// Props for PublisherCard component
interface PublisherCardProps {
  publisherName: string;
  streamIds: StreamId[];
  onDelete?: (playerId: string) => void;
  onAddPlayer?: (publisher: string) => void;
}

// Publisher Card component for displaying a publisher with multiple player IDs
export const PublisherCard: React.FC<PublisherCardProps> = ({
  publisherName,
  streamIds,
  onDelete,
  onAddPlayer,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedStreamId, setSelectedStreamId] = useState<StreamId | null>(null);
  const [urlsDialogOpen, setUrlsDialogOpen] = useState(false);

  // Use custom hooks for stats and timer
  const { stats, isOnline, loading, secondsUntilUpdate } = usePublisherStats(streamIds);

  // Handle showing URLs for a stream
  const handleShowUrls = (streamId: StreamId) => {
    setSelectedStreamId(streamId);
    setUrlsDialogOpen(true);
  };

  return (
    <>
      <Card className="mb-3 position-relative">
        <LoadingBar loading={loading} />

        <Card.Body>
          <div className="d-flex justify-content-between align-items-center gap-2">
            <div className="d-flex flex-column" style={{minWidth: 0}}>
              <h5 className="mb-1 d-flex align-items-center">
                <i className="bi bi-broadcast me-2"></i>
                <span className="d-none d-lg-inline">Publisher:&nbsp;</span>
                <span className="publisher-card-publisher-name">{publisherName}</span>
              </h5>
              <p className="text-muted mb-0 small">
                {streamIds.length} Player ID{streamIds.length !== 1 ? 's' : ''} configured
              </p>
            </div>

            <div className="d-flex align-items-center gap-2">
              <RefreshTimer secondsUntilUpdate={secondsUntilUpdate} />
              <StatusBadge isOnline={isOnline} />
              <Button
                variant="link"
                size="sm"
                className="text-light p-1"
                onClick={() => setExpanded(!expanded)}
                aria-expanded={expanded}
                title={expanded ? 'Collapse' : 'Expand'}
              >
                <i className={`bi bi-chevron-${expanded ? 'up' : 'down'}`}></i>
              </Button>
            </div>
          </div>

          <Collapse in={expanded}>
            <div className="mt-3">
              <PublisherStats stats={stats} isOnline={isOnline} />
              <PlayerIdList
                streamIds={streamIds}
                publisherName={publisherName}
                onShowUrls={handleShowUrls}
                onDelete={onDelete}
                onAddPlayer={onAddPlayer}
              />
            </div>
          </Collapse>
        </Card.Body>
      </Card>

      <StreamUrlsDialog
        open={urlsDialogOpen}
        onClose={() => {
          setUrlsDialogOpen(false);
          setSelectedStreamId(null);
        }}
        streamId={selectedStreamId}
      />
    </>
  );
}; 