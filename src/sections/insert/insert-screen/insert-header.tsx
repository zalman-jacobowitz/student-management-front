
import { Box } from "@mui/material";

import { PageTitle } from "src/components/layout";

import { inHebrew } from "src/utils/hebrew/getter";

import useInsertStore from "../insert-state";

const LABEL_SUMMARY = [
  {
    label: 'נוכחים',
    color: 'success',
    icon: 'solar:check-bold',
    sum: (data: any[])=> data.filter((item) => item).length
  },
  { 
    label: 'חסרים',
    color: 'error',
    icon: 'solar:cross-bold',
    sum: (data: any[])=> data.filter((item) => !item).length
  },
  {
    label: 'מתוך',
    color: 'default',
    icon: '' ,
    sum: (data: any[])=> data.length},
]

interface InsertListHeaderProps {
  currentData: any[];
  watch: any;
}

export function InsertListHeader({currentData, watch}: InsertListHeaderProps) {
  const { selectedEvent, currentEventIndex, allEvents, nextEvent, prevEvent } = useInsertStore(state => state);

  // @ts-expect-error - inHebrew accepts string format parameters
  const hebDay = inHebrew(selectedEvent.day, 'Dms')
  const data = Object.values(watch());
  
  // קבלת שם האירוע הקודם
  const prevEventName = currentEventIndex > 0 ? allEvents[currentEventIndex - 1]?.event_name : '';
  const prevEventDay = currentEventIndex > 0 ? allEvents[currentEventIndex - 1]?.day : '';
  
  // קבלת שם האירוע הבא
  const nextEventName = currentEventIndex < allEvents.length - 1 ? allEvents[currentEventIndex + 1]?.event_name : '';
  const nextEventDay = currentEventIndex < allEvents.length - 1 ? allEvents[currentEventIndex + 1]?.day : '';
  
  return (
    <Box sx={{ mb: 2, textAlign: 'center' }}>
      <PageTitle
        primary={selectedEvent.event_name}
        secondary={`יום ${hebDay}`}
      />
    </Box>
  );
}
