
import { Chip } from '@mui/material';
import { useAuthContext } from 'src/auth/hooks';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function AdminBadge() {
  const { user } = useAuthContext();
  if (user?.role !== 'admin') {
    return null;
  }

  return (
    <Chip
      icon={<Iconify icon="solar:shield-bold" sx={{ width: 16, height: 16 }} />}
      label="מנהל"
      size="small"
      variant="outlined"
      color="info"
      sx={{
        height: 'auto',
        fontSize: '0.7rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        '& .MuiChip-icon': {
          marginRight: '4px',
        },
      }}
    />
  );
}
