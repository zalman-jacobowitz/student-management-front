import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import {  StudentsViewWrapper } from 'src/sections/students/students-list-view.tsx';

// ----------------------------------------------------------------------



const metadata = { title: `רשימה | ${CONFIG.appName}` };

export default function Page() {
   
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <StudentsViewWrapper />
    </>
  );
}
