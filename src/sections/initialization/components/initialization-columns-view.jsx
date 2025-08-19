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
import useInitializationStore from "../initialization-state.ts";

// ----------------------------------------------------------------------

// Status configuration constants
const STATUS_CONFIGS = {
  visibility: {
    hidden: { label: 'מוסתר', color: 'error', icon: 'solar:eye-closed-bold' },
    visible: { label: 'גלוי', color: 'success', icon: 'solar:eye-bold' }
  },
  required: {
    true: { label: 'חובה', color: 'warning', icon: 'solar:danger-bold' },
    false: { label: 'אופציונלי', color: 'default', icon: 'solar:check-circle-bold' }
  },
  filters: {
    extra: { label: 'פילטר נגיש', color: 'info', icon: 'solar:verified-check-bold' },
    regular: { label: 'פילטר רגיל', color: 'default', icon: 'solar:filter-bold' }
  },
  group: {
    primary: { label: 'ראשי', color: 'primary', icon: 'solar:star-bold' },
    secondary: { label: 'משני', color: 'secondary', icon: 'solar:bookmark-bold' }
  }
};

// Helper functions
const getStatus = (type, value) => {
  if (type === 'visibility') {
    return STATUS_CONFIGS.visibility[value === '1' || value === true ? 'hidden' : 'visible'];
  }
  if (type === 'required') {
    return STATUS_CONFIGS.required[value === '1' || value === 'true' || value === true];
  }
  return STATUS_CONFIGS[type]?.[value] || null;
};

const generateStatusChips = (column) => {
  const typeInfo = columnsTypes[column.type] || { icon: 'mdi:help-circle', label: column.type };
  
  const chips = [
    { label: typeInfo.label, variant: 'outlined', color: 'default' },
    { ...getStatus('visibility', column.hidden), variant: 'filled' },
    { ...getStatus('required', column.required), variant: 'outlined' }
  ];

  const filterStatus = getStatus('filters', column.filters);
  const groupStatus = getStatus('group', column.group_name);
  
  if (filterStatus) chips.push({ ...filterStatus, variant: 'filled' });
  if (groupStatus) chips.push({ ...groupStatus, variant: 'filled' });
  
  return chips;
};

// Column List Item Component
const ColumnListItem = ({ column, onClick }) => {
  const typeInfo = columnsTypes[column.type] || { icon: 'mdi:help-circle', label: column.type };
  const statusChips = generateStatusChips(column);

  return (
    <ListItem disablePadding>
      <ListItemButton 
        onClick={() => onClick(column)}
        sx={{ 
          borderRadius: 1,
          mb: 0.5,
          '&:hover': { backgroundColor: 'action.hover' }
        }}
      >
        <ListItemIcon>
          <Iconify icon={typeInfo.icon} width={24} sx={{ color: 'primary.main' }} />
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
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.5, flexWrap: 'wrap', gap: 0.5 }}>
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
                    '& .MuiChip-icon': { fontSize: '0.75rem' }
                  }}
                />
              ))}
            </Stack>
          }
        />
        <Iconify icon="solar:alt-arrow-left-bold" width={20} sx={{ color: 'text.disabled' }} />
      </ListItemButton>
    </ListItem>
  );
};

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
    const originalColumnName = selectedColumn?.name;
    if (!originalColumnName) return;
    
    const propertiesToUpdate = {
      hidden: updatedColumn.hidden === '1' || updatedColumn.hidden === true,
      type: updatedColumn.type,
      name: updatedColumn.name,
      filters: updatedColumn.filters,
      group_name: updatedColumn.group_name,
      required: updatedColumn.required,
      label: updatedColumn.label,
      options: updatedColumn.options || []
    };

    Object.entries(propertiesToUpdate).forEach(([key, value]) => {
      if (value !== undefined) {
        updateColumnProperty(originalColumnName, key, value);
      }
    });
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
          {formattedColumns.map((column) => (
            <ColumnListItem 
              key={column.name} 
              column={column} 
              onClick={handleColumnClick}
            />
          ))}
        </List>
      </Paper>
      {selectedColumn && (
        <ColumnVisibilityDialog
          open={openColumnDialog}
          onClose={handleColumnDialogClose}
          column={selectedColumn}
          infoColumns={formattedColumns}
          selectOptions={[]} // TODO: Add select options if needed
          isInitializationMode // מצב איתחול
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