import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { OverviewViewWrapper } from 'src/sections/overview/overview-view';


// ----------------------------------------------------------------------

const metadata = { title: `סקירה כללית | ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <OverviewViewWrapper />
      
    </>
  );
}