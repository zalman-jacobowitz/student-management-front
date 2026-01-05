import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useTranslate } from 'src/locales/use-locales';

import { TemplatesViewWrapper } from 'src/sections/templates/templates-list-view.tsx';

// ----------------------------------------------------------------------

export default function Page() {
  const { t } = useTranslate();
  const metadata = { title: `${t('screens.templates')} | ${CONFIG.appName}` };

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TemplatesViewWrapper />
    </>
  );
}