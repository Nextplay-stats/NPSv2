import { useEffect, useState } from 'react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { InteractionRequiredAuthError } from '@azure/msal-browser';
import { useRouter } from 'next/router';
import Spinner from '@/components/ui/spinner';

export default function AccountPage() {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const account = instance.getAllAccounts()[0];
        if (!account) throw new Error('No account found');

        const response = await instance.acquireTokenSilent({
          scopes: ['User.Read'],
          account,
        });

        const graphRes = await fetch('https://graph.microsoft.com/v1.0/me', {
          headers: {
            Authorization: `Bearer ${response.accessToken}`,
          },
        });

        const data = await graphRes.json();
        setProfile(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching account details:', err);
        if (err instanceof InteractionRequiredAuthError) {
          instance.loginRedirect({ scopes: ['User.Read'] });
        }
      }
    };

    if (!isAuthenticated) {
      router.push('/login');
    } else {
      fetchProfile();
    }
  }, [isAuthenticated, instance, router]);

  if (!isAuthenticated || loading) return <Spinner />;

  return (
    <div className="min-h-screen bg-[#f4f7fa] p-8 text-gray-800">
      <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-6 text-[#092c48]">Account Details</h1>
        <div className="space-y-4">
          <div>
            <strong>Name:</strong> {profile?.displayName || 'N/A'}
          </div>
          <div>
            <strong>Email:</strong> {profile?.mail || profile?.userPrincipalName || 'N/A'}
          </div>
          <div>
            <strong>Job Title:</strong> {profile?.jobTitle || 'N/A'}
          </div>
          <div>
            <strong>Department:</strong> {profile?.department || 'N/A'}
          </div>
          <div>
            <strong>ID:</strong> {profile?.id || 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
}
