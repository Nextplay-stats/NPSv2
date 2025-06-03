// src/pages/_app.tsx
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { ThemeProvider } from '@/context/ThemeContext';
import { SettingsProvider } from '@/context/SettingsContext'; // <-- import the settings provider

const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
const tenantId = process.env.NEXT_PUBLIC_TENANT_ID;
const redirectUri =
  process.env.NEXT_PUBLIC_REDIRECT_URI || 'http://localhost:3000/login';

if (!clientId || !tenantId) {
  console.error('Missing Azure AD environment variables');
}

const msalConfig = {
  auth: {
    clientId: clientId!,
    authority: `https://login.microsoftonline.com/${tenantId}`,
    redirectUri,
  },
  cache: {
    cacheLocation: 'localStorage', // ensures login state persists
    storeAuthStateInCookie: false, // set true if you need legacy browser support
  },
};

const msalInstance = new PublicClientApplication(msalConfig);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MsalProvider instance={msalInstance}>
      <ThemeProvider>
        <SettingsProvider> {/* <-- wrap here */}
          <Component {...pageProps} />
        </SettingsProvider>
      </ThemeProvider>
    </MsalProvider>
  );
}
