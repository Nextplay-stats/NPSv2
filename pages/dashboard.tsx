import { useRouter } from 'next/router';
import { useMsal } from '@azure/msal-react';
import { useEffect, useState } from 'react';
import Spinner from '@/components/ui/spinner';
import DropdownMenu from '@/components/DropdownMenu';

const reports = {
  Players: [{ id: 'playerStats', title: 'Player Stats', description: 'Player-specific performance data.' }],
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

type Group = 'Players' | 'Coach' | 'NBL' | 'Admin' | null;

export default function Dashboard() {
  const { instance } = useMsal();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [userGroup, setUserGroup] = useState<Group>(null);
  const [userName, setUserName] = useState<string>('User');
  const [teamName, setTeamName] = useState<string>('Unknown Team');

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        const accounts = instance.getAllAccounts();

        if (accounts.length === 0) {
          setTimeout(() => {
            if (isMounted) router.replace('/login');
          }, 0);
          return;
        }

        const account = accounts[0];
        const idTokenClaims = account.idTokenClaims as any;

        if (!idTokenClaims) {
          setTimeout(() => {
            if (isMounted) router.replace('/login');
          }, 0);
          return;
        }

        const roles: string[] = Array.isArray(idTokenClaims?.roles)
          ? idTokenClaims.roles
          : Array.isArray(idTokenClaims?.groups)
          ? idTokenClaims.groups
          : [];

        const roleMap: Record<string, Group> = {
          'e6be3e80-2f16-4cf6-9914-fd34c3cc90a1': 'Admin',
          '8a39cc44-073f-4d3e-bca7-c94f8fcf5aa2': 'NBL',
          'b1f2b8f9-b4a4-4ae2-930b-0db1580ee5b2': 'Coach',
          '9ddbc670-68e3-4fc4-a839-5376c6e36a8d': 'Players',
        };

        const matchedRole = roles.map((id) => roleMap[id]).find(Boolean);

        if (!matchedRole) {
          setTimeout(() => {
            if (isMounted) router.replace('/login');
          }, 0);
          return;
        }

        if (isMounted) {
          setUserGroup(matchedRole);
          setUserName(idTokenClaims?.name || 'User');
          setTeamName(idTokenClaims?.companyName || 'Unknown Team');
        }
      } catch (error) {
        console.error('Dashboard → Error initializing user session:', error);
        setTimeout(() => {
          if (isMounted) router.replace('/login');
        }, 0);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    init();

    return () => {
      isMounted = false;
    };
  }, [instance, router]);

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
