import React from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';
import { StreamId } from '../../types/api.types';
import { getStreamUrls } from '../../utils/url-generator';
import { StreamUrlCard } from '../publisher';

// Props for StreamUrlsDialog component
interface StreamUrlsDialogProps {
    open: boolean;
    onClose: () => void;
    streamId: StreamId | null;
}

// Dialog component for displaying stream URLs
export const StreamUrlsDialog: React.FC<StreamUrlsDialogProps> = ({
    open,
    onClose,
    streamId
}) => {
    if (!streamId) return null;

    const urls = getStreamUrls(streamId);

    return (
        <Modal show={open} onHide={onClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title className="d-flex gap-1">
                    <div className="stream-urls-dialog-headline">
                        <i className="bi bi-link-45deg me-2"></i>
                        Stream URLs
                    </div>
                    <span className="text-muted">- {streamId.description}</span>
                </Modal.Title>
            </Modal.Header>
            
            <Modal.Body>
                {urls.map((urlInfo) => (
                    <StreamUrlCard key={urlInfo.label} urlInfo={urlInfo} />
                ))}

                <Alert variant="secondary" className="mt-3 mb-0">
                    <i className="bi bi-lightbulb me-2"></i>
                    <strong>Tip:</strong> Click on any URL field to select all text for easy copying.
                </Alert>
            </Modal.Body>
            
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}; 