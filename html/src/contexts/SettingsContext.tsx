import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Settings context interface
interface SettingsContextType {
  advancedMode: boolean;
  setAdvancedMode: (enabled: boolean) => void;
}

// Create context
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Settings Provider component
export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [advancedMode, setAdvancedModeState] = useState<boolean>(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedAdvancedMode = localStorage.getItem('srt-advanced-mode');
    if (savedAdvancedMode === 'true') {
      setAdvancedModeState(true);
    }
  }, []);

  // Set advanced mode and save to localStorage
  const setAdvancedMode = (enabled: boolean) => {
    setAdvancedModeState(enabled);
    localStorage.setItem('srt-advanced-mode', enabled.toString());
  };

  return (
    <SettingsContext.Provider
      value={{
        advancedMode,
        setAdvancedMode,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

// Custom hook to use settings context
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}; 