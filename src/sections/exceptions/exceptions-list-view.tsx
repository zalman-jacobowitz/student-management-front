import { Suspense, useCallback } from "react";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import { paths } from "src/routes/paths";

import { apiExceptions, exceptionsUpdate } from "src/actions/exceptions";

import { LoadingScreen } from "src/components/loading-screen";
import { TableConfig } from "src/components/full-table/types";
import { FullTableWrapper } from "src/components/full-table/view";

import { ExceptionDialog } from "./exceptions-edit-steps";
import { INFO_EXCEPTIONS } from "./columns";
import { apiInfoStudents } from "src/actions/info_students";
import { descriptionColumns, getDesc } from "../insert/functions";
import { apiInfoColumns } from "src/actions/info_columns";
import { Avatar, Box, Chip } from "@mui/material";
import { Iconify } from "src/components/iconify";
import { inHebrew } from "src/utils/hebrew/getter";
import { toast } from "sonner";

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
      acc[exception_id].students.push({ student_id, primary: cur.primary, secondary: cur.secondary });
      return acc;
    }, {})
  );
}

function mergeWithStudents(infoStudents, summaryData, infoColumns) {
    // Implement your merging logic here
    const { primary, secondary } = descriptionColumns(infoColumns);
    const mergedData = summaryData.map(summary => {
        const student = infoStudents.find(item => item.student_id === summary.student_id);
        return {
            primary: getDesc(student, primary),
            secondary: getDesc(student, secondary),
            ...summary
        }
    });
    return mergedData
}

function MultiPeople({row, column, children}){
  console.log('column: ', column)
  if (column === 'students'){
    console.log(row.students)
    return <Box padding={.1} >
      {row.students.map(student => <Chip
      variant="soft"
      
      size="small"
      avatar={<Avatar />}
      color="success"
        label={student.primary}/>
      )}</Box>
  }
  if (['start', 'end'].includes(column)){
    const format = new Date(row[column]).toISOString().slice(0, 10)
    return <span>{inHebrew(format, 'Dms')}</span>
  }
  return (
    <>{children}</>
  )
}

function ExceptionsMainView() {
    // מידע על תלמידים לצורך ההצגה של השמות בטבלה
    const infoStudents = useSuspenseQuery(apiInfoStudents());

    // בקשה של האישורים של התלמידים
    const api_exceptions = useSuspenseQuery(apiExceptions());

    // מידע על העמודות לצורך הצגה של השמות בטבלה
    const infoColumns = useSuspenseQuery(apiInfoColumns())

    // מיזוג המידע של האישורים עם שמות התלמידים
    const exceptionWithStudent = mergeWithStudents(infoStudents.data, api_exceptions.data, infoColumns.data);
    
    // ארגון מחדש של האישורים לפי תלמידים
    const exceptions = exceptionsByReduce(exceptionWithStudent);
  
    const queryClient = useQueryClient();

      // פונקציית העידכון של הנתונים על התלמידים
      const mutate = useMutation(exceptionsUpdate({queryClient}))
      // פונקציית המחיקה של התלמידים
      const submitDelete = useCallback(async (data: any[]) => {
        try {
          console.log('to delete: ', data)
          // מימוש פונקציית העידכון עם המזהי תלמידים הדורשים מחיקה
          const promise = mutate.mutateAsync({data: data, mode: 'delete'})
          
          // הצגה של הודעה על מצב המחיקה
          toast.promise(promise, {
            loading: 'מחיקה...',
            success: 'המחיקה הצליחה!',
            error: 'המחיקה נכשלה!',
          });
          // המתנה לסיום פעולת המחיקה
          await promise;
        } catch (error) {
          console.error('Submission error:', error);
          // הצגה של הודעת שגיאה במקרה שהמחיקה נכשלה
          toast.error('שגיאה בשליחת הטופס');
        }
      }, [mutate]);
    


    const tableColumnsConfig: TableConfig = {
      headingLinks: LINKS,
      headingTitle: 'ניהול אישורים',
      importButton: false,
      specialRow: ['checkbox', 'edit'],
      rowId: 'exception_id',
      EditComponent: ExceptionDialog,
          // מחיקת תלמידים מרובה:
    removeAction: true,
    // פונקציית המחיקה
    onDelete: (selected) => {
      submitDelete(selected)
    },
      styleTable: 'default',
      pagination: true,
      addButton: true,
      Cell: MultiPeople,
      tableData: exceptions,
      tableColumns: INFO_EXCEPTIONS
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