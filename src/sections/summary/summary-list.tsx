import { Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { Box, Button, Checkbox, LinearProgress, linearProgressClasses, Rating, Typography } from "@mui/material";

import { paths } from "src/routes/paths";

import { exportToPDF } from "src/utils/export";

import { varAlpha } from "src/theme/styles/utils";
import { apiTemplates } from "src/actions/templates";
import { apiInfoColumns } from "src/actions/info_columns";
import { apiInfoStudents } from "src/actions/info_students";
import { progress } from "src/theme/core/components/progress";

import { Label } from "src/components/label";
import { LoadingScreen } from "src/components/loading-screen";
import { FullTableWrapper } from "src/components/full-table/view";
import { InfoStudent, TableConfig } from "src/components/full-table/types";

import { INFO_SUMMARY } from "./columns";




const LINKS = [
  { name: 'מסך-ראשי', href: paths.dashboard.root },
  { name: 'תבניות', href: paths.dashboard.templates },
  { name: 'רשימה' },
]

function columnsFormat(columns){
  return columns.map(column => ({
      "filters": "",
      "group_name": column,
      "hidden": Number(['student_id', 'primary', 'secondary'].includes(column)),
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
export const getDesc = (student: InfoStudent, desc: string[]): string => desc.map(e => student ? student[e] : '').join(' ')

export function descriptionColumns(getColumns: any[]): { primary: string[]; secondary: string[] } {
  const primary = getColumns.filter(e => e.group_name === 'primary').map(e => e.name)
  const secondary = getColumns.filter(e => e.group_name === 'secondary').map(e => e.name)
  return {
    primary,
    secondary
  }
}

function mergeSummaryData(infoStudents, summaryData, infoColumns) {
  // Implement your merging logic here
  const { primary, secondary } = descriptionColumns(infoColumns);
  const mergedData = summaryData.map(summary => {
    const student = infoStudents.find(item => item.student_id === summary.student_id);
    console.log('summary', summary);
    // delete summary.student_id;
    return {
      'primary': getDesc(student, primary),
      'secondary': getDesc(student, secondary),
      ...summary
    };
  });
  return {
    table: mergedData,
    columns: [...columnsFormat(Object.keys(mergedData[0] || {}))]
  };
}

function labelColor(num){
  if (num < 50) {
    return "error";
  } if (num < 80) {
    return "warning";
  }
  return "success";
}

function Format({children}){
  return (
    <Box sx={{ height: 2, borderRadius: 0 }}>
      <Label variant="soft" color={labelColor(Number(children))}>{Number(children)}%</Label>
    </Box>
  );
}

function BoolCell({ children: value }) {
  return (
    <Checkbox checked={Number(value) > 0} />
    
  );
}

export function TableMainView({ summaryData, formData }) {

  const info_students = useSuspenseQuery(apiInfoStudents())
  const infoColumns = useSuspenseQuery(apiInfoColumns())

  const { table, columns } = mergeSummaryData(info_students.data, summaryData, infoColumns.data);
  console.table(columns)
  console.table(table)

  // פונקציית הורדת PDF
  const handleExportPDF = () => {
    const title = `סיכום נוכחות - ${formData.type === 'details' ? 'מפורט' : formData.type === 'mean' ? 'ממוצע' : 'סיכום'}`;
    exportToPDF('pdf-table');
  };
  
  const tableColumnsConfig: TableConfig = {
    headingLinks: LINKS,
    headingTitle: 'סיכום נוכחות',
    importButton: false,
    specialRow: ['avatar', 'checkbox'],
    rowId: 'student_id',
    styleTable: 'default',
    pagination: true,
    addButton: false,
    isToolbar: true,
    Cell: formData.type === 'details' ? BoolCell : Format,
    onExportPDF: handleExportPDF,
    tableData: table,
    tableColumns: columns
  }
  console.table(columns)

  return (
  
  <FullTableWrapper config={tableColumnsConfig} />
  )
}
