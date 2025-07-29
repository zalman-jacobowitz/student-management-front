
import { Suspense } from "react";

import { paths } from "src/routes/paths";

import { useInfoColumns } from "src/actions/columns_with_select";
import { DashboardContent } from "src/layouts/dashboard";
import { LoadingScreen } from "src/components/loading-screen";
import { PageLinksHeader } from "src/components/layout/header-links";
import { ExportScreen } from "../export_screen";



const LINKS = [
  { name: 'מסך-ראשי', href: paths.dashboard.root },
  { name: 'נוכחות', href: paths.dashboard.insert },
  { name: 'רשימה' },
]


function StudentMainView() {
  const infoColumns = useInfoColumns('info_students');
  console.log(infoColumns)
  return (
    <DashboardContent>
      
      <PageLinksHeader links={LINKS} heading="ייצוא"/>
      <ExportScreen columnsList={infoColumns.newData}/>
    </DashboardContent>
  )
}




export function ExportViewWrapper() {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <StudentMainView/>
      </Suspense>
    );
  }