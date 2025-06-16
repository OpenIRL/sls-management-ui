import React from 'react';
import { Card } from 'react-bootstrap';
import { CopyField } from '../form';

// URL information type
export interface UrlInfo {
  label: string;
  url: string;
  icon: string;
  description: string;
}

// Props for StreamUrlCard component
interface StreamUrlCardProps {
  urlInfo: UrlInfo;
}

// Component for displaying a single stream URL card
export const StreamUrlCard: React.FC<StreamUrlCardProps> = ({ urlInfo }) => {
  return (
    <Card className="mb-3">
      <Card.Body>
        <div className="d-flex align-items-center mb-2">
          <i className={`${urlInfo.icon} me-2 text-primary`}></i>
          <h6 className="mb-0">{urlInfo.label}</h6>
        </div>
        
        <p className="text-muted small mb-2">{urlInfo.description}</p>
        
        <CopyField
          label=""
          value={urlInfo.url}
          className="font-monospace"
          copyButtonText="Copy"
        />
      </Card.Body>
    </Card>
  );
}; 