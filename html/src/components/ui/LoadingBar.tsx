import React from 'react';
import { ProgressBar } from 'react-bootstrap';

// Props for LoadingBar component
interface LoadingBarProps {
  loading: boolean;
  className?: string;
}

// Reusable loading bar component
export const LoadingBar: React.FC<LoadingBarProps> = ({
  loading,
  className = ''
}) => {
  if (!loading) return null;
  
  return (
    <ProgressBar 
      animated 
      now={100} 
      className={`position-absolute top-0 start-0 w-100 ${className}`}
      style={{ height: '2px', borderRadius: 0 }}
    />
  );
}; 