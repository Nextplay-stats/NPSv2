import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DropdownMenu from '@/components/DropdownMenu';
import useDarkMode from '@/components/useDarkMode';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { InteractionRequiredAuthError } from '@azure/msal-browser';
import Spinner from '@/components/ui/spinner';

import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

type Group = 'Players' | 'Coach' | 'NBL' | 'Admin' | null;

export default function Account() {
  const router = useRouter();
  const [darkMode] = useDarkMode();
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const { t } = useTranslation('common');

  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('User');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState<Group>(null);
  const [teamName, setTeamName] = useState(t('unknownTeam'));

  const getUserDetails = async () => {
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
      setUserName(profile.displayName || 'User');
      setUserEmail(profile.mail || profile.userPrincipalName || 'Unknown');
      setTeamName(profile.jobTitle || t('unknownTeam'));
    } catch (err) {
      console.error('Error fetching user data:', err);
      if (err instanceof InteractionRequiredAuthError) {
        instance.loginRedirect({ scopes: ['User.Read'] });
      }
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    const account = instance.getAllAccounts()[0];
    const claims = account?.idTokenClaims as any;

    // Role mapping identical to dashboard
    const roleMap: Record<string, Group> = {
      '1057e1d0-2154-48e8-9ea5-88c8dbab55f3': 'Admin',
      'f997e7e8-1542-49d1-a140-74873fd7d209': 'NBL',
      '3015ed3e-0eca-4d1d-984d-51e0075bb219': 'Coach',
      '7b72d962-8338-4081-895d-4c460e6bf59c': 'Players',
    };

    const groupIds: string[] = Array.isArray(claims?.groups) ? claims.groups : [];
    const matchedRole = groupIds.map((id) => roleMap[id]).find(Boolean) || null;

    setUserRole(matchedRole);
    getUserDetails().finally(() => setLoading(false));
  }, [isAuthenticated, instance, router, t]);

  const handleLogout = () => {
    instance.logoutRedirect();
  };

  if (!isAuthenticated || loading) return <Spinner />;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-[#a0b8c6] text-black'}`}>
      <header className="bg-[#092c48] text-white flex justify-between items-center px-6 py-4">
        <div className="flex items-center space-x-3">
          <img src="/logo.png" className="w-8 h-8" alt="Logo" />
          <span className="text-xl font-bold">Nextplay stats</span>
        </div>
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
      </header>

      <main className="py-12 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">{t('Account Details')}</h1>
        <div className="bg-white text-black rounded-lg shadow-md p-6 space-y-4">
          <div>
            <p className="font-semibold">{t('Name')}:</p>
            <p>{userName}</p>
          </div>
          <div>
            <p className="font-semibold">{t('Email')}:</p>
            <p>{userEmail}</p>
          </div>
          <div>
            <p className="font-semibold">{t('Role')}:</p>
            <p>{userRole ? t(`role${userRole}`) : t('roleUnknown')}</p>
          </div>
          <div>
            <p className="font-semibold">{t('Team')}:</p>
            <p>{teamName}</p>
          </div>
        </div>
      </main>
    </div>
  );
}

// Add getStaticProps to support translations and pass locale
export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
