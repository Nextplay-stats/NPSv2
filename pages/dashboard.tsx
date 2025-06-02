import { useRouter } from 'next/router';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { useEffect, useState } from 'react';
import Spinner from '@/components/ui/spinner';
import DropdownMenu from '@/components/DropdownMenu';

const reports = {
  Players: [{ id: 'playerStats', title: 'Player Stats' }],
  Coach: [
    { id: 'teamComparison', title: 'Team Comparison' },
    { id: 'playerStats', title: 'Player Stats' },
  ],
  NBL: [
    { id: 'nblOverview', title: 'NBL Overview' },
    { id: 'teamComparison', title: 'Team Comparison' },
    { id: 'playerStats', title: 'Player Stats' },
  ],
  Admin: [
    { id: 'adminPanel', title: 'Admin Panel' },
    { id: 'nblOverview', title: 'NBL Overview' },
    { id: 'teamComparison', title: 'Team Comparison' },
    { id: 'playerStats', title: 'Player Stats' },
  ],
};

type Group = 'Players' | 'Coach' | 'NBL' | 'Admin' | null;

export default function Dashboard() {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [userGroup, setUserGroup] = useState<Group>(null);
  const [userName, setUserName] = useState('User');
  const [teamName, setTeamName] = useState('Unknown Team');
  const [teamLogoPath, setTeamLogoPath] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    const accounts = instance.getAllAccounts();
    if (!accounts.length) {
      router.replace('/login');
      return;
    }

    const account = accounts[0];
    const claims = account.idTokenClaims as any;

    const roleMap: Record<string, Group> = {
      'e6be3e80-2f16-4cf6-9914-fd34c3cc90a1': 'Admin',
      '8a39cc44-073f-4d3e-bca7-c94f8fcf5aa2': 'NBL',
      'b1f2b8f9-b4a4-4ae2-930b-0db1580ee5b2': 'Coach',
      '9ddbc670-68e3-4fc4-a839-5376c6e36a8d': 'Players',
    };

    const roles: string[] = Array.isArray(claims?.roles)
      ? claims.roles
      : Array.isArray(claims?.groups)
      ? claims.groups
      : [];

    const matchedRole = roles.map((id) => roleMap[id]).find(Boolean) || null;

    const name = claims?.name || 'User';
    const company = claims?.companyName || 'Unknown Team';
    const logoPath = `/logos/${company.replace(/\s+/g, '').toLowerCase()}.png`;

    setUserGroup(matchedRole);
    setUserName(name);
    setTeamName(company);
    setTeamLogoPath(logoPath);
    setLoading(false);
  }, [isAuthenticated, instance, router]);

  const handleLogout = async () => {
    await instance.logoutRedirect();
  };

  const handleLogoError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = '/logos/default.png';
  };

  if (!isAuthenticated || loading) return <Spinner />;

  return (
    <div className="min-h-screen bg-[#a0b8c6] text-black">
      <header className="bg-[#092c48] text-white flex justify-between items-center px-6 py-4">
        <div className="flex items-center space-x-3">
          <img src="/logo.png" className="w-8 h-8" alt="App Logo" />
          <span className="text-xl font-bold">Nextplay stats</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="hidden md:inline">
            Welcome {userName} from {teamName}
          </span>
          <DropdownMenu label="Account" items={[{ label: 'Logout', onClick: handleLogout }]} />
        </div>
      </header>

      <nav className="flex justify-around bg-[#587c92] text-white text-sm">
        {reports[userGroup!]?.map((report) => (
          <button
            key={report.id}
            onClick={() => router.push(`/report/${report.id}`)}
            className="py-2 px-4 hover:bg-[#3e5e73]"
          >
            {report.title}
          </button>
        ))}
      </nav>

      <main className="flex flex-col items-center justify-center py-12 text-center">
        {teamLogoPath && (
          <img
            src={teamLogoPath}
            alt="Team Logo"
            className="w-48 h-48 mb-6"
            onError={handleLogoError}
          />
        )}
        <h1 className="text-2xl font-bold mb-4">{teamName}</h1>
        <div className="space-y-4 w-full max-w-sm">
          {reports[userGroup!]?.map((report) => (
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
