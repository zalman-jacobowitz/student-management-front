import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DaysCalendarViewWrapper } from 'src/sections/days/days-calendar-view.tsx';
import { DownloadViewWrapper } from 'src/sections/download/down-table-view';

// ----------------------------------------------------------------------

const metadata = { title: `תבנית רישום | ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DownloadViewWrapper />
    </>
  );
}