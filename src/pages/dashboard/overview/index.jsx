import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { OverviewWrapper } from 'src/sections/overview/view';


// ----------------------------------------------------------------------

const metadata = { title: `סקירה כללית | ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <OverviewWrapper />
      
    </>
  );
}