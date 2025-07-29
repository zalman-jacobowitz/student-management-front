import { useQuery } from "@tanstack/react-query";

import { List, ListItemButton, ListItemText, Stack, Typography } from "@mui/material";

import { inHebrew } from "src/utils/hebrew/getter";

import { apiListEvents } from "src/actions/list_of_events";

import { InsertFormEventLoading } from "./insert-form-past-loading";

interface InsertFormPastEventsProps {
  students_ids: string[];
  dialogPrevEvents?: any;
  methods?: any;
  reset?: (option: any) => void;
}

export function InsertFormPastEvents({students_ids, dialogPrevEvents, methods, reset}: InsertFormPastEventsProps) {

  const listOfTimes = useQuery(apiListEvents(students_ids))

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
              selected={option.event === methods.watch('event') && option.day === methods.watch('day')}
              key={option.event} 
              onClick={() => {
                reset(option)
                dialogPrevEvents.onFalse(); 
            }}
          >
            <ListItemText
              primary={option.event}
              secondary={inHebrew(option.day, true)}
            />
          </ListItemButton>
        ))}
      </List>
      {listOfTimes.data?.length === 0 && (
        <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
          אין אירועים קודמים
        </Typography>
      )}
      {listOfTimes.isLoading && <InsertFormEventLoading/>}
    </Stack>
    
  ) 
}
