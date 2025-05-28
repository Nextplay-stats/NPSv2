import { useMsal } from '@azure/msal-react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Spinner from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const { instance, accounts } = useMsal();
  const router = useRouter();

  useEffect(() => {
    if (accounts.length) {
      router.replace('/dashboard'); // Already signed in
    }
  }, [accounts, router]);

  const handleLogin = () => {
    instance.loginRedirect();
  };

  return accounts.length ? (
    <Spinner />
  ) : (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-[#22967a] to-[#154d42] text-white">
      <div className="mb-8 text-center">
        <img src="/logo.png" alt="Logo" className="mx-auto mb-4 w-24 h-24" />
        <h1 className="text-3xl font-bold">Welcome to the Dashboard</h1>
        <p className="text-lg mt-2">Sign in to continue</p>
      </div>
      <Button onClick={handleLogin}>Sign in with Microsoft</Button>
    </div>
  );
}

