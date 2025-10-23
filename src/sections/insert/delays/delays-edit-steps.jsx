import { z } from "zod";
import { toast } from "sonner";
import { useCallback, useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import { 
  Box, 
  Alert, 
  Stack, 
  Dialog, 
  Typography, 
  Button,
  DialogTitle,
  DialogContent
} from "@mui/material";

import { uuidv4 } from "src/utils/uuidv4";
import { calculateAttendance } from "src/utils/functions-times";

import { delaysUpdate } from "src/actions/delays";
import { apiInfoStudents } from "src/actions/info_students.ts";
import { apiInfoColumns } from "src/actions/info_columns";

import { Field } from "src/components/hook-form";

import useInsertStore from "../insert-state.ts";
import { SelectStudents } from "./select-students";

function delayDataServerFormat(data, eventDetails, delay) {
  const delay_id = delay.delay ? delay.delay : uuidv4();
  const { arrival_time, students } = data;

  const listDelays = []

  students.forEach(student => {
    const { attendancePercentage, latenessMinutes } = calculateAttendance(
      eventDetails.event_start,
      eventDetails.event_end,
      arrival_time
    );

    listDelays.push({
      delay_id,
      arrival_time,
      student_id: student,
      percent: attendancePercentage.toString(),
      delay_minutes: latenessMinutes
    })
  })

  return listDelays
}

function useDelayDefinition(delay) {
  const queryClient = useQueryClient();
  const eventDetails = useInsertStore.getState().selectedEvent
  const mutate = useMutation(delaysUpdate({queryClient, eventDetails}))
  
  const onSubmit = useCallback(async (data, mode='update') => {
    try {
      const delayData = delayDataServerFormat(data, eventDetails, delay)
      const promise = mutate.mutateAsync({data: {eventDetails, delayData}, mode})
      console.log('eventDetails: ', {eventDetails, delayData})

      toast.promise(promise, {
        loading: 'עידכון איחורים...',
        success: 'הצליח העדכון!',
        error: ' שגיאה בעדכון האיחורים!',
      });

      await promise;


      console.log(delayData);
    } catch (error) {
      console.error('Error saving delay:', error);
      toast.error('שגיאה בשמירת האיחור');
    }
  }, [mutate, delay]);

  return {
    onSubmit
  }
}

export function DelayDefinitionStep({ onComplete, delay }) {

  
  const studentsData = useSuspenseQuery(apiInfoStudents());
  
  const columnsData = useSuspenseQuery(apiInfoColumns());
  
  const eventDetails = useInsertStore((state) => state.selectedEvent);

  const students = studentsData.data || [];
  const columns = columnsData.data || [];

  const [delayInfo, setDelayInfo] = useState({ latenessMinutes: 0, attendancePercentage: 100 });

  console.log('delay: ', delay);
  const initialValues = {
    arrival_time: delay?.arrival_time || eventDetails.event_start || '08:00',
    students: delay?.students?.map(s => s.student_id) || []
  }

  const DelaySchema = z.object({
    arrival_time: z.string()
      .min(1, 'זמן הגעה נדרש')
      .refine((time) => {
        if (!eventDetails.event_start || !eventDetails.event_end) return true;
        return time >= eventDetails.event_start && time <= eventDetails.event_end;
      }, {
        message: `זמן הגעה חייב להיות בין ${eventDetails.event_start} ל-${eventDetails.event_end}`
      }),
    students: z.array(z.string()).min(1, 'יש לבחור לפחות תלמיד אחד')

  });

  const methods = useForm({
    resolver: zodResolver(DelaySchema),
    defaultValues: initialValues
  });

  const { handleSubmit, watch } = methods;
  const { onSubmit: handleDelaySubmit } = useDelayDefinition(delay);

  const onSubmit = async (data, mode) => {
    console.log('data submitted: ', data);
    await handleDelaySubmit(data, mode);
    if (onComplete) {
      onComplete(data);
    }
  };

  const watchedArrivalTime = watch('arrival_time');

  useEffect(() => {
    if (watchedArrivalTime && eventDetails.event_start && eventDetails.event_end) {
      const result = calculateAttendance(
        eventDetails.event_start,
        eventDetails.event_end,
        watchedArrivalTime
      );
      setDelayInfo(result);
    }
  }, [watchedArrivalTime, eventDetails]);

  return (
    <Box sx={{ p: 3 }}>
      <FormProvider {...methods}>
        <Stack spacing={3}>
          <Typography variant="h6" gutterBottom>
            הגדרת איחור
          </Typography>

          <Alert severity="info">
            <Typography variant="body2">
              בחר את התלמידים להם יחול האיחור והזן את זמן ההגעה שלהם.
              <br />
              זמן הגעה מותר: {eventDetails.event_start} - {eventDetails.event_end}
            </Typography>
          </Alert>

          <SelectStudents
            infoStudents={students}
            infoColumns={columns}
            label="בחירת תלמידים"
          />

          <Field.Text
            name="arrival_time"
            label="זמן הגעה"
            type="time"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            inputProps={{
              min: eventDetails.event_start,
              max: eventDetails.event_end
            }}
            fullWidth
          />

          {delayInfo.latenessMinutes > 0 && (
            <Alert severity="warning">
              <Typography variant="body2">
                התלמידים יסומנו כמאחרים ב-{delayInfo.latenessMinutes} דקות
                <br />
                אחוז נוכחות: {delayInfo.attendancePercentage}%
              </Typography>
            </Alert>
          )}

          {delayInfo.latenessMinutes <= 0 && (
            <Alert severity="success">
              <Typography variant="body2">
                התלמידים יסומנו כנוכחים במלואם (אחוז נוכחות: {delayInfo.attendancePercentage}%)
              </Typography>
            </Alert>
          )}

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="contained"
              color="error"
              onClick={handleSubmit((data) => onSubmit(data, 'delete'))}
            >
              מחק
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit((data) => onSubmit(data, 'update'))}
            >
              שמירת איחור
            </Button>
          </Stack>
        </Stack>
      </FormProvider>
    </Box>
  );
}



// דיאלוג להצגת טופס איחור
export function DelayDialog({ open, onClose, onComplete, delay, editMode=false }) {

  const handleFormComplete = (data) => {
    if (onComplete) {
      onComplete(data); // קריאה ל-callback שהועבר מהקומפוננטה המשתמשת
    }
    onClose(); // סגירת הדיאלוג לאחר השלמת הטופס
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DelayDefinitionStep
        delay={delay}
        onComplete={handleFormComplete}
      />
    </Dialog>
  );
}