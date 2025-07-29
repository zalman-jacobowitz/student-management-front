import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

export function FormReturnLink({ href = '', label = 'חזרה', sx, ...other }) {
  return (
    <Box sx={{ mx: 'auto', mt: 3, ...sx }} {...other}>
      <Stack
        alignItems="center"
        sx={{
          p: 2,
          borderRadius: 1.5,
          typography: 'body2',
          bgcolor: 'background.neutral',
        }}
      >
        <Typography variant="body2" noWrap>
          <Link component={RouterLink} href={href} variant="subtitle2" color="inherit">
            {label}
          </Link>
        </Typography>
      </Stack>
    </Box>
  );
}
