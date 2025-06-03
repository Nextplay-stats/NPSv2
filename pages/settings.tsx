// pages/settings.tsx
import { useRouter } from 'next/router';
import DropdownMenu from '@/components/DropdownMenu';
import { useSettings } from '@/context/SettingsContext';

export default function Settings() {
  const router = useRouter();
  const { settings, updateSettings } = useSettings();

  const handleSave = () => {
    alert('Settings saved!');
  };

  return (
    <div className={`min-h-screen ${settings.compactMode ? 'bg-gray-900 text-white' : 'bg-[#a0b8c6] text-black'}`}>
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
            { label: 'Logout', onClick: () => alert('Logout not implemented yet.') },
          ]}
        />
      </header>

      <main className="flex flex-col items-center py-12">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        <div className="bg-white text-black rounded-lg shadow-md p-6 w-full max-w-md space-y-4">

          <label className="block">
            Language:
            <select
              value={settings.language}
              onChange={(e) => updateSettings({ language: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded p-2"
            >
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </label>

          <label className="block">
            Font Size:
            <select
              value={settings.fontSize}
              onChange={(e) => updateSettings({ fontSize: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded p-2"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </label>

          <label className="block">
            Default Report Page:
            <select
              value={settings.defaultReportPage}
              onChange={(e) => updateSettings({ defaultReportPage: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded p-2"
            >
              <option>Player Stats</option>
              <option>Team Comparison</option>
              <option>NBL Overview</option>
              <option>Admin Panel</option>
            </select>
          </label>

          <label className="flex items-center space-x-4">
            <input
              type="checkbox"
              checked={settings.compactMode}
              onChange={(e) => updateSettings({ compactMode: e.target.checked })}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span>Enable Compact Mode</span>
          </label>

          <label className="block">
            Custom Display Name:
            <input
              type="text"
              value={settings.customDisplayName}
              onChange={(e) => updateSettings({ customDisplayName: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded p-2"
              placeholder="Enter display name"
            />
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
