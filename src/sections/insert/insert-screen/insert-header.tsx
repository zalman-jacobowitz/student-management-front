
import { Box, Grid, Typography, ListItemButton } from "@mui/material";

import { PageTitle } from "src/components/layout";
import { LabelSummary } from "src/components/display";

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
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        <Grid xs={4}>
          <ListItemButton 
            onClick={prevEvent}
            disabled={currentEventIndex === 0 || allEvents.length === 0}
            sx={{ textAlign: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
          >
            <Box sx={{ textAlign: 'center', width: '100%' }}>
              <Box sx={{ fontSize: '0.85rem' }}>הקודם</Box>
              {prevEventName && (
                <>
                <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                  {prevEventName}
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                  {/* @ts-expect-error - inHebrew accepts string format parameters */}
                  {inHebrew(prevEventDay, 'Dms')}
                </Typography>
              </>
              )}
            </Box>
          </ListItemButton>
        </Grid>
        <Grid xs={4}>
          <PageTitle
            primary={selectedEvent.event_name}
            secondary={`יום ${hebDay}`}
          />
        </Grid>
        <Grid xs={4}>
          <ListItemButton 
            onClick={nextEvent}
            disabled={currentEventIndex === allEvents.length - 1 || allEvents.length === 0}
            sx={{ textAlign: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
          >
            <Box sx={{ textAlign: 'center', width: '100%' }}>
              <Box sx={{ fontSize: '0.85rem' }}>הבא</Box>
              {nextEventName && (
                <>
                <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                  {nextEventName}
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                  {/* @ts-expect-error - inHebrew accepts string format parameters */}
                  {inHebrew(nextEventDay, 'Dms')}
                </Typography>
              </>
              )}
            </Box>
          </ListItemButton>
        </Grid>
      </Grid>
    </Box>
  );
}
