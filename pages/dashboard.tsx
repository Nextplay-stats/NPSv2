import { useRouter } from 'next/router';
import { useMsal } from '@azure/msal-react';
import { useEffect, useState } from 'react';
import Spinner from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';

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

export default function Dashboard() {
  const { instance, accounts } = useMsal();
  const router = useRouter();

  type Group = 'Players' | 'Coach' | 'NBL' | 'Admin' | null;
  const [userGroup, setUserGroup] = useState<Group>(null);

  useEffect(() => {
    const currentAccounts = instance.getAllAccounts();

    if (!currentAccounts.length) {
      router.replace('/login');
      return;
    }

const idToken = currentAccounts[0]?.idTokenClaims;
const roles: string[] =
  idToken && 'roles' in idToken && Array.isArray((idToken as any).roles)
    ? (idToken as any).roles
    : [];

console.log('Dashboard → raw app roles:', roles);

// Directly map role names to your app roles
const validRoles: Group[] = ['Admin', 'Coach', 'NBL', 'Players'];
const matchedRole = roles.find((role) => validRoles.includes(role as Group)) as Group;

if (matchedRole) {
  console.log('Dashboard → Matched user role:', matchedRole);
  setUserGroup(matchedRole);
} else {
  console.warn('Dashboard → No valid role matched:', roles);
  // Optionally: router.replace('/unauthorized');
}


if (matchedRole) {
  console.log('Dashboard → Matched user role:', matchedRole);
  setUserGroup(matchedRole);
} else {
  console.warn('Dashboard → No valid role matched:', roles);
}

  }, [instance, router]);

  if (!accounts.length || !userGroup) return <Spinner />;

  return (
    <div className="min-h-screen bg-gradient-down p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-white" />
          <h1 className="text-2xl font-bold">Basketball Dashboard</h1>
        </div>
        <Button onClick={() => instance.logoutRedirect()}>Logout</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports[userGroup]?.map((report) => (
          <div
            key={report.id}
            className="bg-white text-black p-4 rounded-xl shadow-md cursor-pointer hover:shadow-xl"
            onClick={() => router.push(`/report/${report.id}`)}
          >
            <h2 className="text-lg font-semibold">{report.title}</h2>
            <p className="text-sm text-gray-500">{report.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
