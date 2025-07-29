import { Box, Typography, Stack, MenuItem } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { useEffect } from 'react';

import { Field } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import useInitializationStore from '../initialization-state';

// ----------------------------------------------------------------------

export function ColumnSelectionStep() {
  const { watch } = useFormContext();
  const { columnsList, updateColumnProperty } = useInitializationStore();
  const watchedValues = watch('columnSelection');

  // Handler functions for updating column properties
  const handleNameColumnChange = (columnName) => {
    if (columnName) {
      updateColumnProperty(columnName, 'group_name', 'primary');
    }
  };

  const handleFamilyColumnChange = (columnName) => {
    if (columnName) {
      updateColumnProperty(columnName, 'group_name', 'primary');
    }
  };

  const handleAccessibleColumnChange = (columnName) => {
    if (columnName) {
      updateColumnProperty(columnName, 'group_name', 'secondary');
    }
  };

  const handleFilterColumnsChange = (selectedColumns) => {
    // Reset all columns filters property first
    columnsList?.forEach(column => {
      updateColumnProperty(column, 'filters', '');
    });
    
    // Set selected filter columns to 'extra'
    if (selectedColumns && selectedColumns.length > 0) {
      selectedColumns.forEach(column => {
        updateColumnProperty(column, 'filters', 'extra');
      });
    }
  };

  const handleDuplicateColumnsChange = (selectedColumns) => {
    // Reset filters for all columns that aren't filter columns
    const currentFilterColumns = watchedValues?.filterColumns || [];
    columnsList?.forEach(column => {
      // Don't override filter columns that are set to 'extra'
      if (!currentFilterColumns.includes(column)) {
        updateColumnProperty(column, 'filters', '');
      }
    });
    
    // Set selected duplicate columns to 'unique'
    if (selectedColumns && selectedColumns.length > 0) {
      selectedColumns.forEach(column => {
        updateColumnProperty(column, 'filters', 'unique');
      });
    }
  };

  // Watch for changes and update column properties
  useEffect(() => {
    if (watchedValues?.nameColumn) {
      handleNameColumnChange(watchedValues.nameColumn);
    }
  }, [watchedValues?.nameColumn]);

  useEffect(() => {
    if (watchedValues?.familyColumn) {
      handleFamilyColumnChange(watchedValues.familyColumn);
    }
  }, [watchedValues?.familyColumn]);

  useEffect(() => {
    if (watchedValues?.accessibleColumn) {
      handleAccessibleColumnChange(watchedValues.accessibleColumn);
    }
  }, [watchedValues?.accessibleColumn]);

  useEffect(() => {
    handleFilterColumnsChange(watchedValues?.filterColumns);
  }, [watchedValues?.filterColumns]);

  useEffect(() => {
    handleDuplicateColumnsChange(watchedValues?.duplicateColumns);
  }, [watchedValues?.duplicateColumns]);

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Field.Select
          name="columnSelection.nameColumn"
          label="בחר עמודת שם"
          variant="filled"
          InputLabelProps={{ shrink: true }}
          helperText="בחר את העמודה המכילה שמות פרטיים"
          fullWidth
        >
          {columnsList?.map((column) => (
            <MenuItem key={column} value={column}>
              <Iconify icon="solar:user-bold" width={20} sx={{ mr: 1 }} />
              <Typography variant="body2">{column}</Typography>
            </MenuItem>
          ))}
        </Field.Select>

        <Field.Select
          name="columnSelection.familyColumn"
          label="בחר עמודת משפחה"
          variant="filled"
          InputLabelProps={{ shrink: true }}
          helperText="בחר את העמודה המכילה שמות משפחה"
          fullWidth
        >
          {columnsList?.map((column) => (
            <MenuItem key={column} value={column}>
              <Iconify icon="solar:users-group-two-rounded-bold" width={20} sx={{ mr: 1 }} />
              <Typography variant="body2">{column}</Typography>
            </MenuItem>
          ))}
        </Field.Select>

        <Field.Select
          name="columnSelection.accessibleColumn"
          label="בחר עמודה נגישה"
          variant="filled"
          InputLabelProps={{ shrink: true }}
          helperText="בחר עמודה שתהיה נגישה במהירות"
          fullWidth
        >
          {columnsList?.map((column) => (
            <MenuItem key={column} value={column}>
              <Iconify icon="solar:verified-check-bold" width={20} sx={{ mr: 1 }} />
              <Typography variant="body2">{column}</Typography>
            </MenuItem>
          ))}
        </Field.Select>

        <Field.MultiSelect
          name="columnSelection.filterColumns"
          label="בחירת עמודות לפילטרים נגישים (מוגבל ל-2)"
          variant="filled"
          InputLabelProps={{ shrink: true }}
          helperText="בחר עד 2 עמודות שישמשו לפילטור מהיר"
          options={columnsList?.map((column) => ({
            value: column,
            label: column
          })) || []}
          checkbox
          chip
          fullWidth
        />

        <Field.MultiSelect
          name="columnSelection.duplicateColumns"
          label="בחירת עמודות למציאת כפילויות"
          variant="filled"
          InputLabelProps={{ shrink: true }}
          helperText="בחר עמודות שישמשו לזיהוי רשומות כפולות"
          options={columnsList?.map((column) => ({
            value: column,
            label: column
          })) || []}
          checkbox
          chip
          fullWidth
        />

        {watchedValues?.nameColumn && watchedValues?.familyColumn && (
          <Box sx={{ p: 2, bgcolor: 'success.lighter', borderRadius: 1 }}>
            <Typography variant="body2" color="success.dark">
              נבחרו עמודות: {watchedValues.nameColumn} (שם) ו-{watchedValues.familyColumn} (משפחה)
            </Typography>
          </Box>
        )}
      </Stack>
    </Box>
  );
}