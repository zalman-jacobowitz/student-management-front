
import { Box, Stack } from "@mui/material";

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
              <Stack
          direction={{ xs: 'column', md: 'row' }} 
          spacing={1} 
          alignItems="center"
          justifyContent="center"
          sx={{ flex: 1 }}
        >
          <FabButton
            sx={{ boxShadow: (theme) => theme.customShadows.z8 }}
            icon="solar:round-alt-arrow-right-bold-duotone"
            label={prevEventName}
            subLabel={inHebrew(prevEventDay, 'Dm')}
            color="default"
            variant="softExtended"
            onClick={prevEvent}
            testId="prev-event-fab"
            showSubLabel
            sizeMultiplier={3}
          />
      <PageTitle
        primary={selectedEvent.event_name}
        secondary={`יום ${hebDay}`}
      />
          <FabButton
          
            icon="solar:round-alt-arrow-left-bold-duotone"
            iconAfter={true}
            label={nextEventName}
            subLabel={inHebrew(nextEventDay, 'Dm')}
            color="default"
            variant="softExtended"
            onClick={nextEvent}
            testId="next-event-fab"
            showSubLabel
            sizeMultiplier={3}
          />
        </Stack>



    </Box>
  );
}
