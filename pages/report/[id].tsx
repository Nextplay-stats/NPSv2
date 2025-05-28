import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useMsal } from '@azure/msal-react';
import { useEffect, useState } from 'react';
import Spinner from '@/components/ui/spinner';

const PowerBIEmbed = dynamic(
  () => import('powerbi-client-react').then(mod => mod.PowerBIEmbed),
  { ssr: false }
);

export default function ReportPage() {
  const { instance, accounts } = useMsal();
  const router = useRouter();
  const { id } = router.query;

  const [embedConfig, setEmbedConfig] = useState(null);
  const [models, setModels] = useState<any>(null);

  useEffect(() => {
    // Dynamically import 'models' only on client side
    import('powerbi-client').then(mod => {
      setModels(mod.models);
    });
  }, []);

  useEffect(() => {
    if (!accounts.length || !id || !models) return;

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
      }
    };

    fetchEmbedConfig();
  }, [accounts, id, instance, models]);

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
