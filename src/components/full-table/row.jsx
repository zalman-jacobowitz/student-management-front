/*
 * TYPE SAFETY ISSUES / בעיות TYPE SAFETY:
 * 1. No TypeScript interfaces for component props / אין ממשקי TypeScript לפרופס הקומפוננטה
 * 2. Missing type definitions for student data structure / אין הגדרות טיפוס למבנה נתוני התלמיד
 * 3. Untyped config object with any nested properties / אובייקט config לא מוגדר עם מאפיינים מקוננים
 * 4. Missing type safety for dynamic component rendering / חסר בטיחות טיפוסים לרנדור דינמי של קומפוננטות
 * 5. No validation for array operations on infoColumns / אין ולידציה לפעולות מערך על infoColumns
 */

import { TableCell } from "@mui/material";

import { useBoolean } from "src/hooks/use-boolean";

import { CellAvatar } from "src/components/regular-table/regular-cell-avatar";
import { CellAction } from "src/components/regular-table/regular-cell-action";
import { CellCheckbox } from "src/components/regular-table/regular-cell-checkbox";
import { RegularRowProvider } from "src/components/regular-table/regular-row-provider";

import { description } from "src/sections/insert/functions";
import useTableConfig from "./table-state";



function useMultiTableRow() {
  const { tableColumns } = useTableConfig()
  const columnsShow = tableColumns.filter(col => !col.hidden)
  const quickEdit = useBoolean();
  const detailsDialog = useBoolean();

  return {
    columnsShow,
    quickEdit,
    detailsDialog
  }     
}

export function FullTableRow({
  
  student,
  selected,
  onSelectRow
}) {
  const { columnsShow, quickEdit, detailsDialog } = useMultiTableRow()

  const {
    specialRow,
    styleTable,
    tableColumns,
    EditComponent,
    DetailsComponent,
    rowId
  } = useTableConfig()
  
  const columns = [
    {
      name: 'checkbox',
      before: true, 
      props: {
        checked: selected,
        onClick: onSelectRow,
        id: student[rowId]
      },
      component: CellCheckbox
    },
    {
      name: 'avatar',
      before: true,
      props: {...description(tableColumns, student)},
      component: CellAvatar
    },
    {
      name: 'edit',
      props: {
        icon: "solar:pen-bold-duotone",
        onClick: quickEdit.onTrue,
        tooltip: "עריכה מהירה"
      },
      component: CellAction
    }
  ].filter(col => specialRow.includes(col.name))
  
    return (
    <RegularRowProvider selected={selected} columns={columns} style={styleTable}>
        {columnsShow.map((column) => (
        <TableCell key={column.name} onClick={()=>DetailsComponent ? detailsDialog.onTrue() : quickEdit.onTrue()} >{student[column.name]}</TableCell>
      )
      )}

       {EditComponent && (
        <EditComponent
          open={quickEdit.value}
          onClose={quickEdit.onFalse}
          column={student}
        />
      )}
      { DetailsComponent && (
      <DetailsComponent
        open={detailsDialog.value}
        onClose={detailsDialog.onFalse}
        column={student}
      />
      )}
    </RegularRowProvider>
  )

}