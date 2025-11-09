import { toast } from "sonner";
import { useState, useCallback } from "react";
import { useFormContext } from "react-hook-form";

import { Alert, Stack, Dialog, Typography, Chip, Box } from "@mui/material";
import { Field } from "src/components/hook-form";

import { z } from "zod";

import { StepsProvider } from "src/components/steps-form/steps-provider";
import { MasterStep } from "src/components/steps-form/dynamiv-component";
import { exceptionsUpdate } from "src/actions/exceptions";
import { apiInfoStudents } from "src/actions/info_students.ts";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { uuidv4 } from "src/utils/uuidv4";
import { description } from "../insert/functions.ts";
import { SelectStudents } from "../insert/delays/select-students.jsx";
import { inHebrew } from "src/utils/hebrew/getter.js";
import { fCurrentTime, today } from "src/utils/format-time.js";

function StudentsSelectionStep() {
  const { control, watch, setValue } = useFormContext();
  const studentsData = useSuspenseQuery(apiInfoStudents());
  const selectedStudents = watch("students") || [];

  const students = studentsData.data || [];
  
  const handleStudentToggle = (studentId) => {
    const currentStudents = selectedStudents;
    const isSelected = currentStudents.includes(studentId);
    
    if (isSelected) {
      setValue("students", currentStudents.filter(id => id !== studentId));
    } else {
      setValue("students", [...currentStudents, studentId]);
    }
  };

  return (
    <Stack spacing={3}>
      <SelectStudents
        multiple
        name="students"
        placeholder="הוסף תלמידים"
      />
    </Stack>
  );
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

  const onSubmit = useCallback(async (data) => {
    try {
      console.log('exception data: ', data);
      
      const exceptionData = exceptionsDataServerFromat(data);

      console.log('exceptionData formatted: ', exceptionData);
      

      const promiseException = updateException.mutateAsync({ 
        data: exceptionData, 
        mode:  "update"
      });
      
      toast.promise(promiseException, {
        loading: 'שומר אישור...',
        success: 'אישור נשמר בהצלחה',
        error: 'שגיאה בשמירת האישור'
      });

      console.log('exception', exceptionData);
    } catch (error) {
      console.error('Error saving exception:', error);
    }
  }, [updateException]);

  return {
    onSubmit
  };
}

/*
function ExceptionInfoBeforeSave() {
  const { watch } = useFormContext();
  const exception = watch();
  const students = exception?.students?.length ? exception.students :  [];
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1">פרטי האישור:</Typography>
      <Typography variant="body2">סיבה: {exception.reason}</Typography>
      <Typography variant="body2">מ{inHebrew(exception.from_day, '', true)} בשעה {exception.from_hour}</Typography>
      <Typography variant="body2">עד {inHebrew(exception.to_day, '', true)} בשעה {exception.to_hour}</Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>תלמידים:</Typography>
    </Box>
  );
}
*/


export function ExceptionDefinitionStep({ onComplete, exception, editMode=false }) {


  const students = exception?.students?.length ? exception.students :  [];

  const initialValues = {
    exception_id: exception?.exception_id || '',
    from_day: exception?.from_day || today('YYYY-MM-DD'),
    from_hour: exception?.from_hour || fCurrentTime(),
    to_day: exception?.to_day || today('YYYY-MM-DD'),
    to_hour: exception?.to_hour || fCurrentTime(),
    reason: exception?.reason || '',
    students: students.map(student => student.student_id) || [],
  };

  const WizardSchema = z.object({
    exception_id: z.string().optional(),
    from_day: z.string().min(1, 'תאריך התחלה נדרש'),
    from_hour: z.string().min(1, 'שעת התחלה נדרשת'),
    to_day: z.string().min(1, 'תאריך סיום נדרש'),
    to_hour: z.string().min(1, 'שעת סיום נדרשת'),
    reason: z.string().min(1, 'סיבה נדרשת'),
    students: z.array(z.string()).min(1, 'יש לבחור לפחות תלמיד אחד'),
  });

  const fields = [
        {
      step: 1,
      name: "students",
      label: "בחירת תלמידים",
      variant: "filled",
      InputLabelProps: { shrink: true },
      component: StudentsSelectionStep
    },
      {
      step: 1,
      name: "reason",
      label: "סיבה",
      variant: "filled",
      InputLabelProps: { shrink: true },
      type: "text",
      component: Field.Text
    },
    {
      step: 1,
      name: "from_day",
      label: "תאריך התחלה",
      variant: "filled",
      InputLabelProps: { shrink: true },
      type: "date",
      component: Field.HebrewDatePicker
    },
    {
      step: 1,
      name: "from_hour",
      label: "שעת התחלה",
      variant: "filled",
      InputLabelProps: { shrink: true },
      type: "time",
      component: Field.Text
    },
    {
      step: 1,
      name: "to_day",
      label: "תאריך סיום",
      variant: "filled",
      InputLabelProps: { shrink: true },
      type: "date",
      component: Field.HebrewDatePicker
    },
    {
      step: 1,
      name: "to_hour",
      label: "שעת סיום",
      variant: "filled",
      InputLabelProps: { shrink: true },
      type: "time",
      component: Field.Text
    }

  ];

  const steps = [
      {
      label: 'בחירת תלמידים',
      component: <MasterStep fields={fields} number={1} />,
      icon: "mdi:account-multiple",
      name: 'studentsSelection'
    },
    {
      name: 'complete',
      component: <></>
    }
  ];

  const { onSubmit } = useExceptionDefinition({ exception });

  return (
    <StepsProvider
      steps={steps}
      defaultValues={initialValues}
      WizardSchema={WizardSchema}
      onSubmit={onSubmit}
    />
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
    <Dialog open={open} onClose={onClose} fullWidth>
      <ExceptionDefinitionStep
        exception={column}
        onComplete={handleWizardComplete}
        editMode={editMode}
      />
    </Dialog>
  );
}