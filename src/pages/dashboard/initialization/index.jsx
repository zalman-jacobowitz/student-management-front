import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { InitializationView } from 'src/sections/initialization/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`איתחול המערכת - ${CONFIG.appName}`}</title>
      </Helmet>

      <InitializationView />
    </>
  );
}