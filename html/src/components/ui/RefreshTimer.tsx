import React from 'react';

// Props for RefreshTimer component
interface RefreshTimerProps {
  secondsUntilUpdate: number;
  className?: string;
}

// Reusable refresh timer component showing countdown until next update
export const RefreshTimer: React.FC<RefreshTimerProps> = ({
  secondsUntilUpdate,
  className = ''
}) => {
  return (
    <div
      className={`d-flex align-items-center px-2 py-1 rounded ${className}`}
      style={{backgroundColor: 'rgba(108, 117, 125, 0.1)', fontSize: '0.75rem'}}
      title={`Next update in ${secondsUntilUpdate} seconds`}
    >
      <i className="bi bi-arrow-clockwise me-1"></i>
      <span className="text-muted">{secondsUntilUpdate}s</span>
    </div>
  );
}; 