import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { UploadIllustration } from 'src/assets/illustrations';

// ----------------------------------------------------------------------

export function UploadPlaceholder({ sx, ...other }) {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      sx={sx}
      {...other}
    >
      <UploadIllustration hideBackground sx={{ width: 200 }} />

      <Stack spacing={1} sx={{ textAlign: 'center' }}>
        <Box sx={{ typography: 'h6' }}>גרר או בחר קובץ מהמחשב</Box>
        <Box sx={{ typography: 'body2', color: 'text.secondary' }}>
          גרור קבצים לכאן או לחץ כדי 
          <Box
            component="span"
            sx={{ mx: 0.5, color: 'primary.main', textDecoration: 'underline' }}
          >
            לסייר
          </Box>
          במחשב שלך.
        </Box>
      </Stack>
    </Box>
  );
}
