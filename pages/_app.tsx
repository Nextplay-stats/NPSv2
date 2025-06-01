// src/pages/_app.tsx
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { ThemeProvider } from '@/context/ThemeContext'; // adjust if needed

const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
const tenantId = process.env.NEXT_PUBLIC_TENANT_ID;
const redirectUri =
  process.env.NEXT_PUBLIC_REDIRECT_URI || 'https://zealous-sky-0785c6503.6.azurestaticapps.net';

if (!clientId || !tenantId) {
  console.error('Missing Azure AD environment variables');
}

const msalConfig = {
  auth: {
    clientId: clientId || '',
    authority: `https://login.microsoftonline.com/${tenantId}`,
    redirectUri,
  },
};

const msalInstance = new PublicClientApplication(msalConfig);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MsalProvider instance={msalInstance}>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </MsalProvider>
  );
}
