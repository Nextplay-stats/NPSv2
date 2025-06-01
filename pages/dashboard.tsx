import { useRouter } from 'next/router';
import { useMsal } from '@azure/msal-react';
import { useEffect, useState } from 'react';
import Spinner from '@/components/ui/spinner';
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
  const { instance } = useMsal();
  const router = useRouter();

  type Group = 'Players' | 'Coach' | 'NBL' | 'Admin' | null;
  const [userGroup, setUserGroup] = useState<Group>(null);
  const [userName, setUserName] = useState<string>('User');
  const [teamName, setTeamName] = useState<string>('Unknown Team');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accounts = instance.getAllAccounts();

    if (accounts.length === 0) {
      // Delay redirect to avoid flood navigation
      setTimeout(() => {
        router.replace('/login');
      }, 100);
      return;
    }

    const idToken = accounts[0]?.idTokenClaims as any;

    if (!idToken) {
      setTimeout(() => {
        router.replace('/login');
      }, 100);
      return;
    }

    // Roles may come from either roles or groups claim
    const roles: string[] = Array.isArray(idToken?.roles)
      ? idToken.roles
      : Array.isArray(idToken?.groups)
      ? idToken.groups
      : [];

    const roleMap: Record<string, Group> = {
      'e6be3e80-2f16-4cf6-9914-fd34c3cc90a1': 'Admin',
      '8a39cc44-073f-4d3e-bca7-c94f8fcf5aa2': 'NBL',
      'b1f2b8f9-b4a4-4ae2-930b-0db1580ee5b2': 'Coach',
      '9ddbc670-68e3-4fc4-a839-5376c6e36a8d': 'Players',
    };

    const matchedRole = roles.map((id) => roleMap[id]).find(Boolean) || null;

    if (!matchedRole) {
      setTimeout(() => {
        router.replace('/login');
      }, 100);
      return;
    }

    setUserGroup(matchedRole);
    setUserName(idToken?.name || 'User');
    setTeamName(idToken?.companyName || 'Unknown Team');
    setLoading(false);
  }, [instance, router]);

  // Guard to prevent rendering if no userGroup after loading
  useEffect(() => {
    if (!loading && !userGroup) {
      router.replace('/login');
    }
  }, [loading, userGroup, router]);

  if (loading) return <Spinner />;

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
          <span className="hidden md:inline">Welcome {userName} from {teamName}</span>
          <DropdownMenu
            label="Account"
            items={[{ label: 'Logout', onClick: handleLogout }]}
          />
        </div>
      </header>

      {/* Nav tabs */}
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

      {/* Main content */}
      <main className="flex flex-col items-center justify-center py-12 text-center">
        <img src={teamLogoPath} alt="Team Logo" className="w-48 h-48 mb-6" />
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
