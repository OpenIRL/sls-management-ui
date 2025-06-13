import React, { useState, useEffect, useCallback } from 'react';
import { Card, Collapse, Button, ProgressBar } from 'react-bootstrap';
import { StreamId, PublisherStats } from '../types/api.types';
import { apiService } from '../services/api.service';
import { StreamUrlsDialog } from './StreamUrlsDialog';

// Props for GroupedPublisherCard component
interface GroupedPublisherCardProps {
  publisherName: string;
  streamIds: StreamId[];
  onDelete?: (playerId: string) => void;
  onAddPlayer?: (publisher: string) => void;
  refreshInterval?: number;
}

// Constants for refresh intervals
const ACTIVE_REFRESH_INTERVAL = 5000; // 5 seconds for active publishers
const INACTIVE_REFRESH_INTERVAL = 10000; // 10 seconds for inactive publishers

// Grouped Publisher Card component for displaying a publisher with multiple player IDs
export const GroupedPublisherCard: React.FC<GroupedPublisherCardProps> = ({
  publisherName,
  streamIds,
  onDelete,
  onAddPlayer,
  refreshInterval, // Keep for backward compatibility, but will be ignored
}) => {
  const [expanded, setExpanded] = useState(false);
  const [stats, setStats] = useState<PublisherStats | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedStreamId, setSelectedStreamId] = useState<StreamId | null>(null);
  const [urlsDialogOpen, setUrlsDialogOpen] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [secondsUntilUpdate, setSecondsUntilUpdate] = useState(0);

  // Calculate current refresh interval based on online status
  const currentRefreshInterval = isOnline ? ACTIVE_REFRESH_INTERVAL : INACTIVE_REFRESH_INTERVAL;

  // Fetch publisher statistics using any of the player IDs
  const fetchStats = useCallback(async () => {
    if (streamIds.length === 0) {
      setStats(null);
      setIsOnline(false);
      setLoading(false);
      return;
    }

    try {
      // Use the first player ID to fetch the stats (all players have the same stats)
      const publisherStats = await apiService.getPublisherStats(streamIds[0].player);
      setStats(publisherStats);
      setIsOnline(!!publisherStats);
      setLoading(false);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats(null);
      setIsOnline(false);
      setLoading(false);
    }
  }, [streamIds]);

  // Dynamic interval based on online status
  useEffect(() => {
    // Initial fetch
    fetchStats();

    // Set up interval with dynamic refresh rate
    const intervalId = setInterval(() => {
      fetchStats();
    }, currentRefreshInterval);

    // Clean up interval on unmount or when dependencies change
    return () => clearInterval(intervalId);
  }, [streamIds, isOnline, currentRefreshInterval, fetchStats]); // Re-create interval when online status changes

  // Countdown timer effect
  useEffect(() => {
    const countdownInterval = setInterval(() => {
      const now = new Date();
      const timeSinceLastUpdate = now.getTime() - lastUpdate.getTime();
      const timeUntilNextUpdate = currentRefreshInterval - timeSinceLastUpdate;
      const secondsRemaining = Math.max(0, Math.ceil(timeUntilNextUpdate / 1000));
      setSecondsUntilUpdate(secondsRemaining);
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [lastUpdate, currentRefreshInterval]);

  // Format uptime to human readable format
  const formatUptime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  // Format bitrate to human readable format
  const formatBitrate = (bitrate: number): string => {
    if (bitrate >= 1000) {
      return `${(bitrate / 1000).toFixed(2)} Mbps`;
    }
    return `${bitrate} Kbps`;
  };

  // Handle showing URLs for a stream
  const handleShowUrls = (streamId: StreamId) => {
    setSelectedStreamId(streamId);
    setUrlsDialogOpen(true);
  };

  return (
    <>
      <Card className="mb-3 position-relative">
        {loading && (
          <ProgressBar 
            animated 
            now={100} 
            className="position-absolute top-0 start-0 w-100" 
            style={{ height: '2px', borderRadius: 0 }}
          />
        )}
        
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center">
            <div className="flex-grow-1">
              <h5 className="mb-1 d-flex align-items-center">
                <i className="bi bi-broadcast me-2"></i>
                Publisher: {publisherName}
              </h5>
              <p className="text-muted mb-0 small">
                {streamIds.length} Player ID{streamIds.length !== 1 ? 's' : ''} configured
              </p>
            </div>
            
            <div className="d-flex align-items-center gap-2">
              <div 
                className={`d-flex align-items-center px-3 py-1 rounded-pill`}
                style={{ 
                  backgroundColor: isOnline ? 'rgba(25, 135, 84, 0.2)' : 'rgba(108, 117, 125, 0.2)',
                  border: `1px solid ${isOnline ? 'rgba(25, 135, 84, 0.3)' : 'rgba(108, 117, 125, 0.3)'}`
                }}
              >
                <span 
                  className={`d-inline-block rounded-circle me-2 ${isOnline ? 'pulse bg-success' : 'bg-secondary'}`}
                  style={{ width: '8px', height: '8px' }}
                ></span>
                <span className={`small fw-medium ${isOnline ? 'text-success' : 'text-secondary'}`}>
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
              <div 
                className="d-flex align-items-center px-2 py-1 rounded"
                style={{ 
                  backgroundColor: 'rgba(108, 117, 125, 0.1)',
                  fontSize: '0.75rem'
                }}
                title={`Next update in ${secondsUntilUpdate} seconds`}
              >
                <i className="bi bi-arrow-clockwise me-1"></i>
                <span className="text-muted">{secondsUntilUpdate}s</span>
              </div>
              {onAddPlayer && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onAddPlayer(publisherName)}
                  title="Add Player ID"
                  className="d-flex align-items-center"
                >
                  <i className="bi bi-plus-lg"></i>
                </Button>
              )}
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
              {/* Publisher Statistics */}
              {isOnline && stats ? (
                <div className="stats-grid mb-3">
                  <div className="stat-item">
                    <i className="bi bi-speedometer2 stat-icon"></i>
                    <div>
                      <div className="stat-label">Bitrate</div>
                      <div className="stat-value">{formatBitrate(stats.bitrate)}</div>
                    </div>
                  </div>
                  
                  <div className="stat-item">
                    <i className="bi bi-clock stat-icon"></i>
                    <div>
                      <div className="stat-label">Uptime</div>
                      <div className="stat-value">{formatUptime(stats.uptime)}</div>
                    </div>
                  </div>
                  
                  <div className="stat-item">
                    <i className="bi bi-activity stat-icon"></i>
                    <div>
                      <div className="stat-label">RTT</div>
                      <div className="stat-value">{stats.rtt.toFixed(2)} ms</div>
                    </div>
                  </div>
                  
                  <div className="stat-item">
                    <i className={`bi bi-exclamation-triangle stat-icon ${stats.pktRcvLoss > 0 ? 'text-warning' : ''}`}></i>
                    <div>
                      <div className="stat-label">Packet Loss</div>
                      <div className={`stat-value ${stats.pktRcvLoss > 0 ? 'text-warning' : ''}`}>
                        {stats.pktRcvLoss}
                      </div>
                    </div>
                  </div>
                  
                  <div className="stat-item">
                    <i className={`bi bi-x-octagon stat-icon ${stats.pktRcvDrop > 0 ? 'text-danger' : ''}`}></i>
                    <div>
                      <div className="stat-label">Packet Drop</div>
                      <div className={`stat-value ${stats.pktRcvDrop > 0 ? 'text-danger' : ''}`}>
                        {stats.pktRcvDrop}
                      </div>
                    </div>
                  </div>
                </div>
              ) : !isOnline ? (
                <div className="text-center text-muted py-3">
                  <i className="bi bi-broadcast-pin display-6 mb-2 d-block opacity-50"></i>
                  <p className="mb-0">No statistics available</p>
                </div>
              ) : null}

              {/* Player IDs Section */}
              <div className="player-ids-section">
                <h6 className="text-muted mb-2 small text-uppercase">Player IDs:</h6>
                <div className="player-ids-list">
                  {streamIds.map((streamId) => (
                    <div 
                      key={streamId.player}
                      className="player-id-item d-flex justify-content-between align-items-center p-2 rounded mb-1"
                    >
                      <div className="d-flex align-items-center flex-grow-1">
                        <code className="text-primary me-2">{streamId.player}</code>
                        {streamId.description && (
                          <span className="text-muted small">- {streamId.description}</span>
                        )}
                      </div>
                      <div className="d-flex align-items-center gap-1">
                        <Button
                          variant="link"
                          size="sm"
                          className="text-info p-1"
                          onClick={() => handleShowUrls(streamId)}
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
                  ))}
                </div>
              </div>
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