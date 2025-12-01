import { z as zod } from 'zod';
import { useEffect, useMemo } from 'react';
import { useForm } from "react-hook-form";
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { zodResolver } from "@hookform/resolvers/zod";

import { LoadingButton } from '@mui/lab';
import { Card, Stack, Button, MenuItem, CardHeader, Typography, CardActions, CardContent, Alert } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { apiTemplates } from 'src/actions/templates';
import { apiEventsToday } from 'src/actions/events_today';

import { Form, Field } from 'src/components/hook-form';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { ComponentContainer } from 'src/components/blanks/component-block';

import useInsertStore from '../insert-state';

import { InsertFormPastEvents } from './insert-form-past-events';
import { apiListEvents } from 'src/actions/list_of_events';
import { inHebrew } from 'src/utils/hebrew/getter';



const today = new Date().toISOString().split('T')[0]

const defaultValues = { event: '', day: today}

const EventSchema = zod.object({
  event: zod.string().min(1, { message: 'חובה לבחור סדר!' }),
  day: zod.string().min(1, { message: 'חובה להכניס יום' })
});

function mergeCurrentWithPastEvents(currentData, pastEvent, today) {
  const newData = [...currentData, ...pastEvent.filter((event) => event.day === today)];
  
  // drop duplicates based on event_id

  const uniqueData = Array.from(new Map(newData.map(item => [item.event_id, item])).values());

  return uniqueData;
}

function useInsertForm() {

  const { setEventDetails, setAllEvents } = useInsertStore();
  
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

  const listOfTimes = useSuspenseQuery(apiListEvents())
  // קריאה לסדרים של היום לפי סוגי הזמנים - מקבל יום ומחזיר את הסדרים היום.
  const currentEvent = useQuery(apiEventsToday(watch('day'))).data || [];

  const eventsToday = useMemo(() => mergeCurrentWithPastEvents(currentEvent, listOfTimes.data, watch('day')), [watch('day'), currentEvent, listOfTimes.data]);
  
  const onSubmit = handleSubmit(async (data) => {
        // מוצא את פרטי ה event
        const moreDetails = eventsToday.find((option) => option.event_id === data.event)
        setAllEvents(listOfTimes.data);
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
    reset,
    listOfTimes
  };
}

export function InsertForm() {
  
  const {
    methods,
    onSubmit,
    reset,
    eventsToday,
    isSubmitting,
    listOfTimes
  } = useInsertForm();

  const dialogPrevEvents = useBoolean(false);


  const selectedEvent = listOfTimes.data.find(event => event.event_id === methods.watch('event'));
  const selectedDay = methods.watch('day');

  const renderSelectDay = (
    <Field.HebrewDatePicker
      label="תאריך עברי"
      name="day"
      data-testid="hebrew-date-picker"
      className="insert-form__date-picker"
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
      id="event-select"
      className="insert-form__event-select"
    >
    {eventsToday.map((option) => (
      <MenuItem
        key={option.event_id}
        value={option.event_id}
        sx={{ textTransform: 'capitalize' }}
        className="insert-form__event-menu-item">  
        <Stack direction="column" spacing={0.5} className="insert-form__event-details">
          <Typography variant="subtitle2" sx={{ color: 'text.primary' }} className="insert-form__event-name">
            {`${option.event_name}`}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }} className="insert-form__event-time">
            {`${option.event_start} - ${option.event_end}`}
          </Typography>
        </Stack>
      </MenuItem>
    ))}
    </Field.Select>
  );


  return (
    <ComponentContainer sx={{}} className="insert-form__container">
      <Card sx={{ p: 5, width: 1, mx: 'auto', maxWidth: 520 }} className="insert-form__card">

        <Form methods={methods} onSubmit={onSubmit} className="insert-form__form">
          <CardHeader
            title="רישום אירוע"
            subheader="בחר אירוע לרישום"
            className="insert-form__header"
          />

          <CardContent sx={{ mb: 3 }} className="insert-form__content">
            <Stack direction="column" spacing={2} className="insert-form__content-stack">
                        <Alert severity="info" sx={{ mb: 2 }} className="insert-form__alert">
            האירוע שנבחר: {selectedEvent?.event_name} ({inHebrew(selectedDay, true, true)})
          </Alert>
              {renderSelectDay}
              {renderSelectEvent}
            </Stack>
          </CardContent>
          <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }} className="insert-form__actions">
            <Button 
              onClick={() => dialogPrevEvents.onTrue()} 
              variant="outlined" 
              color="inherit"
              data-testid="existing-events-button"
              className="insert-form__prev-events-button"
            >
              בחר אירוע קיים
            </Button>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
              data-testid="start-registration"
              className="insert-form__submit-button"
            >
              התחל רישום
            </LoadingButton>
          </CardActions>
          <ConfirmDialog
            open={dialogPrevEvents.value}
            title="עריכת אירועים קודמים"
            className="insert-form__confirm-dialog"
           content={
            <InsertFormPastEvents
                listOfTimes={listOfTimes}
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
