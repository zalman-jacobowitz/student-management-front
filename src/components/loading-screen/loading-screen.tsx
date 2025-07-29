import Box from '@mui/material/Box';
import { SxProps } from '@mui/material';
import Portal from '@mui/material/Portal';
import LinearProgress from '@mui/material/LinearProgress';

// ----------------------------------------------------------------------

type LoadingScreenProps = {
  portal?: boolean;
  sx?: SxProps;
  other?: any;
}

export function LoadingScreen({ portal, sx, ...other }: LoadingScreenProps) {
  const content = (
    <Box
      sx={{
        px: 5,
        width: 1,
        flexGrow: 1,
        minHeight: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...sx,
      }}
      {...other}
    >
      <LinearProgress color="inherit" sx={{ width: 1, maxWidth: 360 }} />
    </Box>
  );

  if (portal) {
    return <Portal>{content}</Portal>;
  }

  return content;
}
