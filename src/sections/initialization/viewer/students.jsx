import { Box, Card } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { ConfirmDialog } from "src/components/custom-dialog";
import useInitializationStore from "../initialization-state";
import { EmptyContent } from "src/components/empty-content";


function createDataGridColumns(columns) {
    return columns.map((col, index) => ({
        field: col,
        headerName: col,
        editable: false,
        headerAlign: 'center',
        align: 'center',
        id: index
    }));
}

export function StudentsViewer({
    open,
    onClose
}) {

    const store = useInitializationStore();
    const { studentsData, columnsList } = store;

    return (
        <ConfirmDialog
            animate
        maxWidth="md" maxHeight="xl" open={open} onClose={onClose}
            title="תצוגת תלמידים" actionText="סגור"
        content={
        
            <Card sx={{ p: 2 }}>
        {
            !studentsData || studentsData.length === 0 ? (
                <EmptyContent title="אין תלמידים להצגה"/>
            ) : null
        }
        { studentsData && studentsData.length > 0 &&
        
                <Box>
                  <DataGrid
                    rows={studentsData.map((row, index) => ({ id: index, ...row }))}
                    columns={createDataGridColumns(columnsList)}
                    density='standard'
                    slotProps={{
                      toolbar: {
                        showQuickFilter: true,
                        quickFilterProps: { debounceMs: 500 },
                    }
                    }}
                    pageSizeOptions={[10, 25, 32, 100]}
                    hideFooter
                    density='compact'
                    disableRowSelectionOnClick
                    
                  />
                  </Box>
              }
              </Card>
        }
        >

              </ConfirmDialog>

    )
}