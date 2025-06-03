// pages/account.tsx
import DropdownMenu from '@/components/DropdownMenu';
import { useRouter } from 'next/router';

export default function Account() {
  const router = useRouter();

  const accountDetails = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Coach',
    team: 'Thunderhawks',
  };

  return (
    <div className="min-h-screen bg-[#a0b8c6] text-black">
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
        <h1 className="text-2xl font-bold mb-6">Account Details</h1>
        <div className="bg-white text-black rounded-lg shadow-md p-6 w-full max-w-md">
          <p className="mb-4"><strong>Name:</strong> {accountDetails.name}</p>
          <p className="mb-4"><strong>Email:</strong> {accountDetails.email}</p>
          <p className="mb-4"><strong>Role:</strong> {accountDetails.role}</p>
          <p className="mb-4"><strong>Team:</strong> {accountDetails.team}</p>
        </div>
      </main>
    </div>
  );
}
