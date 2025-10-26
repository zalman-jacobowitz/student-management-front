
import { Avatar, Box, Button, Card, CardContent, CardHeader, Tooltip, Typography } from "@mui/material";

import { Form, Field } from "src/components/hook-form";
import { ButtonGreen } from "src/components/button-green";

import useInsertStore from "../insert-state";
import { getDesc, descriptionColumns } from "../functions";
import { newApplyFilters } from "../components/filters";
import { useCallback } from "react";
import { ProgressBar } from "src/components/progress-bar";
import { RenderCell } from "src/sections/summary/summary-datagrid-view";
import { Label } from "src/components/label";
import { Iconify } from "src/components/iconify/iconify";
import { IconButton } from "yet-another-react-lightbox";
import { GridMoreVertIcon } from "@mui/x-data-grid";
import { useSuspenseQuery } from "@tanstack/react-query";
import { apiDataStudentsEvent } from "src/actions/data_students_event";
import { apiListEvents } from "src/actions/list_of_events";

interface InsertListProps {
  methods: any;
  filters: {
    [key: string]: any;
  };
  handleUpdate: (data: any, mode?: string) => void;
}


const checkByType = (value: any, filterValue: string) => {
  if (typeof filterValue === 'boolean') {
    return value === filterValue;
  }
  if (typeof filterValue === 'number') {
    return value.includes(Number(filterValue));
  }
  if (typeof filterValue === 'string') {
    return value.startsWith(filterValue);
  }
  if (Array.isArray(filterValue)) {
    return value.some((item: any) => item.includes(String(filterValue)));
  }
  return false;
}


const applyFilters = (data: any[], filters: { [key: string]: any }) =>
  data.filter((student) =>
    Object.entries(filters).every(([key, value]) => {
      if (value) {
        return checkByType(student[key], value);
      }
      return true;
    })
  );

function enhanceStudentData(student) {
  let color = '';
  let label = '';
  let icon = '';
  let tooltip = '';
  let type = ''

  if (student.delay) {
    type = 'delay'
    color = 'warning';
    label = `${student.delay_minutes} דק'`;
    icon = 'solar:alarm-bold-duotone';
    tooltip = student.arrival_time || '';


  } else if (student.reason) {
    type = 'exception'
    color = 'default';
    label = 'אישור';
    icon = 'solar:clipboard-check-bold-duotone';
    tooltip = student.reason || '';
  }

  return {
    ...student,
    color,
    label,
    icon,
    tooltip,
    type
  };
}


function CountShows({ count }: {}) {
  /*
  מציג את האירועים עם צבע אייקון לפי מצב נוכחות
  בזה אחר זה ללא כיתוב של האירוע אלא רק הTOLLTIP
  לדוגמה:
  const count = {
    'event1': true,
    'event2': false,
    'event3': 'delayed',
    ... 
  }
  */
  const iconMap = {
    exceptional: 'solar:alert-circle-bold-duotone',
    delayed: 'solar:check-circle-bold-duotone',
    true: 'solar:check-circle-bold-duotone',
    false: 'solar:check-circle-bold-duotone',
  };

  const colorMap = {
    true: 'success',
    false: 'error',
    delayed: 'warning',
    exceptional: 'default',
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
      {Object.entries(count).map(([eventName, status]) => (
        <Tooltip key={eventName} title={eventName}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 0.0,
            }}
          >

            <Label
              color={colorMap[status as keyof typeof colorMap]}
              variant="soft"
              sx={{ ml: 0.5 }}>
              {eventName}
            </Label>
          </Box>
        </Tooltip>
      ))}
    </Box>
  );
}


   


function SummaryMode({ student = {}, enhancedStudent = {}, data={} }: { children: React.ReactNode }) {
  const { color, label, icon, tooltip } = enhancedStudent;
  
  const SLabel = icon && label && (
    <Tooltip title={tooltip}>
      <Label
        color={color}
        variant='filled'
        sx={{
          bottom: -10,
          px: 0.5,
          left: '50%',
          transform: 'translateX(-50%)',
          height: 20,
          position: 'absolute',
          borderRadius: 1,
          opacity: 0.6,
        }}
      >
        <Iconify icon={icon} />
        {label}
      </Label>
    </Tooltip>
  );

  return (
    <Card variant="outlined">
      <CardHeader
        title={student.primary}
        avatar={
          <Box sx={{ position: 'relative' }}>
            <Avatar  src="" alt="" sx={{ width: 48, height: 48 }} />
            {SLabel}
          </Box>}

        subheader={student.secondary}
        sx={{ alignContent: 'center' }}
      >

      </CardHeader>
      <CardContent>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            אחרונים: 
          </Typography>
          <CountShows count={data} />
      </CardContent>

    </Card>
  );
}


function transformEventsDataForCountShows(allEventsData: Record<string, any[]>) {
  /*
  הופכת את נתוני ה-API לפורמט המתאים ל-CountShows
  מחזירה אובייקט בו כל student_id ממופה לאובייקט עם שם אירוע ומצבו
  לדוגמה:
  {
    '2207-J': {
      'גמרא': 'exceptional',  // יש אישור
      'מנחה': 'exception',    // נוכחות עם אישור
      'סדר א': false          // עדר
    }
  }
  */
  const result: Record<string, Record<string, any>> = {};

  Object.entries(allEventsData).forEach(([eventName, students]) => {
    students.forEach((student: any) => {
      if (!result[student.student_id]) {
        result[student.student_id] = {};
      }

      // קביעת המצב לפי הנתונים
      let status: any = false;

      if (student.data === 1) {
        // נוכחות
        status = true;
      } else if (student.data === 0) {
      // עדר
      
      
      if (student.exception_id || student.exception) {
          // יש אישור
          status = 'exceptional';
        } 
      if (student.delay_id || student.delay) {
          // יש איחור
          status = 'delayed';
        } else {
          // עדר ללא הסבר
          status = false;
        }
      }

      result[student.student_id][eventName] = status;
    });
  });

  return result;
}

function useLastEventsData() {
  const lastEvents = useSuspenseQuery(apiListEvents());
  const allEventsData = {}
  lastEvents.data.forEach((event) => {
    console.log('event: ', event);
    event.event = event.event_id; // הוספת שדה event כדי להתאים לפונקציה
    allEventsData[event.event_name] = useSuspenseQuery(apiDataStudentsEvent(event)).data;
  });

  return transformEventsDataForCountShows(allEventsData);
}

export function InsertList({ summaryMode, selectLabel, exceptionDialog, dialogDelay, currentData, methods, handleUpdate, filters }: InsertListProps) {
  // הכנה של ערכי ברירת מחדל

  const { selectedEvent } = useInsertStore(state => state);

  const { handleSubmit } = methods;

  const onSubmit = (values: any) => {
    // כאן תוכל לשלוח את הערכים לשרת או להמשיך הלאה
    const toServer = Object.entries(values).map(([student_id, data]) => ({
      student_id,
      exception: currentData.find((item) => item.student_id === student_id)?.exception_id || '',
      data: Number(data),
      event: selectedEvent.event,
      day: selectedEvent.day,
      delay: currentData.find((item) => item.student_id === student_id)?.delay || ''

    }));
    console.table(toServer.map(e => ({ נוכחות: e.data, איחור: e.delay, אישור: e.exception, student_id: e.student_id })))
    // if there is data from server.

    handleUpdate(toServer, 'update')
  };

  const handleOnClick = useCallback((type, details) => {

    if (type === 'exception') {
      console.log('details: ', details)
      selectLabel(details)
      exceptionDialog.onTrue()
    }
    if (type === 'delay') {
      selectLabel({ ...details, students: [details] })
      dialogDelay.onTrue()

    }
  }, [])


  const lastEventsData = useLastEventsData();
  

  const dataFiltered = newApplyFilters(currentData, filters)

  return (
    <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Box
        data-testid="student-list"
        gap={1}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
      >
        {currentData.map((student) => {
          const enhancedStudent = enhanceStudentData(student);
          return !summaryMode ? (

            <Field.BoolianList
              key={student.student_id}
              name={student.student_id}
              color={enhancedStudent.color}
              icon={enhancedStudent.icon}
              label={enhancedStudent.label}
              tooltip={enhancedStudent.tooltip}
              onClick={() => handleOnClick(enhancedStudent.type, student)}
              primary={student.primary}
              secondary={student.secondary}
            />

          ) : <SummaryMode key={student.student_id} student={student} enhancedStudent={enhancedStudent} data={lastEventsData[student.student_id]} />;
        })}
        <ButtonGreen type="submit" data-testid="update-button" sx={{ mt: 2 }} onClick={() => { }} />

      </Box>
    </Form>
  );
}
