import { Helmet } from 'react-helmet-async';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { InitializationView } from 'src/sections/initialization/view';

// ----------------------------------------------------------------------

const metadata = {
  title: 'איתחול',
};

export default function InitializationPage() {
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <InitializationView/>
    </>
  );
}