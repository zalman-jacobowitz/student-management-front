import { Box, Button, Card, CardActions, CardContent, CardHeader } from "@mui/material";
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
    handleRemoveFile,
    title='',
    open,
    onClose
}) {

    const store = useInitializationStore();
    const { studentsData, columnsList } = store;

    if (!open) return null;
    if (!studentsData || studentsData.length === 0) return <EmptyContent title="אין תלמידים להצגה"/>;

    return (
        <>
        
            <Card sx={{ p: 2 }}> 
                <CardHeader title={title} />   
                <CardContent>
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
                </CardContent>
                <CardActions>
                    <Button onClick={() => handleRemoveFile()}>חזור</Button>
                </CardActions>
              </Card>        
        </>
    )
}