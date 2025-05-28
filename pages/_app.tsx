import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider, useMsal } from '@azure/msal-react';

const msalConfig = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID || '',
    authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_TENANT_ID}`,
    redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI || 'https://zealous-sky-0785c6503.6.azurestaticapps.net/', 
  },
};


const msalInstance = new PublicClientApplication(msalConfig);

function MsalHandler({ children }: { children: React.ReactNode }) {
  const { instance } = useMsal();

  useEffect(() => {
    instance.handleRedirectPromise().then((response) => {
      if (response) {
        // Optional: You can handle the login response here, like storing tokens or redirecting
        console.log('Login response:', response);
      }
    }).catch((error) => {
      console.error('Redirect error:', error);
    });
  }, [instance]);

  return <>{children}</>;
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MsalProvider instance={msalInstance}>
      <MsalHandler>
        <Component {...pageProps} />
      </MsalHandler>
    </MsalProvider>
  );
}
