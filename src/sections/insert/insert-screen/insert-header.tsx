
import { Box } from "@mui/material";

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
  const selectedEvent = useInsertStore(state => state.selectedEvent);

  const hebDay = inHebrew(selectedEvent.day, 'Dms')
  const data = Object.values(watch());
  console.log('selectedEvent.day:', selectedEvent.day)
  return (
    <Box sx={{ mb: 2, textAlign: 'center' }}>
      <PageTitle
        primary={selectedEvent.event_name}
        secondary={`יום ${hebDay}`}
      />
      <LabelSummary
        labels_summary={LABEL_SUMMARY}
        data={data}
      />
    </Box>
  );
}
