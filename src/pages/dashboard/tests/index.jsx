import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { TestsViewWrapper } from 'src/sections/tests/tests-list-view';


// ----------------------------------------------------------------------

const metadata = { title: `מבחנים | ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TestsViewWrapper />

    </>
  );
}