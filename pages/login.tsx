import { useMsal } from '@azure/msal-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Spinner from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const { instance } = useMsal();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        console.log('LoginPage → calling handleRedirectPromise...');
        await instance.initialize();
        const response = await instance.handleRedirectPromise();

        console.log('handleRedirectPromise response:', response);
        console.log('Current accounts:', instance.getAllAccounts());

        if (response || instance.getAllAccounts().length > 0) {
          router.replace('/dashboard');
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('LoginPage → Error during handleRedirectPromise:', error);
        setLoading(false);
      }
    };

    init();
  }, [instance, router]);

  const handleLogin = () => {
    console.log('LoginPage → Redirecting...');
    instance.loginRedirect();
  };

  if (loading) return <Spinner />;

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
