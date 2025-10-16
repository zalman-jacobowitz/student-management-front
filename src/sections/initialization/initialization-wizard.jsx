import { z } from 'zod';
import { toast } from 'sonner';
import { useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useRouter } from 'src/routes/hooks';

// eslint-disable-next-line import/extensions
import { shortId, uuidv4 } from 'src/utils/uuidv4.js';

import { initUpdate } from 'src/actions/init.ts';

import { StepsProvider } from 'src/components/steps-form';

import { CompletionStep } from './components/completion-step.jsx';
import useInitializationStore from './initialization-state.ts';
import { ColumnSelectionStep } from './components/column-selection-step.jsx';
import { StudentFileUploadStep } from './components/student-file-upload-step.jsx';
import { TemplateDefinitionStep } from './components/template-definition-step.jsx';
import { InitializationColumnsView } from './components/initialization-columns-view.jsx';





// ----------------------------------------------------------------------

// Schemas for each step
const ImportFileSchema = z.object({
  file: z
    .instanceof(File, { message: 'חובה לבחור קובץ' })
    .refine((file) => file.size > 0, { message: 'הקובץ ריק' })
    .refine((file) => {
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv'
      ];
      return allowedTypes.includes(file.type);
    }, { message: 'רק קבצי Excel או CSV מותרים' })
});

const TemplateSchema = z.object({
  events: z.array(z.object({
    event_name: z.string().min(1, 'שם אירוע נדרש'),
    event_start: z.string(),
    event_end: z.string()
  })).optional(),
});

const ColumnSelectionSchema = z.object({
  nameColumn: z.string().min(1, "יש לבחור עמודת שם"),
  familyColumn: z.string().min(1, "יש לבחור עמודת משפחה"),
  accessibleColumn: z.string().min(1, "יש לבחור עמודה נגישה"),
  filterColumns: z.array(z.string()).max(2, "ניתן לבחור עד 2 עמודות לפילטרים נגישים").min(1, "יש לבחור לפחות עמודה אחת"),
  duplicateColumns: z.array(z.string()).min(1, "יש לבחור לפחות עמודה אחת למציאת כפילויות"),
}).optional();

// Combined wizard schema
const InitializationWizardSchema = z.object({
  studentFile: ImportFileSchema.optional(),
  templateData: TemplateSchema.optional(),
  columnSelection: ColumnSelectionSchema.optional(),
  // Column configuration step doesn't need schema - it's just a display
}).optional();

// ----------------------------------------------------------------------

function formatStudents(table){
  const with_ids = table.map(item => ({...item, student_id: shortId()}));
  
  return with_ids;
}

function formatTemplates(table){

  const template_id = uuidv4();

  const formattedTable = table.map((item, index) => ({
    event_id: index + 1,
    event_name: item.event_name,
    event_start: item.event_start,
    event_end: item.event_end,
    template_name: 'רגיל',
    template_id
  }));

  return formattedTable
}

// --------------------------------------------------------------------
/*
type InitForm = {
  studentFile: File | null;
  templateData: {
    events: Array<{
      event_name: string;
      event_start: string;
      event_end: string;
    }>;
  };
  columnSelection: {
    nameColumn: string;
    familyColumn: string;
    accessibleColumn: string;
    filterColumns: string[];
    duplicateColumns: string[];
  };
};
git config user.name "Your Name"
git config user.email "zalmanjacob@gmail.com"

*/

export function InitializationWizard() {

  // ראוטר לצורך הפניה למסך התלמידים לאחר העידכון
  const router = useRouter();

  const defaultValues = useMemo(() => ({
    // הנתונים של התלמידים מהקובץ שהועלה
    studentFile: null,
    // רשימה של הסדרים וזמניהם
    templateData: {
      events: []
    },
    // הגדרת סוג העמודות אם הוא ייחודי
    columnSelection: {
      // עמודה המייצגת את השם הפרטי
      nameColumn: "",
      // עמודה המייצגת את שם המשפחה
      familyColumn: "",
      // עמודה נגישה
      accessibleColumn: "",
      // עמודות לצורך סינון הנתונים
      filterColumns: [],
      // עמודות לצורך מציאת כפילויות
      duplicateColumns: [],
    }
  }), []);

  const steps = useMemo(() => [
    {
      // שלב העלאת קובץ התלמידים
      name: 'studentUpload',
      label: 'העלאת תלמידים',
      maxWidth: 'lg',
      icon: "solar:users-group-rounded-bold-duotone",
      component: <StudentFileUploadStep />,
      alertHelper: 'העלה קובץ Excel או CSV עם פרטי התלמידים'
    },
    {
      // שלב הגדרת הסדרים
      name: 'templates',
      label: 'הגדרת תבניות',
      icon: "solar:clipboard-list-bold-duotone",
      component: <TemplateDefinitionStep />,
    },
    {
      // הגדרה של עמודות השם משפחה כפיליות ועוד
      name: 'columnSelection',
      label: 'בחירת עמודות',
      icon: "solar:list-check-bold-duotone",
      component: <ColumnSelectionStep />,
      alertHelper: 'בחר את העמודות הנדרשות לניהול התלמידים'
    },
    {
      // הגדרת העמודות עצמם
      name: 'columns',
      label: 'הגדרת עמודות',
      icon: "solar:settings-bold-duotone",
      component: <InitializationColumnsView />,
      alertHelper: 'ערוך את הגדרות העמודות לפי הצורך'
    },
    {
      // הודעת סיום במקרה של הצלחה
      name: 'complete',
      label: 'השלמת איתחול',
      icon: "solar:check-circle-bold-duotone",
      component: <CompletionStep />,
    }
  ], []);

  // סטייט של האיתחול: לשמירה של הנתונים על התלמידים העמודות וכיוב 
  // בפורמט המתאים לשרת - גם בשלבי העריכה של הטופס
  const store = useInitializationStore()

  // הפונקצייה לשליחת הנתונים לאיתחול המערכת
  const queryClient = useQueryClient();
  
  const mutate = useMutation(initUpdate({queryClient}))

  const handleSubmit = async (data) => {
    try {
      
      const newFormattedColumns = store.updateColumnsDetails(data.columnSelection);
      const formatInfoStudents = store.columnsList

      const formattedTables = {
          info_students: formatStudents(store.studentsData),
          info_columns: newFormattedColumns,
          templates: formatTemplates(data.templateData.events)
        }
      console.log('Formatted Tables:', formattedTables);
      
      const promise =   mutate.mutateAsync({data: formattedTables, mode: 'update'});

      toast.promise(promise, {
          loading: 'מאתחל את המערכת...',
          success: 'העדכון הצליח!',
          error: 'העדכון נכשל!',
        });
  
        await promise;

      queryClient.cancelQueries();
      setTimeout(() => {
        router.push('/ניהול/רשימה');
      }, 2000);
      
      return false;
    } catch (error) {
      console.error('Initialization failed:', error);
      toast.error('שגיאה בשליחת הטופס');
      return false;
    }
  };

  // החזרה של הטופס איתחול
  return (
    <StepsProvider
      steps={steps}
      defaultValues={defaultValues}
      WizardSchema={InitializationWizardSchema}
      onSubmit={handleSubmit}
    />
  );
}