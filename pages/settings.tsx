import { useEffect, useState } from 'react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { InteractionRequiredAuthError } from '@azure/msal-browser';
import { useRouter } from 'next/router';
import Spinner from '@/components/ui/spinner';

export default function SettingsPage() {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const account = instance.getAllAccounts()[0];
        if (!account) throw new Error('No account found');

        const response = await instance.acquireTokenSilent({
          scopes: ['User.Read'],
          account,
        });

        const res = await fetch('https://graph.microsoft.com/v1.0/me', {
          headers: {
            Authorization: `Bearer ${response.accessToken}`,
          },
        });

        const data = await res.json();
        setUserEmail(data.mail || data.userPrincipalName || '');
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch settings:', err);
        if (err instanceof InteractionRequiredAuthError) {
          instance.loginRedirect({ scopes: ['User.Read'] });
        }
      }
    };

    if (!isAuthenticated) {
      router.push('/login');
    } else {
      loadUserInfo();
    }
  }, [isAuthenticated, instance, router]);

  if (!isAuthenticated || loading) return <Spinner />;

  return (
    <div className="min-h-screen bg-[#f4f7fa] p-8 text-gray-800">
      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold text-[#092c48] mb-6">Settings</h1>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Notifications</label>
            <select
              defaultValue="enabled"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Backup Email</label>
            <input
              type="email"
              placeholder="Enter backup email"
              defaultValue={userEmail}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Theme</label>
            <select
              defaultValue="light"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-[#092c48] text-white py-2 px-4 rounded-md hover:bg-[#0b3c64]"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
