import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Settings = {
  language: string;
  fontSize: string;
  defaultReportPage: string;
  compactMode: boolean;
  customDisplayName: string;
};

type SettingsContextType = {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
};

const defaultSettings: Settings = {
  language: 'English',
  fontSize: 'medium',
  defaultReportPage: 'Player Stats',
  compactMode: false,
  customDisplayName: '',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    // Load from localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('userSettings');
      if (saved) return JSON.parse(saved);
    }
    return defaultSettings;
  });

  useEffect(() => {
    // Save settings to localStorage on change
    localStorage.setItem('userSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
