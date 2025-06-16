import { useState, useEffect } from 'react';

// Custom hook for managing refresh timer countdown
export const useRefreshTimer = (lastUpdate: Date, refreshInterval: number) => {
  const [secondsUntilUpdate, setSecondsUntilUpdate] = useState(0);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      const now = new Date();
      const timeSinceLastUpdate = now.getTime() - lastUpdate.getTime();
      const timeUntilNextUpdate = refreshInterval - timeSinceLastUpdate;
      const secondsRemaining = Math.max(0, Math.ceil(timeUntilNextUpdate / 1000));
      setSecondsUntilUpdate(secondsRemaining);
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [lastUpdate, refreshInterval]);

  return secondsUntilUpdate;
}; 