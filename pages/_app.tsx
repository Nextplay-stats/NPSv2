// src/pages/_app.tsx
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { PublicClientApplication, Configuration } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { ThemeProvider } from '@/context/ThemeContext';
import { appWithTranslation } from 'next-i18next';
import nextI18NextConfig from '../next-i18next.config';

// Ensure env variables exist, else fallback or throw error
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
    cacheLocation: 'localStorage', // persist login across sessions
    storeAuthStateInCookie: false, // set to true if issues in IE11 or Edge
  },
};

const msalInstance = new PublicClientApplication(msalConfig);

function App({ Component, pageProps }: AppProps) {
  return (
    <MsalProvider instance={msalInstance}>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </MsalProvider>
  );
}

export default appWithTranslation(App, nextI18NextConfig);
