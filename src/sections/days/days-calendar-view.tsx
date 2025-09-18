import { Suspense, useState } from "react";
import { useQuery, useSuspenseQueries } from "@tanstack/react-query";
import { Box, Typography, Chip } from "@mui/material";

import { apiDays } from "src/actions/days";
import { apiTemplates } from "src/actions/templates";
import { LoadingScreen } from "src/components/loading-screen";
import { HebrewCalendarView } from "src/components/hebrew-calendar/hebrew-calendar-view";
import { DayDialog } from "./days-edit-steps";
import { apiListEvents } from "src/actions/list_of_events";
import { apiInfoStudents } from "src/actions/info_students";

function eventsTemplatesByReduce(templates) {
  return Object.values(
    templates.reduce((acc, cur) => {
      const { template_id, template_name, client, ...event } = cur;
      if (!acc[template_id]) {
        acc[template_id] = { template_id, template_name, client, events: [] };
      }
      acc[template_id].events.push(event);
      return acc;
    }, {})
  );
}

function joinDaysWithTemplates(days, templates) {
  const templatesMap = templates.reduce((acc, template) => {
    acc[template.template_id] = template;
    return acc;
  }, {});

  return days.map(day => ({
    ...day,
    template_name: templatesMap[day.template_id]?.template_name || 'לא נמצא'
  }));
}

function TemplateDisplayComponent({ templateName, onClick }) {
  console.log('templateName', templateName);
  return (
    <Chip
      label={templateName}
      size="small"
      color={templateName === 'לא נמצא' ? 'default' : 'primary'}
      variant="outlined"
      onClick={onClick}
      sx={{ 
        fontSize: '0.7rem', 
        height: '20px',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'primary.light',
          color: 'white'
        }
      }}
    />
  );
}

function DaysCalendarMainView() {
  const [selectedDate, setSelectedDate] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);

  const [daysQuery, templatesQuery] = useSuspenseQueries({
    queries: [
      apiDays(),
      apiTemplates()
    ]
  });

  const infoStudents = useQuery(apiInfoStudents());
  const students_ids = infoStudents.data?.map(student => student.student_id) || [];
  const listOfTimesQuery = useQuery(apiListEvents(students_ids))
  console.log('listOfTimesQuery', listOfTimesQuery.data);

  const days = daysQuery.data;
  
  const templatesRaw = templatesQuery.data;
  const templates = eventsTemplatesByReduce(templatesRaw);
  const daysWithTemplates = joinDaysWithTemplates(days, templates);
  const mergedWirhPrevEvents = [...daysWithTemplates, ...(listOfTimesQuery.data || [])];
  console.log('mergedWirhPrevEvents: ', mergedWirhPrevEvents);

  const defaultDay = daysWithTemplates.find(day => day.day === 'default');
  
  const eventsData = mergedWirhPrevEvents.map(day => ({
    day: day.day, // Hebrew day name like "ראשון", "שני"
    component: (
      <TemplateDisplayComponent
        templateName={day.template_name}
        onClick={() => {
          setSelectedDay(day);
          setDialogOpen(true);
        }}
      />
    )
  }));

  const defaultDayEvents = (day) => (
      <TemplateDisplayComponent
        templateName={defaultDay.template_name || 'לא נמצא'}
        onClick={() => {

          setSelectedDay({...defaultDay, day, default: true});
          setDialogOpen(true);
        }}
      />
    )


  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
        לוח השנה - תצוגת ימים ותבניות
      </Typography>
      
      <HebrewCalendarView
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        eventsData={eventsData}
        defaultDayEvents={defaultDayEvents}
      />

      <DayDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        column={selectedDay}
      />
    </Box>
  );
}

export function DaysCalendarViewWrapper() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <DaysCalendarMainView />
    </Suspense>
  );
}