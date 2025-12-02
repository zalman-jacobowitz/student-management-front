import { Container, Box, Stack } from '@mui/material';
import { m } from 'framer-motion';

import { useSettingsContext } from 'src/components/settings';
import { varBgKenburns } from 'src/components/animate/variants/background';
import { CONFIG } from 'src/config-global';

import { InitializationWizard } from '../initialization-wizard';
import { useRouter } from 'src/routes/hooks';
import { useAuthContext } from 'src/auth/hooks';
import { paths } from 'src/routes/paths';
import { useEffect } from 'react';

// ----------------------------------------------------------------------

export function InitializationView() {
  const settings = useSettingsContext();
  const router = useRouter();
  const { user } = useAuthContext();
  const isAdmin = user?.role === 'admin';
  useEffect(() => {
  if (!isAdmin) {
    router.push(paths.dashboard.insert);
  }
  }, [isAdmin, router]);
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