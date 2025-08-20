import { Stack, Avatar, TableCell, Typography, ListItemText, Box } from "@mui/material";

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
    <TableCell className="avatar-cell" >
      <Stack direction="row" alignItems="center">
        
        <Box className="no-print">
          
          <Avatar

            alt=''
            src="https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_1.jpg"
            sx={{ mr: 2 }} 
          />
          </Box>

          <ListItemText

            secondary={<span className="no-print">{secondary}</span>}
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
