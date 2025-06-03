// pages/settings.tsx
import { useState } from 'react';
import DropdownMenu from '@/components/DropdownMenu';
import { useRouter } from 'next/router';

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  const handleSave = () => {
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
            { label: 'Logout', onClick: () => alert('Logout not implemented yet.') },
          ]}
        />
      </header>

      <main className="flex flex-col items-center py-12">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        <div className="bg-white text-black rounded-lg shadow-md p-6 w-full max-w-md">
          <label className="flex items-center space-x-4 mb-4">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span>Enable Dark Mode</span>
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
