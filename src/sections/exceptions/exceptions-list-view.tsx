import { Suspense, useCallback } from "react";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import { paths } from "src/routes/paths";

import { apiExceptions, exceptionsUpdate } from "src/actions/exceptions";

import { LoadingScreen } from "src/components/loading-screen";
import { TableConfig } from "src/components/full-table/types";
import { FullTableWrapper } from "src/components/full-table/view";

import { ExceptionDialog } from "./exceptions-edit-steps";
import { INFO_EXCEPTIONS } from "./columns";

import { ExceptionsCall } from "./componnents";
import { useExceptions } from "./hooks";

const LINKS = [
  { name: 'מסך-ראשי', href: paths.dashboard.root },
  { name: 'אישורים', href: paths.dashboard.exceptions },
  { name: 'רשימה' },
]


  function ExceptionsMainView() {

    const {
      submitDelete,
      exceptions
    } = useExceptions()

    const tableColumnsConfig: TableConfig = {
      headingLinks: LINKS,
      headingTitle: 'ניהול אישורים',
      importButton: false,
      specialRow: ['checkbox'],
      rowId: 'exception_id',
      EditComponent: ExceptionDialog,
      removeAction: true,
      onDelete: (selected) => {
        submitDelete(selected)
      },
      styleTable: 'default',
      pagination: true,
      addButton: true,
      Cell: ExceptionsCall,
      tableData: exceptions,
      tableColumns: INFO_EXCEPTIONS
    }
    console.log('tableColumnsConfig', tableColumnsConfig);

    return (<FullTableWrapper config={tableColumnsConfig} />)
  }

  export function ExceptionsViewWrapper() {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <ExceptionsMainView />
      </Suspense>
    );
  }