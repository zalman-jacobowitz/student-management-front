import { Typography } from "@mui/material";

interface PageTitleProps {
  primary?: string;
  secondary?: string;
}

export function PageTitle({
    primary = '',
    secondary = ''
  }: PageTitleProps) {
    return (
      <>
        <Typography variant="h3" sx={{ mb: 0, textAlign: 'center' }}>
          {primary}
        </Typography>
        { secondary &&
        <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
          {secondary}
        </Typography>
        }
      </>
    );
  }