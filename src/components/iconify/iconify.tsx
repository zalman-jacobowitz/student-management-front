import { forwardRef } from 'react';
import { Icon, disableCache } from '@iconify/react';

import Box from '@mui/material/Box';

import { iconifyClasses } from './classes';

// ----------------------------------------------------------------------

interface IconifyProps {
  className?: string;
  width?: number;
  sx?: any;
  [key: string]: any;
}

export const Iconify = forwardRef<HTMLDivElement, IconifyProps>(({ className, width = 20, sx, ...other }, ref) => (
  <Box
    ref={ref}
    component={Icon}
    className={iconifyClasses.root.concat(className ? ` ${className}` : '')}
    sx={{
      width,
      height: width,
      flexShrink: 0,
      display: 'inline-flex',
      ...sx,
    }}
    {...other}
  />
));

// https://iconify.design/docs/iconify-icon/disable-cache.html
disableCache('local');
