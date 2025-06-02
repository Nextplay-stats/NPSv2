import { useMsal } from '@azure/msal-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Spinner from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const { instance } = useMsal();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Ensure MSAL is initialized before any calls
    const initMsal = async () => {
      try {
        if (!instance.getAllAccounts().length) {
          // Call initialize explicitly just once if needed
          await instance.initialize?.(); // Optional chaining
        }
        setInitialized(true);
      } catch (error) {
        console.error('MSAL Initialization error:', error);
      }
    };

    initMsal();
  }, [instance]);

  useEffect(() => {
    const checkAuth = async () => {
      if (!initialized) return;

      try {
        console.log('LoginPage → calling handleRedirectPromise...');
        const response = await instance.handleRedirectPromise();

        console.log('handleRedirectPromise response:', response);
        const accounts = instance.getAllAccounts();
        console.log('Current accounts:', accounts);

        if (response || accounts.length > 0) {
          router.replace('/dashboard');
        } else {
          setLoading(false); // Show login button
        }
      } catch (error) {
        console.error('LoginPage → Error in handleRedirectPromise:', error);
        setLoading(false);
      }
    };

    checkAuth();
  }, [instance, router, initialized]);

  const handleLogin = () => {
    console.log('LoginPage → Redirecting with User.Read scope...');
    instance.loginRedirect({
      scopes: ['User.Read'], // Request Graph API user.read scope here for consent
    });
  };

  if (loading || !initialized) return <Spinner />;

  return (
    <div
      className="flex flex-col items-center justify-center h-screen text-white"
      style={{
        background: 'radial-gradient(ellipse at center bottom, #1b3d56 0%, #0d1f2d 75%)',
      }}
    >
      <div className="mb-8 text-center">
        <img src="/logo.png" alt="Logo" className="mx-auto mb-4 w-28 h-28" />
        <h1 className="text-3xl font-bold">Welcome to Nextplay stats</h1>
        <p className="text-lg mt-2">Please sign in</p>
      </div>
      <Button
        onClick={handleLogin}
        className="bg-white text-gray-800 font-semibold px-6 py-2 rounded-md hover:bg-gray-200"
      >
        Log in
      </Button>
    </div>
  );
}
