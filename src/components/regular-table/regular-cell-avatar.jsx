import { Stack, Avatar, TableCell, Typography, ListItemText } from "@mui/material";

/**
 * description in hebrew: 
 * תא טבלה שמציג תמונה ושם ושם משנה
 * 
 * @param {CellAvatarProps} props - פרמטרים של הפונקציה
 * @param {string} props.primary - שם התלמיד
 * @param {string} props.secondary - שם משנה
 * 
 * @returns {JSX.Element} תא טבלה שמציג תמונה ושם ושם משנה
 * 
 * @example
 * <CellAvatar
 *   primary="שניאור זלמן יעקובוביץ"
 *   secondary="מתכנת"
 * />
 * 
 */


export function CellAvatar({
  primary='',
  secondary=''
}) {

  return (
    <TableCell>
      <Stack direction="row" alignItems="center">
        
          <Avatar
            alt=''
            src="https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_1.jpg"
            sx={{ mr: 2 }} 
          />

          <ListItemText
            secondary={secondary}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        >

        <Typography noWrap sx={{ width: 1 }}>
          {primary}
        </Typography>
      
      </ListItemText>
    </Stack>
  </TableCell>
  )
}
