import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ExceptionsViewWrapper } from 'src/sections/exceptions/exceptions-list-view.tsx';

// ----------------------------------------------------------------------

const metadata = { title: `אישורים | ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ExceptionsViewWrapper />
    </>
  );
}