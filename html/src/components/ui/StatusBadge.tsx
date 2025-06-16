import React from 'react';

// Props for StatusBadge component
interface StatusBadgeProps {
  isOnline: boolean;
  showPulse?: boolean;
  className?: string;
}

// Reusable status badge component for displaying online/offline status
export const StatusBadge: React.FC<StatusBadgeProps> = ({
  isOnline,
  showPulse = true,
  className = ''
}) => {
  return (
    <div
      className={`d-flex align-items-center px-3 py-1 rounded-pill ${className}`}
      style={{
        backgroundColor: isOnline ? 'rgba(25, 135, 84, 0.2)' : 'rgba(108, 117, 125, 0.2)',
        border: `1px solid ${isOnline ? 'rgba(25, 135, 84, 0.3)' : 'rgba(108, 117, 125, 0.3)'}`
      }}
    >
      <span
        className={`d-inline-block rounded-circle me-2 ${isOnline && showPulse ? 'pulse' : ''} ${isOnline ? 'bg-success' : 'bg-secondary'}`}
        style={{ width: '8px', height: '8px' }}
      />
      <span className={`small fw-medium ${isOnline ? 'text-success' : 'text-secondary'}`}>
        {isOnline ? 'Online' : 'Offline'}
      </span>
    </div>
  );
}; 