import { useRouter } from 'next/router';
import { useMsal } from '@azure/msal-react';
import { useEffect, useState } from 'react';
import Spinner from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import DropdownMenu from '@/components/DropdownMenu';

const reports = {
  Players: [
    { id: 'playerStats', title: 'Player Stats', description: 'Player-specific performance data.' },
  ],
  Coach: [
    { id: 'teamComparison', title: 'Team Comparison', description: 'Compare teams across seasons.' },
    { id: 'playerStats', title: 'Player Stats', description: 'Player-specific performance data.' },
  ],
  NBL: [
    { id: 'nblOverview', title: 'NBL Overview', description: 'League-wide stats and metrics.' },
    { id: 'teamComparison', title: 'Team Comparison', description: 'Compare teams across seasons.' },
    { id: 'playerStats', title: 'Player Stats', description: 'Player-specific performance data.' },
  ],
  Admin: [
    { id: 'adminPanel', title: 'Admin Panel', description: 'System-wide administrative tools.' },
    { id: 'nblOverview', title: 'NBL Overview', description: 'League-wide stats and metrics.' },
    { id: 'teamComparison', title: 'Team Comparison', description: 'Compare teams across seasons.' },
    { id: 'playerStats', title: 'Player Stats', description: 'Player-specific performance data.' },
  ],
};

export default function Dashboard() {
  const { instance, accounts } = useMsal();
  const router = useRouter();

  type Group = 'Players' | 'Coach' | 'NBL' | 'Admin' | null;
  const [userGroup, setUserGroup] = useState<Group>(null);
  const [userName, setUserName] = useState<string>('User');
  const [teamName, setTeamName] = useState<string>('Your Team');

  useEffect(() => {
    const currentAccounts = instance.getAllAccounts();

    if (!currentAccounts.length) {
      router.replace('/login');
      return;
    }

    const idToken = currentAccounts[0]?.idTokenClaims as any;

    const roles: string[] = Array.isArray(idToken?.roles) ? idToken.roles : [];

    const roleMap: Record<string, Group> = {
      '1057e1d0-2154-48e8-9ea5-88c8dbab55f3': 'Admin',
      'f997e7e8-1542-49d1-a140-74873fd7d209': 'NBL',
      '3015ed3e-0eca-4d1d-984d-51e0075bb219': 'Coach',
      '7b72d962-8338-4081-895d-4c460e6bf59c': 'Players',
    };

    const matchedRole = roles.map((id) => roleMap[id]).find(Boolean);

    setUserGroup(matchedRole || null);
    setUserName(idToken?.name || 'User');
    setTeamName(idToken?.extension_teamName || 'Unknown Team');
  }, [instance, router]);

  if (!accounts.length || !userGroup) return <Spinner />;

  const teamLogoPath = `/logos/${teamName.replace(/\s+/g, '').toLowerCase()}.png`;

  const handleLogout = async () => {
    await instance.logoutRedirect();
  };

  return (
    <div className="min-h-screen bg-[#a0b8c6] text-black">
      {/* Top nav */}
      <header className="bg-[#092c48] text-white flex justify-between items-center px-6 py-4">
        <div className="flex items-center space-x-3">
          <img src="/logo.png" className="w-8 h-8" alt="Logo" />
          <span className="text-xl font-bold">Nextplay stats</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="hidden md:inline">Welcome {teamName}</span>
          <DropdownMenu
            label="Account"
            items={[
              { label: 'Logout', onClick: handleLogout },
            ]}
          />
        </div>
      </header>

      {/* Nav tabs */}
      <nav className="flex justify-around bg-[#587c92] text-white text-sm">
        {reports[userGroup]?.map((report) => (
          <button
            key={report.id}
            onClick={() => router.push(`/report/${report.id}`)}
            className="py-2 px-4 hover:bg-[#3e5e73]"
          >
            {report.title}
          </button>
        ))}
      </nav>

      {/* Main content */}
      <main className="flex flex-col items-center justify-center py-12 text-center">
        <img src={teamLogoPath} alt="Team Logo" className="w-48 h-48 mb-6" />
        <h1 className="text-2xl font-bold mb-4">{teamName}</h1>
        <div className="space-y-4 w-full max-w-sm">
          {reports[userGroup]?.map((report) => (
            <button
              key={report.id}
              onClick={() => router.push(`/report/${report.id}`)}
              className="w-full py-3 px-6 bg-[#3e5e73] text-white rounded-md hover:bg-[#2d4a5e] transition"
            >
              {report.title}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
