import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export function SignUpTerms() {
  return (
    <Stack
      spacing={1}
      sx={{
        mt: 3,
        textAlign: 'center',
        typography: 'body2',
        color: 'text.secondary',
      }}
    >
      <Typography>
        על ידי ההרשמה, אני מסכים/ה ל
        <Link href="#">תנאי השימוש</Link>
        {' וכן ל'}
        <Link href="#">מדיניות הפרטיות</Link>
      </Typography>
    </Stack>
  );
}
