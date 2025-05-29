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
        await instance.initialize(); // Ensure MSAL is initialized
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0f2027] via-[#203a43] to-[#2c5364]">
      <div className="text-center">
        <img
          src="/logo.png"
          alt="Nextplay logo"
          className="mx-auto mb-8 w-40 h-40 object-contain"
        />
        <h1 className="text-white text-2xl font-light mb-4">Welcome to Nextplay stats</h1>
        <Button
          onClick={handleLogin}
          className="px-6 py-2 border border-white text-white bg-transparent rounded-md hover:bg-white hover:text-black transition duration-300"
        >
          Log in
        </Button>
      </div>
    </div>
  );
}
