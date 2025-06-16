import { useState, useEffect, useCallback } from 'react';
import { PublisherStats } from '../types/api.types';
import { apiService } from '../services/api.service';
import { StreamId } from '../types/api.types';

// Constants for refresh intervals
const ACTIVE_REFRESH_INTERVAL = 5000; // 5 seconds for active publishers
const INACTIVE_REFRESH_INTERVAL = 10000; // 10 seconds for inactive publishers

// Result type for the hook
interface UsePublisherStatsResult {
  stats: PublisherStats | null;
  isOnline: boolean;
  loading: boolean;
  lastUpdate: Date;
  currentRefreshInterval: number;
}

// Custom hook for managing publisher statistics fetching
export const usePublisherStats = (streamIds: StreamId[]): UsePublisherStatsResult => {
  const [stats, setStats] = useState<PublisherStats | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

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
  }, [streamIds, isOnline, currentRefreshInterval, fetchStats]);

  return {
    stats,
    isOnline,
    loading,
    lastUpdate,
    currentRefreshInterval
  };
}; 