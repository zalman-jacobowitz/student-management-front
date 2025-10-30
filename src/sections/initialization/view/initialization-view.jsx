import { Container, Box, Stack } from '@mui/material';
import { m } from 'framer-motion';

import { useSettingsContext } from 'src/components/settings';
import { varBgKenburns } from 'src/components/animate/variants/background';
import { CONFIG } from 'src/config-global';

import { InitializationWizard } from '../initialization-wizard';

// ----------------------------------------------------------------------

export function InitializationView() {
  const settings = useSettingsContext();

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
      }}
    >

      {/* Content */}
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <InitializationWizard />
      </Container>
    </Box>
  );
}