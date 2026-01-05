import { Suspense, useMemo, useCallback } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { Card } from "@mui/material";

import { paths } from "src/routes/paths";

import { apiUsers } from "src/actions/users";

import { LoadingScreen } from "src/components/loading-screen";
import { ConfirmDialog } from "src/components/custom-dialog";
import { FullTableWrapper } from "src/components/full-table/view";
import { useWalktour, Walktour } from "src/components/walktour";

import { USERS_COLUMNS } from "src/utils/uinqe_usege/users-columns";
import { TableConfig } from "src/components/full-table/types";

import { UserPermissionsForm } from "./user-permissions-form";
import { UsersRowDetails } from "./users-details";

import { NewList } from "./new-list";


const LINKS = [
  { name: 'מסך-ראשי', href: paths.dashboard.root },
  { name: 'משתמשים', href: paths.dashboard.insert },
  { name: 'רשימה' },
]


function UserMainDynamicView() {
  const infoUsers = useSuspenseQuery(apiUsers());

    const tableColumnsConfig: TableConfig = {
      // Flattened heading properties
      headingLinks: LINKS,
      headingTitle: 'רשימת משתמשים',
      importButton: false,
      
      // Flattened data properties
      tableData: infoUsers.data || [],
      tableColumns: USERS_COLUMNS,
      
      // Flattened row properties
      specialRow: ['checkbox', 'avatar', 'edit'],
      rowId: 'user_id',
      DetailsComponent: (props) => {
        const { open, onClose, column } = props
        return (
          <UsersRowDetails
            student={column}
            open={open}
            onClose={onClose}
          />
        )
      },
      
      EditComponent: (props) => {
        const { open, onClose, column } = props

        return (
          <></>
        )
      },
      
      // Flattened table properties
      styleTable: 'default',
      pagination: true,
      addButton: true
    }
  
    return ( <FullTableWrapper config={tableColumnsConfig} /> )
  }



  const walktourSteps = [
    // TODO: Add walktour steps here
  ];

  
  /* ----------------------------
   | Public wrapper: <Suspense>  |
   ----------------------------*/
   export function UserViewWrapper() {
    const walktour = <Walktour {...useWalktour({steps: walktourSteps})} />
    return (
      <Suspense fallback={<LoadingScreen />}> {/* fallback until all queries resolve */}
        <>
          <NewList />
          {walktour}
        </>
      </Suspense>
    );
  }