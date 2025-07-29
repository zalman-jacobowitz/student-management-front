import { Helmet } from 'react-helmet-async';

import { ExportViewWrapper } from 'src/sections/export/view';


// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>ייצוא</title>
      </Helmet>

      <ExportViewWrapper />
    </>
  );
}