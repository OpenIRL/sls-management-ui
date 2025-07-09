import React from 'react';
import { PublisherStats as PublisherStatsType } from '../../types/api.types';
import { StatItem } from './StatItem';

// Props for PublisherStats component
interface PublisherStatsProps {
  stats: PublisherStatsType | null;
  isOnline: boolean;
}

// Component for displaying publisher statistics
export const PublisherStats: React.FC<PublisherStatsProps> = ({
  stats,
  isOnline
}) => {
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

  if (!isOnline || !stats) {
    return (
      <div className="text-center text-muted py-3">
        <i className="bi bi-broadcast-pin display-6 mb-2 d-block opacity-50"></i>
        <p className="mb-0">No statistics available</p>
      </div>
    );
  }

  return (
    <div className="stats-grid mb-3">
      <StatItem
        icon="bi bi-speedometer2"
        label="Bitrate"
        value={formatBitrate(stats.bitrate)}
      />
      
      <StatItem
        icon="bi bi-clock"
        label="Uptime"
        value={formatUptime(stats.uptime)}
      />
      
      <StatItem
        icon="bi bi-activity"
        label="RTT"
        value={`${stats.rtt.toFixed(2)} ms`}
      />
      
      <StatItem
        icon="bi bi-x-octagon"
        label="Packet Drop"
        value={stats.dropped_pkts}
        isDanger={stats.dropped_pkts > 0}
      />
    </div>
  );
}; 