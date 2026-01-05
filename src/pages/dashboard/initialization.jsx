import { Helmet } from 'react-helmet-async';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTranslate } from 'src/locales/use-locales';
import { InitializationView } from 'src/sections/initialization/view';

// ----------------------------------------------------------------------

export default function InitializationPage() {
  const { t } = useTranslate();
  const metadata = {
    title: t('screens.initialization'),
  };

  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <InitializationView/>
    </>
  );
}