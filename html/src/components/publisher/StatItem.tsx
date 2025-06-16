import React from 'react';

// Props for StatItem component
interface StatItemProps {
  icon: string;
  label: string;
  value: string | number;
  isDanger?: boolean;
  className?: string;
}

// Reusable stat item component for displaying single statistic
export const StatItem: React.FC<StatItemProps> = ({
  icon,
  label,
  value,
  isDanger = false,
  className = ''
}) => {
  return (
    <div className={`stat-item ${className}`}>
      <i className={`${icon} stat-icon ${isDanger ? 'text-danger' : ''}`}></i>
      <div>
        <div className="stat-label">{label}</div>
        <div className={`stat-value ${isDanger ? 'text-danger' : ''}`}>
          {value}
        </div>
      </div>
    </div>
  );
}; 