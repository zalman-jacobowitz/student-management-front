import { IconButton, Tooltip } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { useWalktourStore } from './walktour-store';

// ----------------------------------------------------------------------

export function HelpButton() {
  const { toggleHelp } = useWalktourStore();

  return (
    <Tooltip title="הצג הדרכה">
      <IconButton 
        onClick={toggleHelp}
        color="primary"
        size="small"
      >
        <Iconify icon="mdi:help-circle" width={24} />
      </IconButton>
    </Tooltip>
  );
}
