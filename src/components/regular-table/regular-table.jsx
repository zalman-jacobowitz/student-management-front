import { Table, TableBody } from "@mui/material";

import { ReglarTableHeader } from "./regular-table-head";

 export function RegularTable({ children, headLabels, tableData, table , themeTable='default', id='id'}) {
    return (
      <Table
      className="print-table"
   id="pdf-table" 
      size={!table.dense ? 'small' : 'medium'} sx={{
        minWidth: 960,
        borderCollapse: themeTable === 'default' ? 'collapse' : 'separate',
        borderSpacing: themeTable === 'default' ? '0 0' : '0 16px',
      '@media print': {
      '& .MuiTableCell-root': {
      fontSize: '12px',
      padding: '4px'
     }
     }
   }}>
        <ReglarTableHeader
            headLabels={headLabels}
            tableData={tableData}
            table={table}
            id={id}
          />
        <TableBody>
            {children}
        </TableBody>
    </Table>
    )
  }