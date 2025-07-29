import { TablePaginationCustom } from "src/components/table";

  export function RegularTablePagination({ table, tableData }) {
    return (
      <TablePaginationCustom
        page={table.page}
        dense={table.dense}
        count={tableData.length}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onChangeDense={table.onChangeDense}
        onRowsPerPageChange={table.onChangeRowsPerPage}
    />
    )
  }