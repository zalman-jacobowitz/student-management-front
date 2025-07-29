import { useState, Suspense } from "react";

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
  Fab,
  Stack
} from "@mui/material";

import { paths } from "src/routes/paths";
import { useInfoColumns } from "src/actions/columns_with_select";
import { LoadingScreen } from "src/components/loading-screen";
import { Iconify } from "src/components/iconify";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";

import { columnsTypes } from "src/utils/uinqe_usege/columnsTypes";
import { ColumnVisibilityDialog, ColumnGeneralSettingsDialog } from "./column-edit-steps";

// ----------------------------------------------------------------------

const LINKS = [
  { name: 'מסך-ראשי', href: paths.dashboard.root },
  { name: 'עמודות', href: paths.dashboard.insert },
  { name: 'רשימה מינימלית' },
];

// ----------------------------------------------------------------------

function ColumnsMinimalListView() {
  const infoStudents = useInfoColumns('info_students');
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [openColumnDialog, setOpenColumnDialog] = useState(false);
  const [openGeneralDialog, setOpenGeneralDialog] = useState(false);

  const handleColumnClick = (column) => {
    setSelectedColumn(column);
    setOpenColumnDialog(true);
  };

  const handleColumnDialogClose = () => {
    setOpenColumnDialog(false);
    setSelectedColumn(null);
  };

  const handleGeneralDialogOpen = () => {
    setOpenGeneralDialog(true);
  };

  const handleGeneralDialogClose = () => {
    setOpenGeneralDialog(false);
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

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 2, m: 0 }} >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="h6" component="h2">
            עמודות מערכת
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {infoStudents.newData?.length || 0} עמודות
          </Typography>
        </Stack>

        <List sx={{ maxHeight: 400, overflow: 'auto' }}>
          {infoStudents.newData?.map((column) => {
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

        {(!infoStudents.newData || infoStudents.newData.length === 0) && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Iconify 
              icon="solar:database-bold-duotone" 
              width={48} 
              sx={{ color: 'text.disabled', mb: 2 }}
            />
            <Typography variant="body2" color="text.secondary">
              לא נמצאו עמודות במערכת
            </Typography>
          </Box>
        )}
      </Paper>

      {/* כפתור צף להגדרות כלליות */}
      <Fab
        color="primary"
        aria-label="הגדרות כלליות"
        onClick={handleGeneralDialogOpen}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000
        }}
      >
        <Iconify icon="solar:settings-bold" width={24} />
      </Fab>

      {/* דיאלוג עריכת עמודה */}
      {selectedColumn && (
        <ColumnVisibilityDialog
          open={openColumnDialog}
          onClose={handleColumnDialogClose}
          column={selectedColumn}
          infoColumns={infoStudents.newData}
          selectOptions={[]} // TODO: Add select options if needed
          onComplete={() => {
            // Refresh data after edit
            console.log('Column updated');
          }}
        />
      )}

      {/* דיאלוג הגדרות כלליות */}
      <ColumnGeneralSettingsDialog
        open={openGeneralDialog}
        onClose={handleGeneralDialogClose}
        onComplete={() => {
          console.log('General settings updated');
        }}
      />
    </Box>
  );
}

// ----------------------------------------------------------------------

export function ColumnsMinimalViewWrapper() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <ColumnsMinimalListView />
    </Suspense>
  );
}