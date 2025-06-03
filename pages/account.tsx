import { useRouter } from 'next/router';
import DropdownMenu from '@/components/DropdownMenu';
import useDarkMode from '@/components/useDarkMode'; // or '@/hooks/useDarkMode' if that is correct

export default function Account() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useDarkMode();

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
            { label: 'Logout', onClick: () => alert('Logout not implemented yet.') },
          ]}
        />
      </header>

      <main className="py-12 max-w-xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Account Details</h1>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span>Dark Mode</span>
          </label>
        </div>

        <div className="bg-white text-black rounded-lg shadow-md p-6 space-y-4">
          <div>
            <p className="font-semibold">Name:</p>
            <p>John Doe</p>
          </div>
          <div>
            <p className="font-semibold">Email:</p>
            <p>john.doe@example.com</p>
          </div>
          <div>
            <p className="font-semibold">Role:</p>
            <p>Coach</p>
          </div>
          <div>
            <p className="font-semibold">Team:</p>
            <p>Northside Hawks</p>
          </div>
        </div>
      </main>
    </div>
  );
}
