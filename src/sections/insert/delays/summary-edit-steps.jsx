import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, MenuItem, Typography } from '@mui/material';
import { Field } from 'src/components/hook-form';
import { StepsProvider } from 'src/components/steps-form/steps-provider';
import { MasterStep } from 'src/components/steps-form/dynamiv-component';
import { toast } from 'sonner';
import { useSuspenseQuery } from '@tanstack/react-query';
import { apiListEvents } from 'src/actions/list_of_events';
import useInsertStore from '../insert-state';

// סכימה ל-validation
const SummaryFormSchema = z.object({
  templateType: z.string().min(1, 'יש לבחור תבנית או התאמה אישית'),
  events: z.array(z.string()).min(1, 'יש לבחור לפחות אירוע אחד'),
  start: z.string().min(1, 'תאריך התחלה נדרש'),
  end: z.string().min(1, 'תאריך סיום נדרש'),
  group_by: z.string().min(1, 'יש לבחור קבוצה אחת'),
  type: z.string().min(1, 'יש לבחור סוג'),
  days: z.array(z.string()).min(1, 'יש לבחור לפחות יום אחד'),
});

// ערכים ברירת המחדל
const DEFAULT_VALUES = {
  templateType: 'custom',
  events: ['1', '2'],
  start: '2025-11-01',
  end: '2025-11-30',
  group_by: 'day',
  type: 'mean',
  days: [
    '2025-11-01',
    '2025-11-02',
    '2025-11-03',
    '2025-11-04',
    '2025-11-05',
    '2025-11-06',
    '2025-11-07',
    '2025-11-08',
    '2025-11-09',
    '2025-11-10',
    '2025-11-11',
    '2025-11-12',
    '2025-11-13',
    '2025-11-14',
  ],
};

// אפשרויות קבועות
const EVENT_OPTIONS = [
  { value: '1', label: 'אירוע 1' },
  { value: '2', label: 'אירוע 2' },
  { value: '3', label: 'אירוע 3' },
  { value: '4', label: 'אירוע 4' },
];

const GROUP_BY_OPTIONS = [
  { value: 'day', label: 'יום' },
  { value: 'event_name', label: 'שם אירוע' }
];

const TYPE_OPTIONS = [
  { value: 'mean', label: 'ממוצע' },
  { value: 'sum', label: 'סכום' },
  { value: 'count', label: 'ספירה' },
  { value: 'min', label: 'מינימום' },
  { value: 'max', label: 'מקסימום' },
];

// יצירת רשימת ימים
const generateDaysOptions = (startDate, endDate) => {
  const days = [];
  const current = new Date(startDate);
  const end = new Date(endDate);

  while (current <= end) {
    const dateStr = current.toISOString().split('T')[0];
    days.push({
      value: dateStr,
      label: new Date(dateStr).toLocaleDateString('he-IL'),
    });
    current.setDate(current.getDate() + 1);
  }

  return days;
};

// הגדרת תבניות מוגדרות מראש
const PREDEFINED_TEMPLATES = {
  yesterday: {
    name: 'אתמול',
    getData: () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      return {
        events: [], // כל האירועים - יחזיר ריק והקוד יביא את כל האירועים
        start: yesterdayStr,
        end: yesterdayStr,
        group_by: 'day',
        type: 'mean',
        days: [yesterdayStr],
      };
    }
  }
};

export function useSummaryForm() {
  const {setSummary} = useInsertStore();
  const onSubmit = useCallback(async (dataFORM) => {
    try {

        // Perform some specific logic if 'event_name' is included in group_by
        dataFORM.group_by = dataFORM.group_by === 'event_name' ? ['event_name', 'day'] : ['day', 'event_name'];
      // range of days
        dataFORM.days = generateDaysOptions(dataFORM.start, dataFORM.end).map(day => day.value);
      console.log('טופס הסיכום הוגש:', dataFORM);
      setSummary(dataFORM);
      toast.promise(
        Promise.resolve(dataFORM),
        {
          loading: 'מעבד...',
          success: 'הנתונים הוגשו בהצלחה!',
          error: 'ההגשה נכשלה!',
        }
      );

      return new Promise((resolve) => resolve(dataFORM));
    } catch (error) {
      console.error('שגיאה בהגשה:', error);
      toast.error('שגיאה בהגשת הנתונים');
      throw error;
    }
  }, []);

  return { onSubmit };
}

// פונקציה להחזרת נתוני תבנית מוגדרת מראש
export function getTemplateData(templateKey, allEvents = []) {
  if (templateKey === 'custom') {
    return null; // התאמה אישית - לא משתמשים בתבנית
  }
  
  if (templateKey && PREDEFINED_TEMPLATES[templateKey]) {
    const templateData = PREDEFINED_TEMPLATES[templateKey].getData();
    
    // אם חומר-אירועים ריק, השתמש בכל האירועים
    if (templateData.events.length === 0 && allEvents.length > 0) {
      templateData.events = allEvents.map(event => event.event_id);
    }
    
    return templateData;
  }
  
  return null;
}

export function SummaryEditStep({ onComplete, startDate = DEFAULT_VALUES.start, endDate = DEFAULT_VALUES.end }) {
  const { onSubmit } = useSummaryForm();
  const [showCustomFields, setShowCustomFields] = useState(true);
  
  const daysOptions = useMemo(
    () => generateDaysOptions(startDate, endDate),
    [startDate, endDate]
  );

  const handleSubmit = async (data) => {
    console.log('נתונים סופיים:', data);
    const result = onSubmit(data);
    if (onComplete) {
      onComplete();
    }
  };

  const eventsOptions = useSuspenseQuery(apiListEvents()).data;
  const uniqueEventOptions = eventsOptions ? [...new Map(eventsOptions.map(item => [item.event_id, item])).values()] : [];
  console.log({uniqueEventOptions});

  // Callback עבור ה-watch כדי להעדכן את השדות בהתאם לבחירת התבנית
  const handleTemplateChange = useCallback((formData) => {
    const selectedTemplate = formData.templateType;
    
    if (selectedTemplate === 'custom') {
      setShowCustomFields(true);
    } else {
      setShowCustomFields(false);
      // הגדר את הנתונים מהתבנית
      const templateData = getTemplateData(selectedTemplate, uniqueEventOptions);
      if (templateData) {
        console.log('טעינת נתוני תבנית:', templateData);
        // זה יתבצע דרך StepsProvider עם reset
      }
    }
    
    return formData;
  }, [uniqueEventOptions]);

  const fields = [
    {
      step: 1,
      name: 'templateType',
      label: 'בחר סוג הטפס',
      component: Field.Select,
      variant: 'filled',
      InputLabelProps: { shrink: true },
      helperText: 'בחר תבנית מוגדרת מראש או התאמה אישית',
      children: [
        <MenuItem key="custom" value="custom">
          <Typography variant="body2">התאמה אישית</Typography>
        </MenuItem>,
        <MenuItem key="yesterday" value="yesterday">
          <Typography variant="body2">{PREDEFINED_TEMPLATES.yesterday.name}</Typography>
        </MenuItem>,
      ],
    },
    ...(showCustomFields ? [
      {
        step: 1,
        name: 'events',
        label: 'אירועים',
        component: Field.MultiSelect,
        variant: 'filled',
        InputLabelProps: { shrink: true },
        helperText: 'בחר את האירועים להצגה',
        options: uniqueEventOptions.map(event => ({ value: event.event_id, label: event.event_name })),
        checkbox: true,
        chip: true,
      },
      {
        step: 1,
        name: 'start',
        label: 'תאריך התחלה',
        component: Field.HebrewDatePicker,
        variant: 'filled',
        InputLabelProps: { shrink: true },
      },
      {
        step: 1,
        name: 'end',
        label: 'תאריך סיום',
        component: Field.HebrewDatePicker,
        variant: 'filled',
        InputLabelProps: { shrink: true },
      },
      {
        step: 2,
        name: 'group_by',
        label: 'קבץ לפי',
        component: Field.Select,
        variant: 'filled',
        InputLabelProps: { shrink: true },
        helperText: 'בחר אילו שדות לקבץ לפיהם',
        children: GROUP_BY_OPTIONS.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <Typography variant="body2">{option.label}</Typography>
          </MenuItem>
        )),
      },
      {
        step: 2,
        name: 'type',
        label: 'סוג החישוב',
        component: Field.Select,
        variant: 'filled',
        InputLabelProps: { shrink: true },
        helperText: 'בחר את סוג החישוב הרצוי',
        children: TYPE_OPTIONS.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <Typography variant="body2">{option.label}</Typography>
          </MenuItem>
        )),
      },
      {
        step: 3,
        name: 'days',
        label: 'בחר ימים',
        component: Field.MultiSelect,
        variant: 'filled',
        InputLabelProps: { shrink: true },
        helperText: 'בחר את הימים לניתוח',
        options: daysOptions,
        checkbox: true,
        chip: true,
      },
    ] : []),
  ];

  const steps = [
    {
      label: 'בחירת תבנית',
      component: <MasterStep fields={fields.filter(f => f.step === 1)} number={1} />,
      icon: 'mdi:template-outline',
      name: 'templateType',
    },
    ...(showCustomFields ? [
      {
        label: 'אירועים ותאריכים',
        component: <MasterStep fields={fields.filter(f => f.step === 1)} number={1} />,
        icon: 'mdi:calendar-range',
        name: 'events',
      },
      {
        label: 'קיבוץ וחישוב',
        component: <MasterStep fields={fields.filter(f => f.step === 2)} number={2} />,
        icon: 'mdi:chart-box-outline',
        name: 'group_by',
      },
      {
        label: 'בחירת ימים',
        component: <MasterStep fields={fields.filter(f => f.step === 3)} number={3} />,
        icon: 'mdi:calendar-check-outline',
        name: 'days',
      },
    ] : []),
    {
      name: 'complete',
      component: <></>,
    },
  ];

  return (
    <StepsProvider
      steps={steps}
      defaultValues={DEFAULT_VALUES}
      WizardSchema={SummaryFormSchema}
      onSubmit={handleSubmit}
      watch={handleTemplateChange}
      watchName="templateType"
    />
  );
}

export function SummaryEditDialog({ open, onClose, onComplete, startDate, endDate }) {
  const handleWizardComplete = (data) => {
     onClose();
    if (onComplete) {
      onComplete(data);
    }
   
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <SummaryEditStep
        onComplete={handleWizardComplete}
        startDate={startDate}
        endDate={endDate}
      />
    </Dialog>
  );
}
