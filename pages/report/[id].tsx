import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useMsal } from '@azure/msal-react';
import { useEffect, useState } from 'react';
import Spinner from '@/components/ui/spinner';
import { models } from 'powerbi-client';

// Dynamically import PowerBIEmbed, disabling SSR
const PowerBIEmbed = dynamic(
  () => import('powerbi-client-react').then(mod => mod.PowerBIEmbed),
  { ssr: false }
);

export default function ReportPage() {
  const { instance, accounts } = useMsal();
  const router = useRouter();
  const { id } = router.query;

  const [embedConfig, setEmbedConfig] = useState<any>(null);

  useEffect(() => {
    if (!accounts.length || !id) return;

    const fetchEmbedConfig = async () => {
      try {
        const response = await instance.acquireTokenSilent({
          scopes: ['https://analysis.windows.net/powerbi/api/.default'],
          account: accounts[0],
        });

        setEmbedConfig({
          type: 'report',
          id: id as string,
          embedUrl: `https://app.powerbi.com/reportEmbed?reportId=${id}`,
          accessToken: response.accessToken,
          tokenType: models.TokenType.Aad,
          settings: {
            panes: {
              filters: { visible: false },
              pageNavigation: { visible: false },
            },
            navContentPaneEnabled: false,
          },
        });
      } catch (error) {
        console.error('Failed to get embed token', error);
        // Optionally handle error (redirect or show message)
      }
    };

    fetchEmbedConfig();
  }, [accounts, id, instance]);

  if (!accounts.length || !id || !embedConfig) {
    return <Spinner />;
  }

  return (
    <div className="h-screen w-screen">
      <PowerBIEmbed
        embedConfig={embedConfig}
        cssClassName="report-style-class"
        getEmbeddedComponent={(embeddedReport) => {
          console.log('Report embedded:', embeddedReport);
        }}
      />
    </div>
  );
}

