import { Suspense } from "react";

import { paths } from "src/routes/paths";

import { useInfoColumns } from "src/actions/columns_with_select";

import { LoadingScreen } from "src/components/loading-screen";
import { TableConfig } from "src/components/full-table/types";
import { FullTableWrapper } from "src/components/full-table/view";

import { INFO_TABLE } from "src/utils/uinqe_usege/columns";

import { ColumnVisibilityDialog } from "./column-edit-steps";
import { ColumnsMinimalViewWrapper } from "./columns-minimal-list-view";


const LINKS = [
  { name: 'מסך-ראשי', href: paths.dashboard.root },
  { name: 'עמודות', href: paths.dashboard.insert },
  { name: 'רשימה' },
]

function ColumnsMainView() {
  const infoStudents = useInfoColumns('info_students')

    const tableColumnsConfig: TableConfig = {
    headingLinks: LINKS,
    headingTitle: 'הגדרת עמודות',
    importButton: false,
    specialRow: ['checkbox', 'avatar', 'edit'],
    rowId: 'name',
    EditComponent: ColumnVisibilityDialog,
    styleTable: 'default',
    pagination: false,
    addButton: true,
    tableData: infoStudents.newData,
    tableColumns: INFO_TABLE,
  }

  return (<FullTableWrapper config={tableColumnsConfig} /> )
}


export function ColumnsViewWrapper() {
  return <ColumnsMinimalViewWrapper />
  return (
    <Suspense fallback={<LoadingScreen />}>
      <ColumnsMainView/>
    </Suspense>
  );
}