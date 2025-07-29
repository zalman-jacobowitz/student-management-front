import { Helmet } from 'react-helmet-async';

import { ColumnsViewWrapper } from 'src/sections/infoColumns/columns-list-view';





// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> עמודות </title>
      </Helmet>

      <ColumnsViewWrapper />
    </>
  );
}