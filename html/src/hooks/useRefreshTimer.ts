import { useState, useEffect } from 'react';

export const useRefreshTimer = (onExpire = (): void => undefined, refreshInterval: number) => {
  const [secondsUntilUpdate, setSecondsUntilUpdate] = useState(refreshInterval);

  useEffect(() => {
    setSecondsUntilUpdate(refreshInterval);
  }, [refreshInterval]);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      if (secondsUntilUpdate === 1) {
        onExpire();
        setSecondsUntilUpdate(refreshInterval);
        return;
      }

      setSecondsUntilUpdate(secondsUntilUpdate - 1);
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [secondsUntilUpdate, setSecondsUntilUpdate, refreshInterval, onExpire])

  return secondsUntilUpdate;
};