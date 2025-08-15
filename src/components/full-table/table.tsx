/*
* needs: 
 * TYPE SAFETY ISSUES / בעיות TYPE SAFETY:
 * 1. No TypeScript interfaces for table configuration / אין ממשקי TypeScript לתצורת הטבלה
 * 2. Missing type definitions for table data arrays / אין הגדרות טיפוס למערכי נתוני הטבלה
 * 3. Untyped component props and function parameters / פרופס ופרמטרים לא מוגדרים
 * 4. Missing validation for dynamic student data access / אין ולידציה לגישה דינמית לנתוני תלמידים
 * 5. No type safety for callback functions / אין בטיחות טיפוסים לפונקציות callback
 */

import { useCallback } from "react";

import { Box, Button } from "@mui/material"

import { useBoolean } from "src/hooks/use-boolean";

import { Scrollbar } from "src/components/scrollbar";
import { RemoveAction } from "src/components/button-actions";
import { ConfirmDialog } from "src/components/custom-dialog";
import { RegularTable } from "src/components/regular-table/regular-table";
import { useTable, emptyRows, TableNoData, TableEmptyRows } from "src/components/table"
import { RegularTablePagination } from "src/components/regular-table/regular-table-pagination";
import { TableSelectedHeader } from "src/components/regular-table/regular-table-selected-header";

import { FullTableRow } from "./row";
import { Table, TableConfig } from "./types";
import useTableConfig from "./table-state";
import { getHeadLabels } from "./functions/head-labels";

type FullTableProviderProps = {
  children: React.ReactNode

  deleteData: ReturnType<typeof useBoolean>
  table: ReturnType<typeof useTable>
}


// MUI קומפוננטת הטבלה עצמה עם שימוש בטבלה של 
function FullTableProvider({ children, deleteData, table }: FullTableProviderProps) {
  // ייבוא נתוני הקונפיגורציה
  const {
    tableData,
    pagination,
    styleTable,
    removeAction,
    rowId,
    tableColumns
  } = useTableConfig()

  
  return (
    <Box sx={{ position: 'relative' }}>
      <TableSelectedHeader
        table={table}
        tableData={tableData}
        action={removeAction && <RemoveAction onClick={deleteData.onTrue} />}
        id={rowId}
      />
      <Scrollbar>
        <RegularTable headLabels={tableColumns} tableData={tableData} table={table} themeTable={styleTable} id={rowId}>
          {children}
        </RegularTable>
      </Scrollbar>
      {pagination && <RegularTablePagination table={table} tableData={tableData} />}
    </Box>
  )
}



function useFullTable(dataFiltered: Table){
  // קבלת הפרטים על הטבלה מהקונפיגורציה:
  const {
    tableData,
    pagination,
    onDelete
  } = useTableConfig()

  // סטייט למצב דיאלוג מחיקת נתוני תלמידים
  const deleteData = useBoolean(false)
  // הוק להצגה של הטבלה
  const table = useTable({ defaultRowsPerPage: 6, pagination });
  // כמות הרשומות פר עמוד
  const dataPage = pagination ? dataFiltered.slice(table.page * table.rowsPerPage, (table.page + 1) * table.rowsPerPage) : dataFiltered
  // מימוש פונקציית המחיקה של התלמידים בפועל
  const handleDelete = useCallback(() => {
    if (onDelete) {
      onDelete(table.selected)
    }
    deleteData.onFalse()
  }, [table.selected, onDelete, deleteData])

  return {
    table,
    dataPage,
    //
    deleteData,
    //
    handleDelete 
  }
}

type FullTableProps = {
  dataFiltered: Table
}

type RemoveActionDialogProps = {
  deleteData: ReturnType<typeof useBoolean>
  handleDelete: () => void
}


function RemoveActionDialog({ deleteData, handleDelete }: RemoveActionDialogProps) {

  return (
    <ConfirmDialog
        open={deleteData.value}
        onClose={deleteData.onFalse}
        action={<Button variant="contained" color="inherit" onClick={handleDelete} >אישור</Button>}
        title="מחיקת נתונים"
        content="האם אתה בטוח שברצונך למחוק את הנתונים?"
      />
  )
}


export function FullTable({ dataFiltered }: FullTableProps) {

  // קבלת הפרטים על הטבלה מהקונפיגורציה:
  const {
    // מזהה השורה הנוכחית
    rowId,
    // הטבלה עצמה
    tableData,
    // האם יש כפתור מחיקה
    removeAction
  } = useTableConfig()
  // קבלת הסטייטים הנדרשים לקומפוננטת הטבלה
  const {
    table,
    dataPage,
    deleteData,
    handleDelete
  } = useFullTable(dataFiltered)

  // רשימת הקומפוננטות של כל הרשומות לדף הנוכחי
  const rows = dataPage.map((student) => (
    <FullTableRow
      key={student[rowId]}
      student={student}
      selected={table.selected.includes(student[rowId])}
      onSelectRow={() => table.onSelectRow(student[rowId])}
    />
  ))


  return (
    <FullTableProvider
      table={table}
      deleteData={deleteData}
    >   
      {rows}
      <TableNoData notFound={!tableData.length} sx={{p: 2}} />
      {
      removeAction &&
        <RemoveActionDialog
          deleteData={deleteData}
          handleDelete={handleDelete}
        /> 
      }
    </FullTableProvider>
  )
}