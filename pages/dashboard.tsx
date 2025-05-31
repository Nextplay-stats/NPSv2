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
  const [teamName, setTeamName] = useState<string>('Unknown Team');

  useEffect(() => {
    const currentAccounts = instance.getAllAccounts();

    if (!currentAccounts.length) {
      console.warn('No accounts found. Redirecting...');
      router.replace('/login');
      return;
    }

    const idToken = currentAccounts[0]?.idTokenClaims as any;

    console.log('Token Claims:', idToken);
