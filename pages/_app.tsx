// src/pages/_app.tsx
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { PublicClientApplication, Configuration } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { ThemeProvider } from '@/context/ThemeContext';
import { appWithTranslation } from 'next-i18next';
import nextI18NextConfig from '../next-i18next.config';
import useTextSize from '@/components/useTextSize';  // import your hook
import { useEffect } from 'react';

// Env checks
const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
const tenantId = process.env.NEXT_PUBLIC_TENANT_ID;
const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI ?? 'http://localhost:3000/login';

if (!clientId) throw new Error('Missing NEXT_PUBLIC_CLIENT_ID env variable');
if (!tenantId) throw new Error('Missing NEXT_PUBLIC_TENANT_ID env variable');

const msalConfig: Configuration = {
  auth: {
    clientId,
    authority: `https://login.microsoftonline.com/${tenantId}`,
    redirectUri,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
};

const msalInstance = new PublicClientApplication(msalConfig);

function App({ Component, pageProps }: AppProps) {
  // Use your text size hook here to get and set textSize
  const [textSize, setTextSize] = useTextSize();

  // Optional: sync from localStorage on mount if your hook doesn't already
  useEffect(() => {
    const savedSize = localStorage.getItem('textSize') as 'small' | 'medium' | 'large' | null;
    if (savedSize && savedSize !== textSize) {
      setTextSize(savedSize);
    }
  }, []);

  return (
    <MsalProvider instance={msalInstance}>
      <ThemeProvider>
        {/* Apply data-text-size attribute globally */}
        <div data-text-size={textSize}>
          <Component {...pageProps} />
        </div>
      </ThemeProvider>
    </MsalProvider>
  );
}

export default appWithTranslation(App, nextI18NextConfig);
