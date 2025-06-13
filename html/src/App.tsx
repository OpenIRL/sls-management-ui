import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { PublishersPage } from './pages/PublishersPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

// Main App component
function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <PublishersPage />
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App; 