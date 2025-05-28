import { useMsal } from '@azure/msal-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Spinner from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const { instance, accounts } = useMsal();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Checking login status...');
    // Handle redirect response once after redirect back from Azure AD
    instance.handleRedirectPromise()
      .then((response) => {
        if (response) {
          console.log('Redirect response:', response);
          // Redirect to dashboard on successful login
          router.replace('/dashboard');
        } else if (accounts.length) {
          console.log('Already logged in, redirecting...');
          router.replace('/dashboard');
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error('Login redirect error:', error);
        setLoading(false);
      });
  }, [instance, accounts, router]);

  const handleLogin = () => {
    instance.loginRedirect().catch((error) => {
      console.error('Login redirect failed:', error);
    });
  };

  if (loading) {
    return <Spinner />;
  }

  return (
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
