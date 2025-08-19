import { TableHeadCustom } from "src/components/table";


export function ReglarTableHeader({ table, tableData, headLabels, id }) {
  console.log({headLabels})
  return (
    <TableHeadCustom
        order={table.order}
        orderBy={table.orderBy}
        headLabel={headLabels}
        rowCount={tableData.length}
        numSelected={table.selected.length}
            onSort={table.onSort}
            onSelectAllRows={(checked) =>
            table.onSelectAllRows(
                checked,
                tableData.map((row) => row[id] || row.student_id)
            )
            }
      />
  );
}
