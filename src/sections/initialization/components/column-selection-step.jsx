import { Box, Typography, MenuItem } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { useEffect, useCallback } from 'react';

import { Field } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { MasterStep } from 'src/components/steps-form';
import useInitializationStore from '../initialization-state.ts';

// ----------------------------------------------------------------------

export function ColumnSelectionStep() {
  const { watch } = useFormContext();
  const { columnsList, updateColumnProperty } = useInitializationStore();
  const watchedValues = watch('columnSelection');

  const fields = [
    {
      component: Field.Select,
      name: "columnSelection.nameColumn",
      label: "בחר עמודת שם",
      variant: "filled",
      InputLabelProps: { shrink: true },
      helperText: "בחר את העמודה המכילה שמות פרטיים",
      step: 1,
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
    <Box sx={{ p: 3 }}>
      <MasterStep fields={fields} number={1} spacing={3} />      
      {watchedValues?.nameColumn && watchedValues?.familyColumn && (
        <Box sx={{ p: 2, bgcolor: 'success.lighter', borderRadius: 1, mt: 3 }}>
          <Typography variant="body2" color="success.dark">
            נבחרו עמודות: {watchedValues.nameColumn} (שם) ו-{watchedValues.familyColumn} (משפחה)
          </Typography>
        </Box>
      )}
    </Box>
  );
}