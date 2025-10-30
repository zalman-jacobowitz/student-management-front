import { Box, Typography, MenuItem, Button, ListItemText, ListItemButton, ListItemAvatar, ListItem, Avatar, Card, CardHeader } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { useEffect, useCallback } from 'react';

import { Field } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { MasterStep } from 'src/components/steps-form';
import { Walktour, useWalktour } from 'src/components/walktour';
import { responsiveFontSizes } from 'src/theme/styles';
import useInitializationStore from '../initialization-state.ts';

// ----------------------------------------------------------------------

function primaryText(level) {
  switch (level) {
    case 1:
      return (
        <>
          <span style={{ color: 'red' }}>ישראל</span> ישראלי
        </>
      );
    case 2:
      return (
        <>
          ישראל <span style={{ color: 'red' }}>ישראלי</span>
        </>
      );
    case 3:
      return <>ישראל ישראלי</>;
    default:
      return null;
  }
}

const DemoItem = ({level=1, text=''}) => {
  
   return (
    <Box sx={{padding: { sm: 1, md: 1.5, lg: 2 } }}>
    <Typography 
      padding={{ sm: 1, md: 1.5, lg: 2 }}
      sx={responsiveFontSizes({ sm: 13, md: 14, lg: 14 })}
    >
      כעת אתה מגדיר את ה{text}
    </Typography>
    <Card>
      <ListItem>
        <ListItemAvatar>
          <Avatar alt=''/>
        </ListItemAvatar>
        <ListItemText
          primary={primaryText(level)}
          secondary="ביתר עילית"
          secondaryTypographyProps={{color: level === 3 ? 'red' : 'inherit'}} />
      </ListItem>
    </Card>
  </Box>
)
}
//-----------------------------------------------------------------------
export function ColumnSelectionStep() {
  const { watch } = useFormContext();
  const { columnsList, updateColumnProperty } = useInitializationStore();
  const watchedValues = watch('columnSelection');
  

const walktourSteps = [
  {
    target: '#first',
    title: 'בחר את שם העמודה המצביעה על שם פרטי',
    content: <DemoItem level={1} text='שם פרטי'/>, //<ListItemAvatar primary='שניאור זלמן יעקובוביץ' secondary='ביתר עילית'/>,
    placement: 'right',
    disableBeacon: true
  },
  {
    target: '#sec',
    title: 'בחר את שם העמודה המצביעה על שם משפחה',
    content: <DemoItem level={2} text='שם משפחה'/>, //<ListItemAvatar primary='שניאור זלמן יעקובוביץ' secondary='ביתר עילית'/>,
    placement: 'right',
    disableBeacon: true
  },
  {
    target: '#last',
    title: 'בחר את המידע שברצונך לראות בנגישות: לדוגמא "עיר"',
    content: <DemoItem level={3} text='עמודה נגישה'/>, //<ListItemAvatar primary='שניאור זלמן יעקובוביץ' secondary='ביתר עילית'/>,
    placement: 'right',
    disableBeacon: true
  }
  ];
  const fields = [
    {
      component: Field.Select,
      name: "columnSelection.nameColumn",
      label: "בחר עמודת שם",
      variant: "filled",
      InputLabelProps: { shrink: true },
      helperText: "בחר את העמודה המכילה שמות פרטיים",
      step: 1,
      id: 'first',
      children: columnsList?.map((column) => (
        <MenuItem key={column} value={column}>
          <Iconify icon="solar:user-bold" width={20} sx={{ mr: 1 }} />
          <Typography variant="body2">{column}</Typography>
        </MenuItem>
      )) || []
    },
    {
      component: Field.Select,
      name: "columnSelection.familyColumn",
      label: "בחר עמודת משפחה",
      variant: "filled",
      InputLabelProps: { shrink: true },
      helperText: "בחר את העמודה המכילה שמות משפחה",
      step: 1,
      id: "sec",
      children: columnsList?.map((column) => (
        <MenuItem key={column} value={column}>
          <Iconify icon="solar:users-group-two-rounded-bold" width={20} sx={{ mr: 1 }} />
          <Typography variant="body2">{column}</Typography>
        </MenuItem>
      )) || []
    },
    {
      component: Field.Select,
      name: "columnSelection.accessibleColumn",
      label: "בחר עמודה נגישה",
      variant: "filled",
      id: "last",
      InputLabelProps: { shrink: true },
      helperText: "בחר עמודה שתהיה נגישה במהירות",
      step: 1,
      children: columnsList?.map((column) => (
        <MenuItem key={column} value={column}>
          <Iconify icon="solar:verified-check-bold" width={20} sx={{ mr: 1 }} />
          <Typography variant="body2">{column}</Typography>
        </MenuItem>
      )) || []
    },
    {
      component: Field.MultiSelect,
      name: "columnSelection.filterColumns",
      label: "בחירת עמודות לפילטרים נגישים (מוגבל ל-2)",
      variant: "filled",
      InputLabelProps: { shrink: true },
      helperText: "בחר עד 2 עמודות שישמשו לפילטור מהיר",
      options: columnsList?.map((column) => ({
        value: column,
        label: column
      })) || [],
      checkbox: true,
      chip: true,
      step: 1
    },
    {
      component: Field.MultiSelect,
      name: "columnSelection.duplicateColumns",
      label: "בחירת עמודות למציאת כפילויות",
      variant: "filled",
      InputLabelProps: { shrink: true },
      helperText: "בחר עמודות שישמשו לזיהוי רשומות כפולות",
      options: columnsList?.map((column) => ({
        value: column,
        label: column
      })) || [],
      checkbox: true,
      chip: true,
      step: 1
    }
    
  ];

  return (
    <Box sx={{ p: { sm: 2, md: 3, lg: 4 } }}>
      <MasterStep fields={fields} number={1} spacing={{ sm: 2, md: 2.5, lg: 3 }} />
      <Walktour {...useWalktour({ steps: walktourSteps })} />
    </Box>
  );
}