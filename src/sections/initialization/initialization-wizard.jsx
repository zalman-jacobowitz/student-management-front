import { z } from 'zod';
import { useMemo } from 'react';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';
import { StepsProvider } from 'src/components/steps-form';

import { CompletionStep } from './components/completion-step';
import { InitializationColumnsView } from './components/initialization-columns-view';
import { StudentFileUploadStep } from './components/student-file-upload-step';
import { TemplateDefinitionStep } from './components/template-definition-step';
import { ColumnSelectionStep } from './components/column-selection-step';
import useInitializationStore from './initialization-state';

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
  template_id: z.string().optional(),
  template_name: z.string().min(1, 'שם תבנית נדרש').optional(),
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
  duplicateCo
  lumns: z.array(z.string()).min(1, "יש לבחור לפחות עמודה אחת למציאת כפילויות"),
}).optional();

// Combined wizard schema
const InitializationWizardSchema = z.object({
  studentFile: ImportFileSchema.optional(),
  templateData: TemplateSchema.optional(),
  columnSelection: ColumnSelectionSchema.optional(),
  // Column configuration step doesn't need schema - it's just a display
}).optional();

// ----------------------------------------------------------------------

export function InitializationWizard() {
  const router = useRouter();

  const defaultValues = useMemo(() => ({
    studentFile: null,
    templateData: {
      template_name: '',
      events: []
    },
    columnSelection: {
      nameColumn: "",
      familyColumn: "",
      accessibleColumn: "",
      filterColumns: [],
      duplicateColumns: [],
    }
  }), []);

  const steps = useMemo(() => [
    {
      name: 'studentUpload',
      label: 'העלאת תלמידים',
      icon: "solar:users-group-rounded-bold-duotone",
      component: <StudentFileUploadStep />,
      alertHelper: 'העלה קובץ Excel או CSV עם פרטי התלמידים'
    },
    {
      name: 'templates',
      label: 'הגדרת תבניות',
      icon: "solar:clipboard-list-bold-duotone",
      component: <TemplateDefinitionStep />,
    },
    {
      name: 'columnSelection',
      label: 'בחירת עמודות',
      icon: "solar:list-check-bold-duotone",
      component: <ColumnSelectionStep />,
      alertHelper: 'בחר את העמודות הנדרשות לניהול התלמידים'
    },
    {
      name: 'columns',
      label: 'הגדרת עמודות',
      icon: "solar:settings-bold-duotone",
      component: <InitializationColumnsView />,
      alertHelper: 'ערוך את הגדרות העמודות לפי הצורך'
    },
    {
      name: 'complete',
      label: 'השלמת איתחול',
      icon: "solar:check-circle-bold-duotone",
      component: <CompletionStep />,
    }
  ], []);
  const store = useInitializationStore()
  const handleSubmit = async (data) => {
    alert(JSON.stringify(data))
    try {
      console.log('Initialization data:', data);
      console.log('useInitializationStore:', store.columnsList)
      // Here you would typically save the data to your backend
      // For now, we'll just simulate success
      
      // Navigate to dashboard after successful initialization
      setTimeout(() => {
        router.push('/ניהול/רשימה');
      }, 2000);
      
      return true;
    } catch (error) {
      console.error('Initialization failed:', error);
      return false;
    }
  };

  return (
    <StepsProvider
      steps={steps}
      defaultValues={defaultValues}
      WizardSchema={InitializationWizardSchema}
      onSubmit={handleSubmit}
    />
  );
}