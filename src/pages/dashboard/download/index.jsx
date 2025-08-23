import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

// eslint-disable-next-line import/extensions
import { DownloadViewWrapper } from 'src/sections/download/down-table-view';
import { DaysCalendarViewWrapper } from 'src/sections/days/days-calendar-view.tsx';

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