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
      {/* Animated Background Layer */}
      <Box
        component={m.div}
        {...varBgKenburns({ duration: 20, ease: 'easeInOut' }).right}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${CONFIG.assetsDir}/assets/background/background-3-blur.webp)`,
          opacity: 0.2,
          zIndex: -1,

        }}
      />

      {/* Content */}
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <InitializationWizard />
      </Container>
    </Box>
  );
}