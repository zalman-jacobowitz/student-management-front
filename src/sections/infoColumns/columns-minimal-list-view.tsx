import { useState, Suspense } from "react";

import { 
  Box, 
  Typography, 
  Paper,
  Fab,
  Stack
} from "@mui/material";

import { paths } from "src/routes/paths";

import { useBoolean } from "src/hooks/use-boolean";

import { useInfoColumns } from "src/actions/columns_with_select";

import { Iconify } from "src/components/iconify";
import { LoadingScreen } from "src/components/loading-screen";
import { useWalktour, Walktour } from "src/components/walktour";

import { ColumnVisibilityDialog, ColumnGeneralSettingsDialog } from "./column-edit-steps";
import { ColumnsList } from "./columns-list-minimal";

// ----------------------------------------------------------------------

const LINKS = [
  { name: 'מסך-ראשי', href: paths.dashboard.root },
  { name: 'עמודות', href: paths.dashboard.insert },
  { name: 'רשימה מינימלית' },
];
// ---------------------------------------------------------------------

// ----------------------------------------------------------------------


function ColumnsMinimalListView() {
  // הוק לקבלת נתוני העמודות
  const infoStudents = useInfoColumns('info_students');

  // סטייט לשמירת העמודה שנבחרה
  const [selectedColumn, setSelectedColumn] = useState(null);
  
  const generalSettings = useBoolean();
  const columnSettings = useBoolean();

  const handleColumnClick = (column) => {
    setSelectedColumn(column);
    columnSettings.onTrue();
  };

  const renderHeader = (
    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
      <Typography variant="h6" component="h2">
        עמודות מערכת
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {infoStudents.newData?.length || 0} עמודות
      </Typography>
    </Stack>
    );

  const renderListColumns = (
    <ColumnsList
      columns={infoStudents.newData}
      handleColumnClick={handleColumnClick}
    />
  );

  const notFound = (!infoStudents.newData || infoStudents.newData.length === 0) && (
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
        )


  const renderSettingsBtn = (
      <Fab
        color="primary"
        aria-label="הגדרות כלליות"
        onClick={generalSettings.onTrue}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000
        }}
      >
        <Iconify icon="solar:settings-bold" width={24} />
      </Fab>
  )
  const editDialog = (
        <ColumnVisibilityDialog
          open={columnSettings.value}
          onClose={columnSettings.onFalse}
          column={selectedColumn}
          infoColumns={infoStudents.newData}
          selectOptions={[]} // TODO: Add select options if needed
          onComplete={() => {
            // Refresh data after edit
          }}
        />
      )

  const settingsDialog = (
      <ColumnGeneralSettingsDialog
        open={generalSettings.value}
        onClose={generalSettings.onFalse}
        onComplete={() => {
        }}
      />
  )
  

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 2, m: 0 }} >
        {renderHeader}
        {renderListColumns}
        {notFound}
      </Paper>
      {renderSettingsBtn}
      {selectedColumn && editDialog}
      {settingsDialog}
    </Box>
  );
}

// ----------------------------------------------------------------------

const walktourSteps = [
  // TODO: Add walktour steps here
];

export function ColumnsMinimalViewWrapper({walktour: walktourProp}: {walktour?: React.ReactNode}) {
  const walktour = walktourProp || <Walktour {...useWalktour({steps: walktourSteps})} />
  return (
    <Suspense fallback={<LoadingScreen />}>
      <>
        <ColumnsMinimalListView />
        {walktour}
      </>
    </Suspense>
  );
}