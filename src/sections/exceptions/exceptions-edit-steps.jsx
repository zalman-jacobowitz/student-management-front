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
      <Alert severity="info">
        <Typography variant="body2">
          בחר את התלמידים להם יחול האישור.
        </Typography>
      </Alert>
      
      <SelectStudents
        multiple
        name="students"
        placeholder="הוסף תלמידים"
      />
      
      <Typography variant="body2" color="text.secondary">
        נבחרו {selectedStudents.length} תלמידים
      </Typography>
    </Stack>
  );
}

function exceptionsDataServerFromat(data) {

  const exception_id = data.exception_id || uuidv4()
  
  const { students, reason, start, end } = data

  const listEvents = []

  data.students.map(student_id => listEvents.push({
    exception_id,
    reason,
    start: `${start} 00:00`,
    end: `${end} 23:59`,
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


export function ExceptionDefinitionStep({ onComplete, exception }) {


  const students = exception?.students?.length ? exception.students :  [];

  const initialValues = {
    exception_id: exception?.exception_id || '',
    start: exception?.start || '',
    end: exception?.end || '',
    reason: exception?.reason || '',
    students: students.map(student => student.student_id) || [],
  };

  const WizardSchema = z.object({
    exception_id: z.string().optional(),
    start: z.string().min(1, 'תאריך התחלה נדרש'),
    end: z.string().min(1, 'תאריך סיום נדרש'),
    reason: z.string().min(1, 'סיבה נדרשת'),
    students: z.array(z.string()).min(1, 'יש לבחור לפחות תלמיד אחד'),
  });

  const fields = [
    {
      step: 1,
      name: "start",
      label: "תחילת אישור",
      variant: "filled",
      InputLabelProps: { shrink: true },
      type: "date",
      component: Field.HebrewDateTimePicker
    },
    {
      step: 1,
      name: "end",
      label: "סיום אישור",
      variant: "filled",
      InputLabelProps: { shrink: true },
      type: "date",
      component: Field.HebrewDatePicker
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
      step: 2,
      name: "students",
      label: "בחירת תלמידים",
      variant: "filled",
      InputLabelProps: { shrink: true },
      component: StudentsSelectionStep
    }
  ];

  const steps = [
    {
      label: 'פרטי אישור',
      component: <MasterStep fields={fields} number={1} />,
      icon: "mdi:file-document-edit-outline",
      name: 'exceptionDetails'
    },
    {
      label: 'בחירת תלמידים',
      component: <MasterStep fields={fields} number={2} />,
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

export function ExceptionDialog({ open, onClose, onComplete, column }) {
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
      />
    </Dialog>
  );
}