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
  const groups: string[] =
    idToken && 'groups' in idToken && Array.isArray((idToken as any).groups)
      ? (idToken as any).groups
      : [];

  console.log('Dashboard → raw group claims:', groups);

  // Map Azure AD group object IDs to friendly names
  const groupMap: Record<string, Group> = {
    '1057e1d0-2154-48e8-9ea5-88c8dbab55f3': 'Admin',
    'f997e7e8-1542-49d1-a140-74873fd7d209': 'NBL',
    '3015ed3e-0eca-4d1d-984d-51e0075bb219': 'Coach',
    '7b72d962-8338-4081-895d-4c460e6bf59c': 'Players',
  };

  const matchedGroup = groups.map((id) => groupMap[id]).find(Boolean);

  if (matchedGroup) {
    console.log('Dashboard → Matched user group:', matchedGroup);
    setUserGroup(matchedGroup);
  } else {
    console.warn('Dashboard → No valid group matched:', groups);
    // Optionally redirect:
    // router.replace('/unauthorized');
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

