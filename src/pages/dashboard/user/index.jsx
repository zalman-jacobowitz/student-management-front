import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { UserViewWrapper } from 'src/sections/users/user-list-view.tsx';



// ----------------------------------------------------------------------

const metadata = { title: `User list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <UserViewWrapper />
    </>
  );
}
