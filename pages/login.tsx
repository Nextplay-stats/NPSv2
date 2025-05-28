import { useMsal } from '@azure/msal-react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Spinner from '@/components/ui/spinner';

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
    <div
      className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-[#22967a] to-[#154d42] text-white"
    >
      <div className="mb-8 text-center">
        <img src="/l
