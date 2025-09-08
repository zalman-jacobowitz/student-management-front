import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { DetailsViewWrapper } from 'src/sections/details/details-list-view';


// ----------------------------------------------------------------------

const metadata = { title: `רישומים | ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DetailsViewWrapper />
      
    </>
  );
}