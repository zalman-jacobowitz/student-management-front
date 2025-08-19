
import React from 'react';
import { Box, Card, IconButton, TableCell, TextField } from '@mui/material';

import { useTable } from 'src/components/table';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { RegularTable } from 'src/components/regular-table/regular-table';
import { RegularRowProvider } from 'src/components/regular-table/regular-row-provider';

function convertTableToObjects(data) {
    const headers = data.headers;
    const rows = data.rows;
    
    return rows.map((row, index) => {
        const obj = { id: index };
        headers.forEach((header, colIndex) => {
            obj[header] = row[colIndex];
        });
        return obj;
    });
}

function UploadTableRow({ 
    row, 
    headers, 
    fileIndex, 
    tableIndex, 
    rowIndex, 
    handleTableCellChange,
    selected,
    onSelectRow 
}) {
    // קומפוננטות עמודות מיוחדות (ריקות כי אנחנו לא צריכים checkbox וכו')
    const columns = [];

    return (
        <RegularRowProvider 
            selected={selected} 
            columns={columns}
            style="default"
        >
            {headers.map((header, colIndex) => (
                <TableCell 
                    key={colIndex}
                    sx={{ textAlign: 'right', p: 1 }}
                >
                    <TextField
                        size="small"
                        fullWidth
                        value={row[colIndex] || ''}
                        onChange={(e) =>
                            handleTableCellChange(
                                fileIndex,
                                tableIndex,
                                rowIndex,
                                colIndex,
                                e.target.value
                            )
                        }
                        sx={{
                            '& .MuiInputBase-root': {
                                backgroundColor: 'background.paper',
                                fontSize: '0.875rem'
                            }
                        }}
                    />
                </TableCell>
            ))}
        </RegularRowProvider>
    );
}

export function UploadTableView({ 
    tableIndex,
    handleRemoveTable,
    table,
    fileIndex,
    handleTableCellChange
}) {
    const tableData = convertTableToObjects(table);
    
    // יצירת head labels בהתאם לפורמט הנדרש
    const headLabels = table.headers.map(header => ({
        id: header,
        label: header,
        width: header === 'שם' ? 100 : 'auto'
    }));

    // יצירת table instance לפונקציונליות הטבלה
    const tableInstance = useTable({
        defaultRowsPerPage: 10,
        defaultSelected: []
    });

    return (
        <>
            <IconButton
                onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveTable(fileIndex, tableIndex);
                }}
                sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    bgcolor: 'error.main',
                    color: 'common.white',
                    '&:hover': {
                        bgcolor: 'error.dark'
                    }
                }}
                size="small"
            >
                <Iconify icon="solar:trash-bin-minimalistic-bold" />
            </IconButton>
        <Card
            key={tableIndex}
            onClick={() => console.log('Table clicked', tableData)}
            sx={{
                mb: 4,
                p: 2,
                position: 'relative'
            }}
        >
            <Box sx={{ mt: 2, position: 'relative' }}>
                <Scrollbar>
                    <RegularTable 
                        headLabels={headLabels}
                        tableData={tableData}
                        table={tableInstance}
                        themeTable="default"
                        id="id"
                    >
                        {table.rows.map((row, rowIndex) => (
                            <UploadTableRow
                                key={rowIndex}
                                row={row}
                                headers={table.headers}
                                fileIndex={fileIndex}
                                tableIndex={tableIndex}
                                rowIndex={rowIndex}
                                handleTableCellChange={handleTableCellChange}
                                selected={tableInstance.selected.includes(rowIndex)}
                                onSelectRow={() => tableInstance.onSelectRow(rowIndex)}
                            />
                        ))}
                    </RegularTable>
                </Scrollbar>
            </Box>
        </Card>
        </>
    );
}
