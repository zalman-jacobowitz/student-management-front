import { Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { paths } from "src/routes/paths";

import { apiTemplates } from "src/actions/templates";
import { apiInfoStudents } from "src/actions/info_students";

import { LoadingScreen } from "src/components/loading-screen";
import { TableConfig } from "src/components/full-table/types";
import { FullTableWrapper } from "src/components/full-table/view";
import { INFO_SUMMARY } from "./columns";




const LINKS = [
  { name: 'מסך-ראשי', href: paths.dashboard.root },
  { name: 'תבניות', href: paths.dashboard.templates },
  { name: 'רשימה' },
]

function columnsFormat(columns){
  return columns.map(column => ({
      "filters": "",
      "group_name": "primary",
      "hidden": "",
        "label": column,
        "name": column,
        "required": "",
        "sorting": "0.0",
        "table_name": "templates",
        "type": "text"
      }
  )
)
}


function mergeSummaryData(infoStudents, summaryData) {
  // Implement your merging logic here
  const mergedData = summaryData.map(summary => {
    const student = infoStudents.find(item => item.student_id === summary.student_id);
    console.log('summary', summary);
    return {
      Name: student['Last Namee'],
      FirstName: student['First Name'],
      ...summary
    };
  });
  return {
    table: mergedData,
    columns: columnsFormat(Object.keys(mergedData[0] || {}))
  };
}

export function TableMainView({ summaryData }) {

  const info_students = useSuspenseQuery(apiInfoStudents())
  
  const {table, columns} = mergeSummaryData(info_students.data, summaryData);
  console.table(columns)
  console.table(table)
  
  const tableColumnsConfig: TableConfig = {
    headingLinks: LINKS,
    headingTitle: 'הגדרת תבניות',
    importButton: false,
    specialRow: ['checkbox'],
    rowId: 'template_id',
    styleTable: 'default',
    pagination: true,
    addButton: true,
    tableData: table,
    tableColumns: columns
  }
  console.table(columns)

  return (<FullTableWrapper config={tableColumnsConfig} /> )
}
