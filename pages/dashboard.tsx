// src/pages/dashboard.tsx
import { useRouter } from 'next/router';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { useEffect, useState } from 'react';
import Spinner from '@/components/ui/spinner';
import DropdownMenu from '@/components/DropdownMenu';
import { InteractionRequiredAuthError } from '@azure/msal-browser';
import useDarkMode from '@/components/useDarkMode';

import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const reports = {
  Players: [{ id: 'playerStats', titleKey: 'playerStats' }],
  Coach: [
    { id: 'teamComparison', titleKey: 'teamComparison' },
    { id: 'playerStats', titleKey: 'playerStats' },
  ],
  NBL: [
    { id: 'nblOverview', titleKey: 'nblOverview' },
    { id: 'teamComparison', titleKey: 'teamComparison' },
    { id: 'playerStats', titleKey: 'playerStats' },
  ],
  Admin: [
    { id: 'adminPanel', titleKey: 'adminPanel' },
    { id: 'nblOverview', titleKey: 'nblOverview' },
    { id: 'teamComparison', titleKey: 'teamComparison' },
    { id: 'playerStats', titleKey: 'playerStats' },
  ],
};

type Group = 'Players' | 'Coach' | 'NBL' | 'Admin' | null;

export default function Dashboard() {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const router = useRouter();
  const [darkMode] = useDarkMode();
  const { t } = useTranslation('common');

  const [loading, setLoading] = useState(true);
  const [userGroup, setUserGroup] = useState<Group>(null);
  const [userName, setUserName] = useState('User');
  const [teamName, setTeamName] = useState('');
  const [teamLogoPath, setTeamLogoPath] = useState<string>('');

  const getCompanyNameViaGraph = async () => {
    try {
      const account = instance.getAllAccounts()[0];
      if (!account) throw new Error('No account found');

      const response = await instance.acquireTokenSilent({
        scopes: ['User.Read'],
        account,
      });

      const token = response.accessToken;

      const profileRes = await fetch('https://graph.microsoft.com/v1.0/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const profile = await profileRes.json();

      const company = profile.jobTitle || t('unknownTeam') || 'Unknown';
      const logoPath = `/logos/${company.replace(/\s+/g, '').toLowerCase()}.png`;

      setTeamName(company);
      setTeamLogoPath(logoPath);
    } catch (err: any) {
      console.error('Error fetching profile from Graph:', err);
      if (err instanceof InteractionRequiredAuthError) {
        instance.loginRedirect({
          scopes: ['User.Read'],
        });
      }
    }
  };

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
      '1057e1d0-2154-48e8-9ea5-88c8dbab55f3': 'Admin',
      'f997e7e8-1542-49d1-a140-74873fd7d209': 'NBL',
      '3015ed3e-0eca-4d1d-984d-51e0075bb219': 'Coach',
      '7b72d962-8338-4081-895d-4c460e6bf59c': 'Players',
    };

    const groupIds: string[] = Array.isArray(claims?.groups) ? claims.groups : [];
    const matchedRole = groupIds.map((id) => roleMap[id]).find(Boolean) || null;

    const name = claims?.name || t('user') || 'User';
    setUserName(name);
    setUserGroup(matchedRole);

    getCompanyNameViaGraph();
    setLoading(false);
  }, [isAuthenticated, instance, router, t]);

  const handleLogout = async () => {
    await instance.logoutRedirect();
  };

  if (!isAuthenticated || loading) return <Spinner />;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-[#a0b8c6] text-black'}`}>
      <header className="bg-[#092c48] text-white flex justify-between items-center px-6 py-4">
        <div className="flex items-center space-x-3">
          <img src="/logo.png" className="w-8 h-8" alt="Logo" />
          <span className="text-xl font-bold">Nextplay stats</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="hidden md:inline">
            {t('welcomeMessage', { userName, teamName })}
          </span>
          <DropdownMenu
            label={t('account')}
            items={[
              { label: t('dashboard'), onClick: () => router.push('/dashboard') },
              { label: t('account'), onClick: () => router.push('/account') },
              { label: t('settings'), onClick: () => router.push('/settings') },
              { label: t('help'), onClick: () => router.push('/help') },
              { label: t('logout'), onClick: handleLogout },
            ]}
          />
        </div>
      </header>

      <nav className={`flex justify-around ${darkMode ? 'bg-gray-800 text-white' : 'bg-[#587c92] text-white'} text-sm`}>
        {userGroup && reports[userGroup]?.map((report) => (
          <button
            key={report.id}
            onClick={() => router.push(`/report/${report.id}`)}
            className="py-2 px-4 hover:bg-[#3e5e73]"
          >
            {t(report.titleKey)}
          </button>
        ))}
      </nav>

      <main className="flex flex-col items-center justify-center py-12 text-center">
        <img
          src={teamLogoPath}
          alt={t('teamLogoAlt')?.toString() || 'Team Logo'}
          className="w-48 h-48 mb-6"
        />
        <h1 className="text-2xl font-bold mb-4">{teamName}</h1>
        <div className="space-y-4 w-full max-w-sm">
          {userGroup && reports[userGroup]?.map((report) => (
            <button
              key={report.id}
              onClick={() => router.push(`/report/${report.id}`)}
              className="w-full py-3 px-6 bg-[#3e5e73] text-white rounded-md hover:bg-[#2d4a5e] transition"
            >
              {t(report.titleKey)}
            </button>
          ))}
          {!userGroup && (
            <p className="text-red-600 font-semibold">
              {t('noRoleMatched')}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
