import { useQuery } from "@tanstack/react-query";

import { List, ListItemButton, ListItemText, Stack, Typography } from "@mui/material";

import { inHebrew } from "src/utils/hebrew/getter";

import { apiListEvents } from "src/actions/list_of_events";

import { LoadingScreen } from "src/components/loading-screen";

interface InsertFormPastEventsProps {
  students_ids?: string[];
  dialogPrevEvents?: any;
  methods?: any;
  reset?: (option: any) => void;
  listOfTimes?: any;
}

export function InsertFormPastEvents({listOfTimes, dialogPrevEvents, methods, reset}: InsertFormPastEventsProps) {


  return (
    
      <Stack sx={{ maxHeight: 300, overflow: 'auto' }}>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
          נמצאו 
  <span data-testid="prev-events-count"> {listOfTimes.data?.length} </span>
           אירועים קודמים
        </Typography>
        <List dense data-testid="event-list">
          {listOfTimes.data?.map((option: any) => (
            <ListItemButton
              data-testid="event-list-item" 
              selected={option.event_id === methods.watch('event') && option.day === methods.watch('day')}
              key={option.event} 
              onClick={() => {
                reset({day: option.day, event: option.event_id})
                dialogPrevEvents.onFalse(); 
            }}
          >
            <ListItemText
              primary={`${inHebrew(option.day, 'Dms')} (${inHebrew(option.day, true, true)})`}
              secondary={`${option.event_name} (${option.event_start} - ${option.event_end})`}
            />
          </ListItemButton>
        ))}
      </List>
      {listOfTimes.data?.length === 0 && (
        <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
          אין אירועים קודמים
        </Typography>
      )}
      {listOfTimes.isLoading && <LoadingScreen/>}
    </Stack>
    
  ) 
}
