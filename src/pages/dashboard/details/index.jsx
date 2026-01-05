import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useTranslate } from 'src/locales/use-locales';

import { DetailsViewWrapper } from 'src/sections/details/details-list-view';


// ----------------------------------------------------------------------

export default function Page() {
  const { t } = useTranslate();
  const metadata = { title: `${t('screens.details')} | ${CONFIG.appName}` };

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DetailsViewWrapper />
      
    </>
  );
}