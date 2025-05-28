import { useRouter } from 'next/router';
import { useMsal } from '@azure/msal-react';
import { useEffect } from 'react';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';
import { Button } from '@/components/ui/button';

export default function ReportPage() {
  const router = useRouter();
  const { id } = router.query;
  const { instance, accounts } = useMsal();

  useEffect(() => {
    if (!accounts.length) {
      instance.loginRedirect();
    }
  }, [accounts, instance]);

  if (!accounts.length || !id) return null;

  const embedConfig = {
    type: 'report',
    id: 'ACTUAL_REPORT_ID',
    embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=ACTUAL_REPORT_ID&groupId=WORKSPACE_ID',
    accessToken: 'EMBED_TOKEN',
    tokenType: models.TokenType.Embed,
  };

  return (
    <div className="min-h-screen bg-gradient-down p-4 text-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold capitalize">Report: {id}</h1>
        <Button onClick={() => instance.logoutRedirect()}>Logout</Button>
      </div>
      <PowerBIEmbed
        embedConfig={embedConfig}
        cssClassName="w-full h-[80vh]"
        eventHandlers={new Map([
          ['loaded', () => console.log('Report loaded')],
          ['error', (event) => console.error(event.detail)],
        ])}
      />
    </div>
  );
}
