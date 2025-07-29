import { useState } from "react";

import { 
  Box, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Chip, 
  Typography, 
  Paper,
  Stack,
  Alert
} from "@mui/material";

import { Iconify } from "src/components/iconify";
import { columnsTypes } from "src/utils/uinqe_usege/columnsTypes";
import { ColumnVisibilityDialog } from "../../infoColumns/column-edit-steps";
import useInitializationStore from "../initialization-state";

// ----------------------------------------------------------------------

export function InitializationColumnsView() {
  const { formattedColumns, updateColumnProperty } = useInitializationStore();
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [openColumnDialog, setOpenColumnDialog] = useState(false);

  const handleColumnClick = (column) => {
    setSelectedColumn(column);
    setOpenColumnDialog(true);
  };

  const handleColumnDialogClose = () => {
    setOpenColumnDialog(false);
    setSelectedColumn(null);
  };

  const handleColumnUpdate = (updatedColumn) => {
    console.log('Handling column update in initialization:', updatedColumn);
    
    // Find the original column to get the original name in case it changed
    const originalColumnName = selectedColumn?.name;
    
    if (!originalColumnName) {
      console.error('No original column name found');
      return;
    }
    
    // Update properties in the initialization state
    const propertiesToUpdate = {
      'hidden': updatedColumn.hidden === '1' || updatedColumn.hidden === true,
      'type': updatedColumn.type,
      'name': updatedColumn.name,
      'filters': updatedColumn.filters,
      'group_name': updatedColumn.group_name,
      'required': updatedColumn.required,
      'label': updatedColumn.label,
      'options': updatedColumn.options || []
    };

    // Update each property individually
    Object.entries(propertiesToUpdate).forEach(([key, value]) => {
      if (value !== undefined) {
        updateColumnProperty(originalColumnName, key, value);
      }
    });
  };

  const getColumnTypeInfo = (type) => columnsTypes[type] || {
      icon: 'mdi:help-circle',
      label: type,
      description: 'סוג לא ידוע'
    };

  const getVisibilityStatus = (hidden) => hidden === '1' || hidden === true ? {
      label: 'מוסתר',
      color: 'error',
      icon: 'solar:eye-closed-bold'
    } : {
      label: 'גלוי',
      color: 'success', 
      icon: 'solar:eye-bold'
    };

  const getRequiredStatus = (required) => required === '1' || required === 'true' || required === true ? {
      label: 'חובה',
      color: 'warning',
      icon: 'solar:danger-bold'
    } : {
      label: 'אופציונלי',
      color: 'default',
      icon: 'solar:check-circle-bold'
    };

  const getFilterStatus = (filters) => {
    switch (filters) {
      case 'extra':
        return {
          label: 'פילטר נגיש',
          color: 'info',
          icon: 'solar:verified-check-bold'
        };
      case 'regular':
        return {
          label: 'פילטר רגיל',
          color: 'default',
          icon: 'solar:filter-bold'
        };
      default:
        return null;
    }
  };

  const getGroupStatus = (group_name) => {
    switch (group_name) {
      case 'primary':
        return {
          label: 'ראשי',
          color: 'primary',
          icon: 'solar:star-bold'
        };
      case 'secondary':
        return {
          label: 'משני',
          color: 'secondary',
          icon: 'solar:bookmark-bold'
        };
      default:
        return null;
    }
  };

  if (!formattedColumns || formattedColumns.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          עדיין לא הועלו נתוני עמודות. אנא העלה קובץ תלמידים תחילה.
        </Alert>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Iconify 
            icon="solar:database-bold-duotone" 
            width={48} 
            sx={{ color: 'text.disabled', mb: 2 }}
          />
          <Typography variant="body2" color="text.secondary">
            לא נמצאו עמודות להציג
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 2, m: 0 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="h6" component="h2">
            עמודות מהקובץ שהועלה
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formattedColumns.length} עמודות
          </Typography>
        </Stack>

        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            כאן תוכל לערוך את הגדרות העמודות לפני השלמת האיתחול. לחץ על עמודה כדי לערוך את ההגדרות שלה.
          </Typography>
        </Alert>

        <List sx={{ maxHeight: 400, overflow: 'auto' }}>
          {formattedColumns.map((column) => {
            const typeInfo = getColumnTypeInfo(column.type);
            const visibilityStatus = getVisibilityStatus(column.hidden);
            const requiredStatus = getRequiredStatus(column.required);
            const filterStatus = getFilterStatus(column.filters);
            const groupStatus = getGroupStatus(column.group_name);

            // Create chips array for all the statuses
            const statusChips = [
              // סוג העמודה
              {
                label: typeInfo.label,
                variant: 'outlined',
                color: 'default'
              },
              // נראות
              {
                label: visibilityStatus.label,
                icon: visibilityStatus.icon,
                color: visibilityStatus.color,
                variant: 'filled'
              },
              // חובה
              {
                label: requiredStatus.label,
                icon: requiredStatus.icon,
                color: requiredStatus.color,
                variant: 'outlined'
              }
            ];

            // הוסף פילטר אם קיים
            if (filterStatus) {
              statusChips.push({
                label: filterStatus.label,
                icon: filterStatus.icon,
                color: filterStatus.color,
                variant: 'filled'
              });
            }

            // הוסף קבוצה אם קיימת
            if (groupStatus) {
              statusChips.push({
                label: groupStatus.label,
                icon: groupStatus.icon,
                color: groupStatus.color,
                variant: 'filled'
              });
            }

            return (
              <ListItem key={column.name} disablePadding>
                <ListItemButton 
                  onClick={() => handleColumnClick(column)}
                  sx={{ 
                    borderRadius: 1,
                    mb: 0.5,
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    }
                  }}
                >
                  <ListItemIcon>
                    <Iconify 
                      icon={typeInfo.icon} 
                      width={24} 
                      sx={{ color: 'primary.main' }}
                    />
                  </ListItemIcon>
                  
                  <ListItemText 
                    primary={
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="subtitle2">
                          {column.label || column.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ({column.name})
                        </Typography>
                      </Stack>
                    }
                    secondary={
                      <Stack 
                        direction="row" 
                        alignItems="center" 
                        spacing={0.5} 
                        sx={{ mt: 0.5, flexWrap: 'wrap', gap: 0.5 }}
                      >
                        {statusChips.map((chip, index) => (
                          <Chip
                            key={index}
                            size="small"
                            label={chip.label}
                            icon={chip.icon ? <Iconify icon={chip.icon} width={14} /> : undefined}
                            color={chip.color || 'default'}
                            variant='soft'
                            sx={{ 
                              fontSize: '0.70rem',
                              height: 20,
                              '& .MuiChip-icon': {
                                fontSize: '0.75rem'
                              }
                            }}
                          />
                        ))}
                      </Stack>
                    }
                  />

                  <Iconify 
                    icon="solar:alt-arrow-left-bold" 
                    width={20} 
                    sx={{ color: 'text.disabled' }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Paper>

      {/* דיאלוג עריכת עמודה */}
      {selectedColumn && (
        <ColumnVisibilityDialog
          open={openColumnDialog}
          onClose={handleColumnDialogClose}
          column={selectedColumn}
          infoColumns={formattedColumns}
          selectOptions={[]} // TODO: Add select options if needed
          isInitializationMode={true} // מצב איתחול
          onComplete={(updatedColumn) => {
            // Update the initialization state with changes
            handleColumnUpdate(updatedColumn);
            handleColumnDialogClose();
          }}
        />
      )}
    </Box>
  );
}