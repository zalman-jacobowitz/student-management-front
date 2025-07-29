import { Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Box } from "@mui/material";

import { paths } from "src/routes/paths";

import { apiSummary } from "src/actions/summary";

import { LoadingScreen } from "src/components/loading-screen";
import { FullTableWrapper } from "src/components/full-table/view";
import { TableConfig } from "src/components/full-table/types";
import { LabelSummary } from "src/components/display";

import { SUMMARY_COLUMNS } from "src/utils/uinqe_usege/summary-columns";

const LINKS = [
  { name: 'מסך-ראשי', href: paths.dashboard.root },
  { name: 'סיכום', href: paths.dashboard.summary },
  { name: 'רשימה' },
];

const LABEL_SUMMARY = [
  {
    label: 'שמות',
    color: 'primary',
    icon: 'solar:user-bold',
    sum: (data: any[]) => data.filter(item => item.first_name).length
  },
  {
    label: 'משפחות',
    color: 'secondary', 
    icon: 'solar:users-group-two-rounded-bold',
    sum: (data: any[]) => data.filter(item => item.last_name).length
  },
  {
    label: 'סה"כ',
    color: 'default',
    icon: 'solar:list-bold',
    sum: (data: any[]) => data.length
  }
];

function SummaryMainView() {
  const summaryData = {data:[
  { id: 1, first_name: 'יוסי', last_name: 'כהן' },
  { id: 2, first_name: 'שרה', last_name: 'לוי' }
]}; // useSuspenseQuery(apiSummary());


  const tableConfig: TableConfig = {
    headingLinks: LINKS,
    headingTitle: 'סיכום נתונים',
    importButton: false,
    specialRow: [],
    rowId: 'id',
    styleTable: 'default',
    pagination: true,
    addButton: false,
    tableData: summaryData.data,
    tableColumns: SUMMARY_COLUMNS,
  };

  return (
    <Box>
      <FullTableWrapper config={tableConfig} />
    </Box>
  );
}

export function SummaryViewWrapper() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <SummaryMainView />
    </Suspense>
  );
}