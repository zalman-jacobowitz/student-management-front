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


// רשימת הלינקים לדף זה לצורך נגישות
const LINKS = [
  { name: 'מסך-ראשי', href: paths.dashboard.root },
  { name: 'נוכחות', href: paths.dashboard.insert },
  { name: 'רשימה' },
]


function StudentMainViewDynamic() {
  // המידע על העמודות
  const infoColumns = useInfoColumns('info_students')
  console.table(infoColumns.newData)
  // קריאה לנתונים של התלמידים עצמם
  const infoStudents = useSuspenseQuery(apiInfoStudents());
  // יבוא האפשרות לנווט בין דפים לצורך מעבר למסך העמודות
  const router = useRouter();
  // סטייט להכלה של השאילתה של העידכון והקריאה
  const queryClient = useQueryClient();
  // פונקציית העידכון של הנתונים על התלמידים
  const mutate = useMutation(infoStudentsUpdate({queryClient}))
  // פונקציית המחיקה של התלמידים
  const submitDelete = useCallback(async (data: any[]) => {
    try {
      // מימוש פונקציית העידכון עם המזהי תלמידים הדורשים מחיקה
      const promise = mutate.mutateAsync({data: data.map(item => ({student_id: item})), mode: 'delete'})
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


  // הפעולות המופיעות בצד הסרגל
  const listActionsMap = useMemo(() => [
    // הפנייה למסך העמודות
    {
      icon: 'solar:settings-bold',
      label: 'הגדרות',
      onClick: () => {
        router.push(paths.dashboard.infoColumns);
      }
    },
    // ייצוא הטבלה של התלמידים
    {
      icon: 'solar:export-bold',
      label: 'ייצוא',
      onClick: () => {
        // exportToExcel([], 'students_export.xlsx');
      }
    }
  ], [router])
  // הנתונים על המשתמש - לא ברור למה
  const userDetails = useUserDetails()
  // הקונפיגורציה נדרשת לטבלה על תלמידים
  const configStudents: TableConfig = useMemo(() => ({
    // רשימת הלינקים המופיעה תחת הכותרת
    headingLinks: LINKS,
    // הצגה של הכותרת של הדף
    headingTitle: 'רשימת תלמידים',
    // מאפשר לייבא נתונים מטבלה חיצונית
    importButton: true,
    // רשימת הפעולות בראש הטבלה
    listActionsMap,
    // מחיקת תלמידים מרובה:
    removeAction: true,
    // פונקציית המחיקה
    onDelete: (selected) => {
      submitDelete(selected)
    },

    // הטבלה עצמה:
    tableData: infoStudents.data,
    // הנתונים על העמודות של הטבלה
    tableColumns: infoColumns.newData,
    
    // התאים היחודיים בכל שורה: תצוגת אדם, אפשרות עריכה, ובחירה.
    specialRow: ['checkbox', 'avatar', 'edit'],
    // העמודה שהיא מזהה רשומה:
    rowId: 'student_id',
    // הקומפוננטה שתוצג בעת אפשרות של עריכת רשומה
    EditComponent: (props) => {
      // אפשרות פתיחה של הדיאלוג לעריכה, והנתונים עצמם של הרשומה
      const { open, onClose, column } = props
      // הקומפוננטה עצמה: מקבלת את המידע על העמודות, ואת הנתונים עצמם, ואת הרשומה שנבחרה
      // והאם מדובר במצב עריכה או הוספה
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
    
    // סגנון עיצוב הטבלה: פשוט או לבן
    styleTable: 'default',
    // אפשרות של דפדפוף
    pagination: true,
    // כפתור הוספה של רשומה
    addButton: true,
    // ערכים ברירת מחדל לטופס: לא נצרך
    defaultValues: {
      student_id: uuidv4(),
      user_id: userDetails?.userDetails?.email || '',
      client: 'kg_gdola',
    }
    // רשימה של התלויות לטבלה הזו
  }), [infoColumns.newData, infoStudents.data, submitDelete, userDetails, listActionsMap])
  
  // קומפוננטת הטבלה עצמה
  return (<FullTableWrapper config={configStudents} /> )
}


export function StudentsViewWrapper() {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <StudentMainViewDynamic/>
      </Suspense>
    );
  }