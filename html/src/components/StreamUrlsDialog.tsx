import React, { useState } from 'react';
import { Modal, Button, Card, Alert, InputGroup, FormControl } from 'react-bootstrap';
import { StreamId } from '../types/api.types';
import { getStreamUrls } from '../utils/url-generator';

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
    const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

    if (!streamId) return null;

    const urls = getStreamUrls(streamId);

    // Handle copy to clipboard
    const handleCopy = async (url: string) => {
        try {
            await navigator.clipboard.writeText(url);
            setCopiedUrl(url);
            setTimeout(() => setCopiedUrl(null), 2000); // Reset after 2 seconds
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <Modal show={open} onHide={onClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    <i className="bi bi-link-45deg me-2"></i>
                    Stream URLs
                </Modal.Title>
            </Modal.Header>
            
            <Modal.Body>
                {streamId.description && (
                    <Alert variant="info" className="mb-4">
                        <i className="bi bi-info-circle me-2"></i>
                        <span className="mt-1 small">{streamId.description}</span>
                    </Alert>
                )}

                {urls.map((urlInfo) => (
                    <Card key={urlInfo.label} className="mb-3">
                        <Card.Body>
                            <div className="d-flex align-items-center mb-2">
                                <i className={`${urlInfo.icon} me-2 text-primary`}></i>
                                <h6 className="mb-0">{urlInfo.label}</h6>
                            </div>
                            
                            <p className="text-muted small mb-2">{urlInfo.description}</p>
                            
                            <InputGroup>
                                <FormControl
                                    type="text"
                                    value={urlInfo.url}
                                    readOnly
                                    className="font-monospace"
                                    onClick={(e) => (e.target as HTMLInputElement).select()}
                                />
                                <Button
                                    variant={copiedUrl === urlInfo.url ? 'success' : 'outline-secondary'}
                                    onClick={() => handleCopy(urlInfo.url)}
                                    title="Copy to clipboard"
                                >
                                    <i className={`bi bi-${copiedUrl === urlInfo.url ? 'check2' : 'clipboard'}`}></i>
                                    {copiedUrl === urlInfo.url ? ' Copied!' : ' Copy'}
                                </Button>
                            </InputGroup>
                        </Card.Body>
                    </Card>
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