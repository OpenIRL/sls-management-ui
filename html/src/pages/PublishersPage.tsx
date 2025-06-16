import React, { useState, useEffect, useCallback } from 'react';
import { Container, Navbar, Nav, Button, Alert, Spinner, Card } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api.service';
import { StreamId } from '../types/api.types';
import { PublisherCard } from '../components/publisher';
import { AddStreamDialog, SettingsDialog } from '../components/dialogs';

// Main publishers page component
export const PublishersPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [streamIds, setStreamIds] = useState<StreamId[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [prefillPublisher, setPrefillPublisher] = useState<string | undefined>(undefined);

  // Group stream IDs by publisher
  const groupedStreamIds = React.useMemo(() => {
    const groups: Record<string, StreamId[]> = {};
    streamIds.forEach(streamId => {
      if (!groups[streamId.publisher]) {
        groups[streamId.publisher] = [];
      }
      groups[streamId.publisher].push(streamId);
    });
    return groups;
  }, [streamIds]);

  // Fetch stream IDs from API
  const fetchStreamIds = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const data = await apiService.getStreamIds();
      setStreamIds(data);
    } catch (err: any) {
      console.error('Error fetching stream IDs:', err);
      if (err.response?.status === 401) {
        setError('Authentication failed. Please check your API key in settings.');
      } else {
        setError('Failed to fetch stream IDs. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch data on mount and when authentication changes
  useEffect(() => {
    fetchStreamIds();
  }, [isAuthenticated, fetchStreamIds]);

  // Handle stream added
  const handleStreamAdded = (newStreamId: StreamId) => {
    setStreamIds([...streamIds, newStreamId]);
    setPrefillPublisher(undefined);
  };

  // Handle stream deletion
  const handleDeleteStream = async (playerId: string) => {
    try {
      await apiService.deleteStreamId(playerId);
      setStreamIds(streamIds.filter(s => s.player !== playerId));
    } catch (err: any) {
      console.error('Error deleting stream:', err);
      setError('Failed to delete stream. Please try again.');
    }
  };

  // Handle add player to existing publisher
  const handleAddPlayer = (publisher: string) => {
    setPrefillPublisher(publisher);
    setAddDialogOpen(true);
  };

  return (
    <>
      <Navbar className="navbar-dark sticky-top" expand="lg">
        <Container fluid>
          <Navbar.Brand href="#">
            <i className="bi bi-broadcast me-2"></i>
            SRT Live Server Management
          </Navbar.Brand>
          <Nav className="ms-auto">
            <Button
              variant="link"
              className="nav-link"
              onClick={() => setSettingsDialogOpen(true)}
              title="Settings"
            >
              <i className="bi bi-gear"></i>
            </Button>
          </Nav>
        </Container>
      </Navbar>

      <Container className="py-4">
        {!isAuthenticated ? (
          <Card className="text-center">
            <Card.Body className="py-5">
              <h3 className="mb-3">Welcome to SRT Live Server Management</h3>
              <p className="text-muted mb-4">
                Please configure your API key to get started.
              </p>
              <Button
                variant="primary"
                size="lg"
                onClick={() => setSettingsDialogOpen(true)}
              >
                <i className="bi bi-gear me-2"></i>
                Configure Settings
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4 gap-2">
              <div className="page-headline">
                <h2 className="mb-1">Publishers</h2>
                <p className="text-muted mb-0">
                  Manage your SRT publishers and monitor their status
                </p>
              </div>
              
              <Button
                variant="primary"
                onClick={() => {
                  setPrefillPublisher(undefined);
                  setAddDialogOpen(true);
                }}
                disabled={loading}
                className="text-nowrap"
              >
                <i className="bi bi-plus-lg me-2"></i>
                Add Stream
              </Button>
            </div>

            {error && (
              <Alert 
                variant="danger" 
                dismissible 
                onClose={() => setError(null)}
                className="mb-3"
              >
                {error}
              </Alert>
            )}

            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : streamIds.length === 0 ? (
              <Card className="text-center">
                <Card.Body className="py-5">
                  <h5 className="mb-3">No streams configured</h5>
                  <p className="text-muted mb-4">
                    Add your first stream to get started
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setPrefillPublisher(undefined);
                      setAddDialogOpen(true);
                    }}
                  >
                    <i className="bi bi-plus-lg me-2"></i>
                    Add Stream
                  </Button>
                </Card.Body>
              </Card>
            ) : (
              <div>
                {Object.entries(groupedStreamIds).map(([publisher, publisherStreamIds]) => (
                  <PublisherCard
                    key={publisher}
                    publisherName={publisher}
                    streamIds={publisherStreamIds}
                    onDelete={handleDeleteStream}
                    onAddPlayer={handleAddPlayer}
                  />
                ))}
              </div>
            )}
          </>
        )}

        <AddStreamDialog
          open={addDialogOpen}
          onClose={() => {
            setAddDialogOpen(false);
            setPrefillPublisher(undefined);
          }}
          onStreamAdded={handleStreamAdded}
          prefillPublisher={prefillPublisher}
        />

        <SettingsDialog
          open={settingsDialogOpen}
          onClose={() => setSettingsDialogOpen(false)}
        />
      </Container>
    </>
  );
}; 