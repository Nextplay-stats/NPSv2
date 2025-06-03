// pages/settings.tsx
import { useEffect, useState } from 'react';
import DropdownMenu from '@/components/DropdownMenu';
import { useRouter } from 'next/router';
import useDarkMode from '@/components/useDarkMode';

type SettingsState = {
  darkMode: boolean;
  showPlayerNames: boolean;  // #2: Show player names in reports
  defaultReport: string;      // #3: Default report on dashboard
  enableExports: boolean;     // #4: Enable export options
  emailUpdates: boolean;      // #5: Email updates toggle
  notifyOnLogin: boolean;     // #6: Notify on login toggle
};

const SETTINGS_KEY = 'nextplay_settings';

export default function Settings() {
  const router = useRouter();

  // Use the global dark mode hook
  const [darkMode, setDarkMode] = useDarkMode();

  // Other settings managed locally and persisted in localStorage
  const [settings, setSettings] = useState<SettingsState>({
    darkMode: darkMode,
    showPlayerNames: true,
    defaultReport: 'playerStats',
    enableExports: true,
    emailUpdates: false,
    notifyOnLogin: false,
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setSettings((prev) => ({ ...prev, ...parsed }));
      if (typeof parsed.darkMode === 'boolean') {
        setDarkMode(parsed.darkMode);
      }
    }
  }, [setDarkMode]);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  // Handle individual setting changes
  const handleChange = (key: keyof SettingsState, value: any) => {
    if (key === 'darkMode') {
      setDarkMode(value);
    }
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    alert('Settings saved!');
    // You can also trigger API calls here if needed to sync with server
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-[#a0b8c6] text-black'}`}>
      <header className="bg-[#092c48] text-white flex justify-between items-center px-6 py-4">
        <div className="flex items-center space-x-3">
          <img src="/logo.png" alt="Logo" className="w-8 h-8" />
          <span className="text-xl font-bold">Nextplay stats</span>
        </div>
        <DropdownMenu
          label="Account"
          items={[
            { label: 'Dashboard', onClick: () => router.push('/dashboard') },
            { label: 'Account', onClick: () => router.push('/account') },
            { label: 'Settings', onClick: () => router.push('/settings') },
            { label: 'Help', onClick: () => router.push('/help') },
            { label: 'Logout', onClick: () => alert('Logout not implemented yet.') },
          ]}
        />
      </header>

      <main className="flex flex-col items-center py-12">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        <div className="bg-white text-black rounded-lg shadow-md p-6 w-full max-w-md space-y-6">
          {/* Dark Mode Toggle */}
          <label className="flex items-center space-x-4">
            <input
              type="checkbox"
              checked={settings.darkMode}
              onChange={(e) => handleChange('darkMode', e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span>Enable Dark Mode</span>
          </label>

          {/* Show Player Names in Reports */}
          <label className="flex items-center space-x-4">
            <input
              type="checkbox"
              checked={settings.showPlayerNames}
              onChange={(e) => handleChange('showPlayerNames', e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span>Show Player Names in Reports</span>
          </label>

          {/* Default Report Selector */}
          <label className="block">
            <span className="font-semibold mb-1 block">Default Dashboard Report</span>
            <select
              value={settings.defaultReport}
              onChange={(e) => handleChange('defaultReport', e.target.value)}
              className="w-full border border-gray-300 rounded p-2"
            >
              <option value="playerStats">Player Stats</option>
              <option value="teamComparison">Team Comparison</option>
              <option value="nblOverview">NBL Overview</option>
              <option value="adminPanel">Admin Panel</option>
            </select>
          </label>

          {/* Enable Export Options */}
          <label className="flex items-center space-x-4">
            <input
              type="checkbox"
              checked={settings.enableExports}
              onChange={(e) => handleChange('enableExports', e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span>Enable Export Options on Tables</span>
          </label>

          {/* Email Updates */}
          <label className="flex items-center space-x-4">
            <input
              type="checkbox"
              checked={settings.emailUpdates}
              onChange={(e) => handleChange('emailUpdates', e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span>Receive Email Updates</span>
          </label>

          {/* Notify on Login */}
          <label className="flex items-center space-x-4">
            <input
              type="checkbox"
              checked={settings.notifyOnLogin}
              onChange={(e) => handleChange('notifyOnLogin', e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span>Notify Me on Login</span>
          </label>

          <button
            onClick={handleSave}
            className="bg-[#3e5e73] hover:bg-[#2d4a5e] text-white font-semibold py-2 px-4 rounded"
          >
            Save Settings
          </button>
        </div>
      </main>
    </div>
  );
}
