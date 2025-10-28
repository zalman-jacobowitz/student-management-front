import { Container, Typography } from '@mui/material';

import { useSettingsContext } from 'src/components/settings';

import { InitializationWizard } from '../initialization-wizard';

// ----------------------------------------------------------------------

export function InitializationView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <InitializationWizard />
    </Container>
  );
}