import { useRouter } from 'next/router';
import { useMsal } from '@azure/msal-react';
import { useEffect, useState } from 'react';
import Spinner from '@/components/ui/spinner';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';

export default function ReportPage() {
  const { instance, accounts } = useMsal();
  const router = useRouter();
  const { id } = router.query;

  const [embedConfig, setEmbedConfig] = useState<any>(null);

  useEffect(() => {
    if (!accounts.length || !id) return;

    // Fetch or construct your embed config here
    const fetchConfig = async () => {
      const token = await instance.acquireTokenSilent({
        scopes: ['https://analysis.windows.net/powerbi/api/.default'],
        account: accounts[0],
      });

      const config = {
        type: 'report',
        id: id as string,
        embedUrl: `https://app.powerbi.com/reportEmbed?reportId=${id}`,
        accessToken: token.accessToken,
        tokenType: models.TokenType.Aad,
        settings: {
          panes: { filters: { visible: false }, pageNavigation: { visible: false } },
          navContentPaneEnabled: false,
        },
      };

      setEmbedConfig(config);
    };

    fetchConfig();
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
