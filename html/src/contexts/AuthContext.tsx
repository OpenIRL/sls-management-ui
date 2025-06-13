import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../services/api.service';

// Authentication context interface
interface AuthContextType {
  apiKey: string | null;
  isAuthenticated: boolean;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [apiKey, setApiKeyState] = useState<string | null>(null);

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('srt-api-key');
    
    if (savedApiKey) {
      setApiKeyState(savedApiKey);
      apiService.setApiKey(savedApiKey);
    }
  }, []);

  // Set API key and save to localStorage
  const setApiKey = (key: string) => {
    setApiKeyState(key);
    apiService.setApiKey(key);
    localStorage.setItem('srt-api-key', key);
  };

  // Clear API key
  const clearApiKey = () => {
    setApiKeyState(null);
    apiService.setApiKey('');
    localStorage.removeItem('srt-api-key');
  };

  return (
    <AuthContext.Provider
      value={{
        apiKey,
        isAuthenticated: !!apiKey,
        setApiKey,
        clearApiKey,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 