import { toast } from "sonner";
import { useCallback, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";

import { Alert, Stack, Dialog, Typography, Box, Button, MenuItem, Divider, Grid } from "@mui/material";
import { Field } from "src/components/hook-form";

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
      console.log('exception data: ', data);
      
      const exceptionData = exceptionsDataServerFromat(data);

      console.log('exceptionData formatted: ', exceptionData);
      

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

      console.log('exception', exceptionData);
    } catch (error) {
      console.error('Error saving exception:', error);
      toast.error('שגיאה בשמירת האישור');
    }
  }, [updateException]);

  return {
    onSubmit
  };
}


export function ExceptionDefinitionStep({ onComplete, exception, editMode = false }) {
  console.log('ExceptionDefinitionStep rendered: ', exception);
  const studentsData = useSuspenseQuery(apiInfoStudents());
  const { selectedEvent } = useInsertStore();
  
  const students = studentsData.data || [];

  const studentsList = exception?.students?.length ? exception.students : [];

  const initialValues = {
    exception_id: exception?.exception_id || '',
    exception_type: exception?.exception_type || 'custom',
    from_day: exception?.from_day || today('YYYY-MM-DD'),
    from_hour: exception?.from_hour || fCurrentTime(),
    to_day: exception?.to_day || today('YYYY-MM-DD'),
    to_hour: exception?.to_hour || fCurrentTime(),
    reason: exception?.reason || '',
    students: studentsList.map(student => student.student_id) || [],
  };

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

  const { handleSubmit, watch, setValue } = methods;
  const { onSubmit: handleExceptionSubmit } = useExceptionDefinition({ exception });
  
  const exceptionType = watch('exception_type');

  // Update time fields based on exception type
  useEffect(() => {
    if (exceptionType === 'day') {
      setValue('from_day', selectedEvent.day);
      setValue('to_day', selectedEvent.day);
    }
    if (exceptionType === 'past_event' && selectedEvent?.day) {
      setValue('from_day', selectedEvent.day);
      setValue('to_day', selectedEvent.day);
      if (selectedEvent.event_start) {
        setValue('from_hour', selectedEvent.event_start);
      }
      if (selectedEvent.event_end) {
        setValue('to_hour', selectedEvent.event_end);
      }
    }
    if (exceptionType === 'today') {
      setValue('from_day', today('YYYY-MM-DD'));
      setValue('to_day', today('YYYY-MM-DD'));
      setValue('from_hour', fCurrentTime());
      setValue('to_hour', fCurrentTime());
    } else if (exceptionType === 'event' && selectedEvent?.day) {
      setValue('from_day', selectedEvent.day);
      setValue('to_day', selectedEvent.day);
      if (selectedEvent.event_start) {
        setValue('from_hour', selectedEvent.event_start);
      }
      if (selectedEvent.event_end) {
        setValue('to_hour', selectedEvent.event_end);
      }
    }
  }, [exceptionType, selectedEvent, setValue]);

  const onSubmit = async (data, mode = 'update') => {
    console.log('data submitted: ', data);
    await handleExceptionSubmit(data, mode);
    if (onComplete) {
      onComplete(data);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <FormProvider {...methods}>
       
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
            <Button
              variant="soft"
              color="success"
              onClick={handleSubmit((data) => onSubmit(data, 'update'))}
            >
              שמירת אישור
            </Button>
          </Stack>
        </Stack>
      </FormProvider>
    </Box>
  );
}

export function ExceptionDialog({ open, onClose, onComplete, column, editMode=false }) {
  const handleWizardComplete = (data) => {
    if (onComplete) {
      onComplete(data);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm'>
      <ExceptionDefinitionStep
        exception={column}
        onComplete={handleWizardComplete}
        editMode={editMode}
      />
    </Dialog>
  );
}