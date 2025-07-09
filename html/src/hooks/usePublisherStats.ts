import { useState, useEffect, useCallback } from 'react';
import { PublisherStats } from '../types/api.types';
import { apiService } from '../services/api.service';
import { StreamId } from '../types/api.types';
import {useRefreshTimer} from "./useRefreshTimer";

// Constants for refresh intervals
const ACTIVE_REFRESH_INTERVAL = 5; // 5 seconds for active publishers
const INACTIVE_REFRESH_INTERVAL = 10; // 10 seconds for inactive publishers

// Result type for the hook
interface UsePublisherStatsResult {
  stats: PublisherStats | null;
  isOnline: boolean;
  loading: boolean;
  secondsUntilUpdate: number;
}

// Custom hook for managing publisher statistics fetching
export const usePublisherStats = (streamIds: StreamId[]): UsePublisherStatsResult => {
  const [stats, setStats] = useState<PublisherStats | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);

  const [refreshInterval, setRefreshInterval] = useState(INACTIVE_REFRESH_INTERVAL);

  // Calculate current refresh interval based on online status
  useEffect(() => {
    setRefreshInterval(isOnline ? ACTIVE_REFRESH_INTERVAL : INACTIVE_REFRESH_INTERVAL);
  }, [isOnline]);

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
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats(null);
      setIsOnline(false);
    } finally {
      setLoading(false);
    }
  }, [streamIds]);

  useEffect(() => {
    (async () => await fetchStats())();
  }, [fetchStats]);

  const secondsUntilUpdate = useRefreshTimer(fetchStats, refreshInterval);

  return {
    stats,
    isOnline,
    loading,
    secondsUntilUpdate
  };
}; 