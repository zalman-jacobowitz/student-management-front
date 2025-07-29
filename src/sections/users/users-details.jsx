import { Box, Chip, List, Stack, Avatar, Button, Drawer, Divider, Checkbox, ListItem, IconButton, Typography, ListItemIcon, ListItemText } from "@mui/material";

import { screenOptions } from "src/layouts/config-nav-dashboard";

import { Iconify } from "src/components/iconify";
import { Scrollbar } from "src/components/scrollbar";


export function UserListScreens({ student }) {
  console.log('screenOptions: ', screenOptions)
  student.screens = student.screens.filter(screen => screenOptions[screen])
  return (
  <>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.5 }}>
        
        <Typography variant="subtitle2" > מסכים </Typography>
        
        <IconButton
          size="small"
          color="primary"
          sx={{
            width: 24,
            height: 24,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            '&:hover': { bgcolor: 'primary.dark' },
          }}
        >
          <Iconify icon="mingcute:add-line" />
        </IconButton>
      </Stack>
      
      <List sx={{ py: 0 }}>
        {student.screens.map((screen) => (
          <ListItem
            key={screen.id}
            sx={{
              px: 2.5,
              py: 1,
              minHeight: 48,
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
            
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Iconify
                icon={screenOptions[screen].regularIcon} 
                width={24} 
                sx={{ color: 'text.secondary' }}
              />
            </ListItemIcon>
            <ListItemText 
              primary={screenOptions[screen].title}
              primaryTypographyProps={{
                variant: 'body2',
                fontWeight: 'fontWeightMedium'
              }}
            />
          </ListItem>
        ))}
      </List>
    </>
  );
}


export function UsersPermmissions({ student }) {
  
  const permissions = student.details.permissions || []


  return (
  <>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.5 }}>
        <Typography variant="subtitle2"> הרשאות </Typography>

        <IconButton
          size="small"
          color="primary"
          sx={{
            width: 24,
            height: 24,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            '&:hover': { bgcolor: 'primary.dark' },
          }}
        >
          <Iconify icon="mingcute:add-line" />
        </IconButton>
      </Stack>
      
      <List sx={{ py: 0 }}>
        {permissions.map((permission, index) => {
          const tableLabel = permission.table === 'info_students' ? 'תלמידים' : 
                            permission.table === 'templates' ? 'זמנים' : permission.table;
          
          // הצגת המערך של הערכים
          const valueDisplay = Array.isArray(permission.values) 
            ? permission.values.join(', ') 
            : permission.values;
          
          return (
            <ListItem
              key={`${permission.table}-${permission.columnName}-${index}`}
              sx={{
                px: 2.5,
                py: 1,
                minHeight: 60,
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Iconify 
                  icon="mdi:shield-key-outline"
                  width={24} 
                  sx={{ color: 'text.secondary' }}
                />
              </ListItemIcon>
              
              <ListItemText 
                primary={`${tableLabel} - ${permission.label}: "${valueDisplay}"`}
                secondary={
                  <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                    <Chip
                      size="small" 
                      label={permission.operator === 'and' ? 'AND' : 'OR'} 
                      color="primary" 
                      variant="outlined"
                      sx={{ fontSize: '0.65rem', height: 18 }}
                    />
                    <Chip 
                      size="small" 
                      label={permission.side === 'server' ? 'שרת' : 'לקוח'} 
                      color="secondary" 
                      variant="outlined"
                      sx={{ fontSize: '0.65rem', height: 18 }}
                    />
                  </Stack>
                }
                primaryTypographyProps={{
                  variant: 'body2',
                  fontWeight: 'fontWeightMedium'
                }}
                secondaryTypographyProps={{
                  variant: 'caption'
                }}
              />
            </ListItem>
          );
        })}
      </List>
    </>
  );

}

export function UsersRowDetails({
  student,
  open,
  onClose,
  ...other
}) {
  

  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor="right"
      slotProps={{ backdrop: { invisible: true } }}
      PaperProps={{ sx: { width: 320 } }}
      {...other}
    >
      <Scrollbar>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.5 }}>
          <Typography variant="h6"> מידע נוסף </Typography>

          <Checkbox
            color="warning"
            icon={<Iconify icon="eva:star-outline" />}
            checkedIcon={<Iconify icon="eva:star-fill" />}
            checked
            onChange={()=>{}}
          />
        </Stack>

        <Stack
          spacing={.5}
          justifyContent="center"
          sx={{ p: 2.5, bgcolor: 'background.neutral' }}
        >
          <Avatar
            alt=''
            src='https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_12.jpg'
            sx={{ width: 64, height: 64, mx: 'auto' , mb: 1.3}}
          />
          <Typography align='center' variant="subtitle1" sx={{ wordBreak: 'break-all' }}>
            {student.firstName} {student.lastName}
          </Typography>
          <Typography align='center' variant="subtitle2" color="GrayText" sx={{ wordBreak: 'break-all' }}>
            {student.email}
          </Typography>

          <Divider sx={{ borderStyle: 'dashed' }} />
        </Stack>
          <UserListScreens student={student} />
        
          <Divider sx={{ borderStyle: 'dashed' }} />         
        
          <UsersPermmissions student={student} /> 

      </Scrollbar>

      <Box sx={{ p: 2.5 }}>
        <Button
          fullWidth
          variant="soft"
          color="error"
          size="large"
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
          onClick={()=>{}}
        >
          מחק משתמש
        </Button>
      </Box>
    </Drawer>

);
}