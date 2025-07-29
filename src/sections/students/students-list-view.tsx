import { Suspense, useCallback, useMemo } from "react";
import { useQueryClient, useSuspenseQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";

import { useUserDetails } from "src/hooks/use-user-details";

import { apiInfoStudents, infoStudentsUpdate } from "src/actions/info_students";
import { useInfoColumns } from "src/actions/columns_with_select";

import { LoadingScreen } from "src/components/loading-screen";
import { FullTableWrapper } from "src/components/full-table/view";
import { TableConfig } from "src/components/full-table/types";

import { uuidv4 } from "src/utils/uuidv4";

import { StudentsNewEditFormDialog } from "./student-new-edit-form";


const LINKS = [
  { name: 'מסך-ראשי', href: paths.dashboard.root },
  { name: 'נוכחות', href: paths.dashboard.insert },
  { name: 'רשימה' },
]




function StudentMainViewDynamic() {


  const infoColumns = useInfoColumns('info_students')
  const infoStudents = useSuspenseQuery(apiInfoStudents());
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutate = useMutation(infoStudentsUpdate({queryClient}))
  
  const submitDelete = useCallback(async (data: any[]) => {
    try {
      const promise = mutate.mutateAsync({data: data.map(item => ({student_id: item})), mode: 'delete'})

      toast.promise(promise, {
        loading: 'מחיקה...',
        success: 'המחיקה הצליחה!',
        error: 'המחיקה נכשלה!',
      });

      await promise;


    } catch (error) {
      console.error('Submission error:', error);
      toast.error('שגיאה בשליחת הטופס');
    }
  }, [mutate]);


  
  const listActionsMap = useMemo(() => [
    {
      icon: 'solar:settings-bold',
      label: 'הגדרות',
      onClick: () => {
        router.push(paths.dashboard.infoColumns);
      }
    },
    {
      icon: 'solar:export-bold',
      label: 'ייצוא',
      onClick: () => {
        // exportToExcel([], 'students_export.xlsx');
      }
    }
  ], [router])

  const userDetails = useUserDetails()

  const configStudents: TableConfig = useMemo(() => ({
    // Flattened heading properties
    headingLinks: LINKS,
    headingTitle: 'רשימת תלמידים',
    importButton: true,
    
    // Flattened toolbar properties
    listActionsMap,
    removeAction: true,
    onDelete: (selected) => {
      submitDelete(selected)
    },
    
    // Flattened data properties
    tableData: infoStudents.data,
    tableColumns: infoColumns.newData,
    
    // Flattened row properties
    specialRow: ['checkbox', 'avatar', 'edit'],
    rowId: 'student_id',
    EditComponent: (props) => {
      const { open, onClose, column } = props

      return (
        <StudentsNewEditFormDialog
          getColumns={infoColumns.newData}
          student={column}
          open={open}
          onClose={onClose}
          existingStudents={infoStudents.data || []}
          isEditing
      />
      )
    },
    
    // Flattened table properties
    styleTable: 'default',
    pagination: true,
    addButton: true,
    defaultValues: {
      student_id: uuidv4(),
      user_id: userDetails?.userDetails?.email || '',
      client: 'kg_gdola',
    }
  }), [infoColumns.newData, infoStudents.data, submitDelete, userDetails, listActionsMap])

  return (<FullTableWrapper config={configStudents} /> )
}


export function StudentsViewWrapper() {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <StudentMainViewDynamic/>
      </Suspense>
    );
  }