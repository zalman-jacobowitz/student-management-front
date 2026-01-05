import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import SummaryDataGridViewWrapper from 'src/sections/summary/summary-datagrid-view';

// ----------------------------------------------------------------------



const metadata = { title: `רשימה | ${CONFIG.appName}` };

export default function Page() {
   
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <SummaryDataGridViewWrapper />
    </>
  );
}
