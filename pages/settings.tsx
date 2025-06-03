import { useState } from 'react';
import DropdownMenu from '@/components/DropdownMenu';
import { useRouter } from 'next/router';
import useDarkMode from '@/components/useDarkMode';

export default function Settings() {
  const [language, setLanguage] = useState('en');
  const [defaultPage, setDefaultPage] = useState('/dashboard');
  const [compactMode, setCompactMode] = useState(false);
  const [fontSize, setFontSize] = useState('base');
  const [displayName, setDisplayName] = useState('');
  const { darkMode } = useDarkMode(); // still respects saved preference
  const router = useRouter();

  const handleSave = () => {
    // Ideally save to localStorage or a backend
    alert('Settings saved!');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-[#a0b8c6] text-black'}`}>
      <header className="bg-[#092c48] text-white flex justify-between items-center px-6 py-4">
        <div className="flex items-center space-x-3">
          <img src="/logo.png" className="w-8 h-8" alt="Logo" />
          <span className="text-xl font-bold">Nextplay stats</span>
        </div>
        <DropdownMenu
          label="Account"
          items={[
            { label: 'Dashboard', onClick: () => router.push('/dashboard') },
            { label: 'Account', onClick: () => router.push('/account') },
            { label: 'Settings', onClick: () => router.push('/settings') },
            { label: 'Help', onClick: () => router.push('/help') },
            { label: 'Logout', onClick: async () => router.push('/logout') },
          ]}
        />
      </header>

      <main className="flex flex-col items-center py-12">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        <div className="bg-white text-black rounded-lg shadow-md p-6 w-full max-w-md space-y-6">

          {/* Option 2: Language */}
          <div>
            <label className="block font-semibold mb-1">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>

          {/* Option 3: Default Page */}
          <div>
            <label className="block font-semibold mb-1">Default Page on Login</label>
            <select
              value={defaultPage}
              onChange={(e) => setDefaultPage(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="/dashboard">Dashboard</option>
              <option value="/account">Account</option>
              <option value="/help">Help</option>
              <option value="/settings">Settings</option>
            </select>
          </div>

          {/* Option 4: Compact Mode */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={compactMode}
              onChange={() => setCompactMode(!compactMode)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span>Enable Compact Mode</span>
          </div>

          {/* Option 5: Font Size */}
          <div>
            <label className="block font-semibold mb-1">Font Size</label>
            <select
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="sm">Small</option>
              <option value="base">Normal</option>
              <option value="lg">Large</option>
            </select>
          </div>

          {/* Option 6: Display Name */}
          <div>
            <label className="block font-semibold mb-1">Custom Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Optional override"
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>

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
