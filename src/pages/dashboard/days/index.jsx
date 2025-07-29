import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DaysCalendarViewWrapper } from 'src/sections/days/days-calendar-view';

// import { DaysViewWrapper } from 'src/sections/days/days-list-view.tsx';

// ----------------------------------------------------------------------

const metadata = { title: `ימים | ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DaysCalendarViewWrapper />
      {/* <DaysViewWrapper /> */}
    </>
  );
}