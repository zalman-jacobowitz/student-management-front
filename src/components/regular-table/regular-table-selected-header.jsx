import { TableSelectedAction } from "src/components/table";

export function TableSelectedHeader({ table, tableData, id, ...other }) {
    return (
      <TableSelectedAction
          dense={!table.dense}
          numSelected={table.selected.length}
          rowCount={tableData.length}
          onSelectAllRows={(checked) =>
          table.onSelectAllRows(
            checked,
            tableData.map((row) => row[id] || row.student_id)
          )
          }
          {...other}
        />
    )
  }
  