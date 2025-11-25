import { toast } from "sonner";
import { useCallback, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";

import { Alert, Stack, Dialog, Typography, Box, Button, MenuItem, Divider, Grid } from "@mui/material";
import { Field, Form } from "src/components/hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { exceptionsUpdate } from "src/actions/exceptions";
import { apiInfoStudents } from "src/actions/info_students.ts";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { uuidv4 } from "src/utils/uuidv4";
import { SelectStudents } from "../insert/delays/select-students.jsx";
import { fCurrentTime, today } from "src/utils/format-time.js";
import { Scrollbar } from "src/components/scrollbar/scrollbar.tsx";
import useInsertStore from "../insert/insert-state";
import { inHebrew } from "src/utils/hebrew/getter.js";
import { LoadingButton } from "@mui/lab";

// הגדרת תבניות אישורים מוגדרות מראש
const PREDEFINED_EXCEPTION_TYPES = {
  day: {
    name: 'אישור ליום',
    getData: (selectedEvent) => ({
      from_day: selectedEvent.day,
      to_day: selectedEvent.day,
      from_hour: '00:00',
      to_hour: '23:59',
    }),
  },
  past_event: {
    name: 'אישור לסדר בעבר',
    getData: (selectedEvent) => ({
      from_day: selectedEvent.day,
      to_day: selectedEvent.day,
      from_hour: selectedEvent.event_start || null,
      to_hour: selectedEvent.event_end || null,
    }),
  },
  today: {
    name: 'אישור להיום',
    getData: () => ({
      from_day: today('YYYY-MM-DD'),
      to_day: today('YYYY-MM-DD'),
      from_hour: '00:00',
      to_hour: '23:59',
    }),
  },
  event: {
    name: 'אישור להיום בסדר',
    getData: (selectedEvent) => ({
      from_day: selectedEvent.day,
      to_day: selectedEvent.day,
      from_hour: selectedEvent.event_start || null,
      to_hour: selectedEvent.event_end || null,
    }),
  },
};

// פונקציה לעדכון שדות הטופס בהתאם לסוג האישור
export function getExceptionTypeData(exceptionType, selectedEvent) {
  if (exceptionType === 'custom') {
    return null; // התאמה אישית - לא משתמשים בתבנית
  }

  if (exceptionType && PREDEFINED_EXCEPTION_TYPES[exceptionType]) {
    const templateData = PREDEFINED_EXCEPTION_TYPES[exceptionType].getData(selectedEvent);
    return templateData;
  }

  return null;
}

/**
 * זיהוי אוטומטי של סוג אישור בהתאם לערכים הקיימים ול-selectedEvent
 * @param {Object} data - נתוני האישור
 * @param {string} data.from_day - תאריך התחלה (YYYY-MM-DD)
 * @param {string} data.to_day - תאריך סיום (YYYY-MM-DD)
 * @param {string} data.from_hour - שעת התחלה (HH:mm)
 * @param {string} data.to_hour - שעת סיום (HH:mm)
 * @param {Object} selectedEvent - האירוע הנבחר
 * @param {string} selectedEvent.day - היום של האירוע (YYYY-MM-DD)
 * @param {string} selectedEvent.event_start - שעת התחלת האירוע (HH:mm)
 * @param {string} selectedEvent.event_end - שעת סיום האירוע (HH:mm)
 * @returns {string} סוג האישור המזוהה
 */
export function detectExceptionType(data, selectedEvent) {
  if (!data || !data.from_day || !data.to_day) {
    return 'custom';
  }

  const todayDate = today('YYYY-MM-DD');
  const fromDay = data.from_day;
  const toDay = data.to_day;
  const fromHour = data.from_hour;
  const toHour = data.to_hour;

  // בדיקה: אישור להיום
  if (fromDay === todayDate && toDay === todayDate) {
    // בדיקה: אישור להיום בסדר (עם שעות של selectedEvent)
    if (selectedEvent?.event_start && selectedEvent?.event_end && 
        fromHour === selectedEvent.event_start && toHour === selectedEvent.event_end) {
      return 'event';
    }

    // בדיקה: אישור להיום (כל היום)
    if (fromHour === '00:00' && toHour === '23:59') {
      return 'today';
    }
  }

  // בדיקה: אישור ליום מסוים
  if (fromDay === toDay && selectedEvent && fromDay === selectedEvent.day) {
    // בדיקה: אישור לסדר בעבר (עם שעות של selectedEvent)
    if (selectedEvent.event_start && selectedEvent.event_end && 
        fromHour === selectedEvent.event_start && toHour === selectedEvent.event_end) {
      return 'past_event';
    }

    // בדיקה: אישור ליום (כל היום)
    if (fromHour === '00:00' && toHour === '23:59') {
      return 'day';
    }
  }

  // אם לא התאים לאף תבנית
  return 'custom';
}

function getExceptionTypeOptions(selectedEvent) {
  return [
    {
      value: 'day',
      label: `אישור ל${inHebrew(selectedEvent.day, 'Dms')}`,
      secondary: inHebrew(selectedEvent.day, '', true)
    },
    {
      value: 'past_event',
      label: `אישור לסדר ${selectedEvent.event_name} ב${inHebrew(selectedEvent.day, 'Dm')}`,
      secondary: inHebrew(selectedEvent.day, '', true)
    },
    { divider: true },
    {
      value: 'today',
      label: `אישור להיום`,
      secondary: inHebrew(today('YYYY-MM-DD'), 'Dms')
    },
    {
      value: 'event',
      label: `אישור להיום ב${selectedEvent.event_name}`,
      secondary: `${inHebrew(today('YYYY-MM-DD'), 'Dms')} ${selectedEvent.event_start} - ${selectedEvent.event_end}`
    },
    { divider: true },
    {
      value: 'custom',
      label: 'מותאם אישית',
    },
  ];
}

function exceptionsDataServerFromat(data) {

  const exception_id = data.exception_id || uuidv4()
  
  const { students, reason, from_day, from_hour, to_day, to_hour } = data

  const listEvents = []

  data.students.map(student_id => listEvents.push({
    exception_id,
    reason,
    from_day,
    from_hour,
    to_day,
    to_hour,
    student_id
  }))

  return listEvents
}
function useExceptionDefinition({ exception }) {
  const queryClient = useQueryClient();
  const updateException = useMutation(exceptionsUpdate({ queryClient }));

  const onSubmit = useCallback(async (data, mode = 'update') => {
    try {
      
      const exceptionData = exceptionsDataServerFromat(data);

      

      const promiseException = updateException.mutateAsync({ 
        data: exceptionData, 
        mode
      });
      
      toast.promise(promiseException, {
        loading: 'שומר אישור...',
        success: 'אישור נשמר בהצלחה',
        error: 'שגיאה בשמירת האישור'
      });

      await promiseException;

    } catch (error) {
      console.error('Error saving exception:', error);
      toast.error('שגיאה בשמירת האישור');
    }
  }, [updateException]);

  return {
    onSubmit
  };
}


export function ExceptionDefinitionStep({ onComplete, exception, editMode = false, mode = 'base' }) {
  const studentsData = useSuspenseQuery(apiInfoStudents());
  const { selectedEvent } = useInsertStore();
  
  const students = studentsData.data || [];

  const studentsList = exception?.students?.length ? exception.students : [];

  const initialValues = {
    exception_id: exception?.exception_id || '',
    exception_type: mode === 'event' ? detectExceptionType(exception, selectedEvent) : 'custom',
    from_day: exception?.from_day || today('YYYY-MM-DD'),
    from_hour: exception?.from_hour || fCurrentTime(),
    to_day: exception?.to_day || today('YYYY-MM-DD'),
    to_hour: exception?.to_hour || fCurrentTime(),
    reason: exception?.reason || '',
    students: studentsList.map(student => student.student_id) || [],
  };

  console.log('studentsList', studentsList);

  const WizardSchema = z.object({
    exception_id: z.string().optional(),
    exception_type: z.string().min(1, 'יש לבחור סוג אישור'),
    from_day: z.string().min(1, 'תאריך התחלה נדרש'),
    from_hour: z.string().min(1, 'שעת התחלה נדרשת'),
    to_day: z.string().min(1, 'תאריך סיום נדרש'),
    to_hour: z.string().min(1, 'שעת סיום נדרשת'),
    reason: z.string().min(1, 'סיבה נדרשת'),
    students: z.array(z.string()).min(1, 'יש לבחור לפחות תלמיד אחד'),
  });

  const methods = useForm({
    resolver: zodResolver(WizardSchema),
    defaultValues: initialValues
  });

  const { handleSubmit, watch, setValue, formState: { isSubmitting } } = methods;

  const { onSubmit: handleExceptionSubmit } = useExceptionDefinition({ exception });
  
  const exceptionType = watch('exception_type');

  // Update time fields based on exception type
  useEffect(() => {
    const exceptionData = getExceptionTypeData(exceptionType, selectedEvent);
    
    if (exceptionData) {
      if (exceptionData.from_day) setValue('from_day', exceptionData.from_day);
      if (exceptionData.to_day) setValue('to_day', exceptionData.to_day);
      if (exceptionData.from_hour) setValue('from_hour', exceptionData.from_hour);
      if (exceptionData.to_hour) setValue('to_hour', exceptionData.to_hour);
    }
  }, [exceptionType, selectedEvent, setValue]);

  const onSubmit = async (data, mode = 'update') => {
    console.log('Submitting data:', data);

    await handleExceptionSubmit(data, mode);
    if (onComplete) {
      onComplete(data);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
       <Form methods={methods} onSubmit={handleSubmit((data) => onSubmit(data, 'update'))}>
       
        <Stack spacing={3}>
          <Typography variant="h6" gutterBottom>
            הגדרת אישור
          </Typography>
          <SelectStudents
            infoStudents={students}
            label="בחירת תלמידים"
          />

          <Field.Text
            name="reason"
            label="סיבה"
            variant="outlined"
            fullWidth
          />

{ mode === 'event' && (
          <Field.Select
            name="exception_type"
            label="סוג האישור"
          >
            {getExceptionTypeOptions(selectedEvent).map((option) =>
              option.divider ? (
                <Divider key={Math.random()} sx={{ my: 1 }} />
              ) : (
                <MenuItem key={option.value} value={option.value}>
                  <Stack>
                    <Typography variant="body2">{option.label}</Typography>
                    {option.secondary && (
                      <Typography variant="caption" color="text.secondary">
                        {option.secondary}
                      </Typography>
                    )}
                  </Stack>
                </MenuItem>
              )
            )}
          </Field.Select>
)
}
                     

              <>
               <Divider />
              <Stack spacing={2} >
                <Stack direction="row" spacing={2}>
                  <Box sx={{ flex: 2 }}>
                    <Field.HebrewDatePicker
                      disabled={exceptionType !== 'custom'}
                  name="from_day"
                  label="תאריך התחלה"
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Field.Text
                disabled={exceptionType !== 'custom'}
                  name="from_hour"
                  label="שעת התחלה"
                  type="time"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Box>
            </Stack>

            <Stack direction="row" spacing={2}>
              <Box sx={{ flex: 2 }}>
                <Field.HebrewDatePicker
                disabled={exceptionType !== 'custom'}
                  name="to_day"
                  label="תאריך סיום"
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Field.Text
                  name="to_hour"
                  disabled={exceptionType !== 'custom'}
                  label="שעת סיום"
                  type="time"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Box>
            </Stack>

          </Stack>
          </>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="soft"
              color="error"
              onClick={handleSubmit((data) => onSubmit(data, 'delete'))}
            >
              מחק
            </Button>
        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          שמור שינויים
        </LoadingButton>
          </Stack>
        </Stack>
      </Form>
    </Box>
  );
}

export function ExceptionDialog({ open, mode='base', onClose, onComplete, column, editMode=false }) {
  const handleWizardComplete = (data) => {
    if (onComplete) {
      onComplete(data);
    }
    
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm'>
      <ExceptionDefinitionStep
        mode={mode}
        exception={column}
        onComplete={handleWizardComplete}
        editMode={editMode}
      />
    </Dialog>
  );
}