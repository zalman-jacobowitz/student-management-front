import { z as zod } from 'zod';
import { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { zodResolver } from "@hookform/resolvers/zod";

import { LoadingButton } from '@mui/lab';
import { Card, Stack, Button, MenuItem, CardHeader, Typography, CardActions, CardContent } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { apiTemplates } from 'src/actions/templates';
import { apiEventsToday } from 'src/actions/events_today';

import { Form, Field } from 'src/components/hook-form';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { ComponentContainer } from 'src/components/blanks/component-block';

import useInsertStore from '../insert-state';

import { InsertFormPastEvents } from './insert-form-past-events';


const today = new Date().toISOString().split('T')[0]

const defaultValues = { event: '', day: today}

const EventSchema = zod.object({
  event: zod.string().min(1, { message: 'חובה לבחור סדר!' }),
  day: zod.string().min(1, { message: 'חובה להכניס יום' })
});


function useInsertForm() {

  const { setEventDetails } = useInsertStore();
  
  // טופס לבחירה של סדר מסויים לביצוע רישום
  const methods = useForm({
    mode: 'onChange',
    resolver: zodResolver(EventSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = methods;
  
  // קריאה לסדרים של היום לפי סוגי הזמנים - מקבל יום ומחזיר את הסדרים היום.
  const eventsToday = useQuery(apiEventsToday(watch('day'))).data || [];
  
  const onSubmit = handleSubmit(async (data) => {
        // מוצא את פרטי ה event
        const moreDetails = eventsToday.find((option) => option.event_id === data.event)
        setEventDetails( {...moreDetails, ...data})
  })
  useEffect(()=>{
    if (eventsToday.length > 0){
      // כאן צריך להיות חישוב של איזה סדר שייך לעכשיו
      setValue('event', eventsToday[0].event_id)
    }
  }, [eventsToday, setValue])
  
  return {
    methods,
    onSubmit,
    eventsToday,
    isSubmitting,
    reset
  };
}

export function InsertForm() {
  
  const {
    methods,
    onSubmit,
    reset,
    eventsToday,
    isSubmitting
  } = useInsertForm();

  const dialogPrevEvents = useBoolean(false);

  const renderSelectDay = (
    <Field.HebrewDatePicker
      label="תאריך עברי"
      name="day"
      data-testid="hebrew-date-picker"
    />
  )

  const renderSelectEvent = (
    <Field.Select
      defaultValue={eventsToday.length? eventsToday[0].event_id: ''} 
      fullWidth
      name="event"
      label="אירוע"
      variant="filled"
      InputLabelProps={{ shrink: true }}
      data-testid="event-select"
      native={false}
      slotProps={{}}
      helperText=""
      inputProps={{}}
    >
    {eventsToday.map((option) => (
      <MenuItem
        key={option.event_id}
        value={option.event_id}
        sx={{ textTransform: 'capitalize' }}>  
        <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
          {`${option.event_name}`}
        </Typography>
      </MenuItem>
    ))}
    </Field.Select>
  );


  return (
    <ComponentContainer sx={{}}>
      <Card sx={{ p: 5, width: 1, mx: 'auto', maxWidth: 520 }}>
        <Form methods={methods} onSubmit={onSubmit}>
          <CardHeader
            title="רישום אירוע"
            subheader="בחר אירוע לרישום"
          />
          <CardContent sx={{ mb: 3 }}>
            <Stack direction="column" spacing={2}>
              {renderSelectDay}
              {renderSelectEvent}
            </Stack>
          </CardContent>
          <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              onClick={() => dialogPrevEvents.onTrue()} 
              variant="outlined" 
              color="inherit"
              data-testid="existing-events-button"
            >
              בחר אירוע קיים
            </Button>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
              data-testid="start-registration"
            >
              התחל רישום
            </LoadingButton>
          </CardActions>
          <ConfirmDialog
            open={dialogPrevEvents.value}
            title="עריכת אירועים קודמים"

           content={
            <InsertFormPastEvents
                dialogPrevEvents={dialogPrevEvents}
                methods={methods}
                reset={reset}
              />}
            onClose={() => dialogPrevEvents.onFalse()}
          />
        </Form>
      </Card>
    </ComponentContainer>
   );
  }
