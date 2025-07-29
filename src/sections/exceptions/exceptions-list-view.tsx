import { Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { paths } from "src/routes/paths";

import { apiExceptions } from "src/actions/exceptions";

import { LoadingScreen } from "src/components/loading-screen";
import { TableConfig } from "src/components/full-table/types";
import { FullTableWrapper } from "src/components/full-table/view";

import { ExceptionDialog } from "./exceptions-edit-steps";
import { INFO_EXCEPTIONS } from "./columns";

const LINKS = [
  { name: 'מסך-ראשי', href: paths.dashboard.root },
  { name: 'אישורים', href: paths.dashboard.exceptions },
  { name: 'רשימה' },
]


function exceptionsByReduce(exception) {
  console.log('exceptionR: ', exception)

  return Object.values(
    exception.reduce((acc, cur) => {
      const { exception_id, start, end, reason, student_id } = cur;
      if (!acc[exception_id]) {
        acc[exception_id] = { exception_id, start, end, reason, students: [] };
      }
      acc[exception_id].students.push(student_id);
      return acc;
    }, {})
  );
}
function ExceptionsMainView() {
    const api_exceptions = useSuspenseQuery(apiExceptions());

    const exceptions = exceptionsByReduce(api_exceptions.data);
    
    console.log('exceptions', exceptions);

    const tableColumnsConfig: TableConfig = {
      headingLinks: LINKS,
      headingTitle: 'ניהול אישורים',
      importButton: false,
      specialRow: ['checkbox', 'edit'],
      rowId: 'exception_id',
      EditComponent: ExceptionDialog,
      styleTable: 'default',
      pagination: true,
      addButton: true,
      tableData: exceptions,
      tableColumns: INFO_EXCEPTIONS,
  }
  console.log('tableColumnsConfig', tableColumnsConfig);

  return (<FullTableWrapper config={tableColumnsConfig} /> )
}

export function ExceptionsViewWrapper() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <ExceptionsMainView/>
    </Suspense>
  );
}