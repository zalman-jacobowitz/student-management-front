
import { Avatar, Box, Button, Card, CardContent, CardHeader, Chip, Tooltip, Typography } from "@mui/material";

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
import { inHebrew } from "src/utils/hebrew/getter";
import { stat } from "fs";

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

  const colorMap = {
    true: 'success',
    false: 'error',
    delayed: 'warning',
    exceptional: 'default',
  };


  const text = {
    exceptional: 'נעדר באישור',
    delayed: 'איחר',
    true: 'היה',
    false: 'חיסר',
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

  return <>
      {Object.entries(count).map(([eventName, status]) => (
        <Tooltip title={eventName.split(' | ')[1]} key={eventName}>
            <Chip
              key={eventName}
              size="small"
              label={`${text[status]} ב${eventName.split(' | ')[0]}`}
              tooltip={eventName}
              color={colorMap[status as keyof typeof colorMap]}
              variant="soft"
              sx={{ m: 0.3, p:0 }}
            />
            
        </Tooltip>

      ))}
  </>
}


const getColorByStatus = (student) => {
  
  if (student.delay) {
    return {color: 'warning', label: 'איחר', icon: 'solar:check-circle-bold-duotone', type: 'delay', tooltip: 'התלמיד איחר'};
  }
  if (student.reason) {
    return {color: 'default', label: 'נעדר באישור', icon: 'solar:check-circle-bold-duotone', type: 'exceptional', tooltip: 'התלמיד נעדר באישור'};
  }
  if (Number(student.data)) {
    return {color: 'success', label: 'היה', icon: 'solar:check-circle-bold-duotone', type: 'present', tooltip: 'התלמיד היה נוכח'};
  }
  return {color: 'error', label: 'חיסר', icon: 'solar:check-circle-bold-duotone', type: 'absent', tooltip: 'התלמיד היה חסר'};
};

function SummaryMode({ student = {}, enhancedStudent = {}, events = [], days = [] }: { children: React.ReactNode }) {
  const { color, label, icon, tooltip } = getColorByStatus(student);
  const SLabel =  (
    <Tooltip title={tooltip}>
      <Label
        color={color || 'default'}
        variant='filled'
        sx={{
          bottom: -10,
          px: 0.5,
          left: '50%',
          transform: 'translateX(-50%)',
          height: 20,
          position: 'absolute',
          borderRadius: 1,
          opacity: 0.7,
        }}
      >
        <Iconify icon={icon} />
        {label}
      </Label>
    </Tooltip>
  );

  return (
    <Card variant="outlined" sx={{bgcolor: 'background.neutral'}}>
      <CardHeader

        title={<Typography variant="h6">{student.primary}</Typography>}
        avatar={
          
          <Box sx={{ position: 'relative' }}>
            <Avatar color={color}  src="" alt="" sx={{ width: 48, height: 48, opacity: 0.7 }}  />
            {SLabel}
          </Box>}

        subheader={<Typography>{student.secondary}</Typography>}
        subheaderTypographyProps={{color: 'success'}}
        sx={{ alignContent: 'center', bgcolor: 'background.neutral' }}
      >

      </CardHeader>
      <CardContent>
        <Box sx={{ mb: 2, p: 1 }}>
        <CountShows count={events} />
        </Box>
        <Box sx={{ mb: 2, p: 1 }}>
        <CountShows count={days} />
        </Box>
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
      if (student.delay_id || student.delay) {
          // יש איחור
          status = 'delayed';
      } 
      else if (student.data === 1) {
        // נוכחות
        status = true;
      }
      else if (student.data === 0) {
      // עדר
        status = false;
      }
    
      if (student.exception_id || student.exception) {
          // יש אישור
          status = 'exceptional';
        }
      

      result[student.student_id][eventName] = status;
    });
  });

  return result;
}

function useLastEventsData() {
  const { selectedEvent } = useInsertStore(state => state);

  const lastEvents = useSuspenseQuery(apiListEvents());
  const allEventsData = {}
  const allDaysData = {}
  // 4 limit
  lastEvents.data.slice(0, 3).forEach((event) => {
        event.event = event.event_id; 
    const eventData = useSuspenseQuery(apiDataStudentsEvent(event)).data;


    if (event.event_id === selectedEvent.event_id) {
      const textLabel = ` ${inHebrew(event.day, false, true)} | ${selectedEvent.event_name}`;
      allDaysData[textLabel] = [...eventData];
      allDaysData[textLabel].push(event);
    }
    allEventsData[`${event.event_name} | ${inHebrew(event.day, false, true)}`] = [...eventData];
  });

  return  {
    event: transformEventsDataForCountShows(allEventsData),
    day: transformEventsDataForCountShows(allDaysData)
  };
}

export function InsertList({ infoColumns, summaryMode, selectLabel, exceptionDialog, dialogDelay, currentData, methods, handleUpdate, filters }: InsertListProps) {
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
    // if there is data from server.

    handleUpdate(toServer, 'update')
  };

  const handleOnClick = useCallback((type, details) => {

    if (type === 'exception') {
      selectLabel(details)
      exceptionDialog.onTrue()
    }
    if (type === 'delay') {
      selectLabel({ ...details, students: [details] })
      dialogDelay.onTrue()

    }
  }, [])


  const lastEventsData = useLastEventsData();
  


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

          ) : <SummaryMode
                key={student.student_id}
                student={student}
                enhancedStudent={enhancedStudent}
                events={lastEventsData.event[student.student_id]}
                days={lastEventsData.day[student.student_id]} />;
            })}
        <ButtonGreen type="submit" data-testid="update-button" sx={{ mt: 2 }} onClick={() => { }} />

      </Box>
    </Form>
  );
}
