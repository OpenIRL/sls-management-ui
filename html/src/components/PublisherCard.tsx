import React, { useEffect, useState } from 'react';
import { Card, Collapse, Badge, Button, ProgressBar } from 'react-bootstrap';
import { StreamId, PublisherStats } from '../types/api.types';
import { apiService } from '../services/api.service';

// Props for PublisherCard component
interface PublisherCardProps {
  streamId: StreamId;
  onDelete?: (playerId: string) => void;
}

// Constants for refresh intervals
const ACTIVE_REFRESH_INTERVAL = 5000; // 5 seconds for active publishers
const INACTIVE_REFRESH_INTERVAL = 10000; // 10 seconds for inactive publishers

// Publisher Card component for displaying publisher information
export const PublisherCard: React.FC<PublisherCardProps> = ({
  streamId,
  onDelete
}) => {
  const [expanded, setExpanded] = useState(false);
  const [stats, setStats] = useState<PublisherStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [secondsUntilUpdate, setSecondsUntilUpdate] = useState(0);

  // Calculate current refresh interval based on online status
  const currentRefreshInterval = isOnline ? ACTIVE_REFRESH_INTERVAL : INACTIVE_REFRESH_INTERVAL;

  // Fetch publisher statistics
  const fetchStats = async () => {
    try {
      const publisherStats = await apiService.getPublisherStats(streamId.player);
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
  };

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
  }, [streamId.player, isOnline]); // Re-create interval when online status changes

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
    if (bitrate >= 1000000) {
      return `${(bitrate / 1000000).toFixed(2)} Mbps`;
    }
    return `${(bitrate / 1000).toFixed(0)} Kbps`;
  };

  return (
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
            <h6 className="mb-2">Publisher: {streamId.publisher}</h6>
            <p className="text-muted small mb-1">Player ID: {streamId.player}</p>
            {streamId.description && (
              <p className="text-muted small mb-0">{streamId.description}</p>
            )}
          </div>
          
          <div className="d-flex align-items-center gap-2">
            <Badge bg={isOnline ? 'success' : 'secondary'}>
              <i className={`bi bi-broadcast${isOnline ? '' : '-pin'} me-1`}></i>
              {isOnline ? 'Online' : 'Offline'}
            </Badge>
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
            {onDelete && (
              <Button
                variant="link"
                size="sm"
                className="text-danger p-1"
                onClick={() => onDelete(streamId.player)}
                title="Delete"
              >
                <i className="bi bi-trash"></i>
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
            {stats ? (
              <div className="stats-grid">
                <div className="stat-item">
                  <i className="bi bi-speedometer stat-icon"></i>
                  <div>
                    <div className="stat-label">Bitrate</div>
                    <div className="stat-value">{formatBitrate(stats.bitrate)}</div>
                  </div>
                </div>
                
                <div className="stat-item">
                  <i className="bi bi-clock-history stat-icon"></i>
                  <div>
                    <div className="stat-label">Uptime</div>
                    <div className="stat-value">{formatUptime(stats.uptime)}</div>
                  </div>
                </div>
                
                <div className="stat-item">
                  <i className="bi bi-wifi stat-icon"></i>
                  <div>
                    <div className="stat-label">RTT</div>
                    <div className="stat-value">{stats.rtt.toFixed(2)} ms</div>
                  </div>
                </div>
                
                <div className="stat-item">
                  <i className="bi bi-download stat-icon"></i>
                  <div>
                    <div className="stat-label">Receive Rate</div>
                    <div className="stat-value">{stats.mbpsRecvRate.toFixed(2)} Mbps</div>
                  </div>
                </div>
                
                <div className="stat-item">
                  <i className={`bi bi-exclamation-triangle stat-icon ${stats.pktRcvLoss > 0 ? 'text-danger' : ''}`}></i>
                  <div>
                    <div className="stat-label">Packet Loss</div>
                    <div className={`stat-value ${stats.pktRcvLoss > 0 ? 'text-danger' : ''}`}>
                      {stats.pktRcvLoss}
                    </div>
                  </div>
                </div>
                
                <div className="stat-item">
                  <i className={`bi bi-x-circle stat-icon ${stats.pktRcvDrop > 0 ? 'text-danger' : ''}`}></i>
                  <div>
                    <div className="stat-label">Packet Drop</div>
                    <div className={`stat-value ${stats.pktRcvDrop > 0 ? 'text-danger' : ''}`}>
                      {stats.pktRcvDrop}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center text-muted mb-0">No statistics available</p>
            )}
          </div>
        </Collapse>
      </Card.Body>
    </Card>
  );
}; 