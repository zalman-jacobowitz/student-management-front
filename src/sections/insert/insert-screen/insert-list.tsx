
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Button, Card, CardContent, CardHeader, Chip, Grid, Tooltip, Typography, useTheme } from "@mui/material";

import { Form, Field } from "src/components/hook-form";
import { ButtonGreen } from "src/components/button-green";

import useInsertStore from "../insert-state";

import { newApplyFilters } from "../components/filters";
import { useCallback } from "react";
import { exportDataToCSV } from "src/utils/files/download-tamplate";
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
import { apiSummary } from "src/actions/summary";

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
  100: 'success',
  0: 'error',
  delayed: 'warning',
  exceptional: 'default',
};


const text = {
  exceptional: 'נעדר באישור',
  delayed: 'איחר',
  100: 'היה',
  0: 'חיסר',
}

const demoDataSummary = {
    "1313-R": {
        "2025-11-04": {
            "1": 100
        },
        "2025-11-05": {
            "1": 100,
            "2": 100
        },
        "2025-11-06": {
            "1": 100,
            "2": 100
        },
        "2025-11-08": {
            "1": 0
        },
        "2025-11-09": {
            "1": 0,
            "2": 0
        },
        "2025-11-14": {
            "2": 0
        }
    },
    "2673-C": {
        "2025-11-04": {
            "1": 100
        },
        "2025-11-05": {
            "1": 100,
            "2": 100
        },
        "2025-11-06": {
            "1": 100,
            "2": 100
        },
        "2025-11-08": {
            "1": 100
        },
        "2025-11-09": {
            "1": 100,
            "2": 100
        },
        "2025-11-14": {
            "2": 0
        }
    },
    "2836-H": {
        "2025-11-04": {
            "1": ""
        },
        "2025-11-05": {
            "1": "",
            "2": ""
        },
        "2025-11-06": {
            "1": "",
            "2": ""
        },
        "2025-11-08": {
            "1": ""
        },
        "2025-11-09": {
            "1": "",
            "2": ""
        },
        "2025-11-14": {
            "2": "100.0"
        }
    },
    "2914-J": {
        "2025-11-04": {
            "1": "0.0"
        },
        "2025-11-05": {
            "1": "100.0",
            "2": "100.0"
        },
        "2025-11-06": {
            "1": "100.0",
            "2": "0.0"
        },
        "2025-11-08": {
            "1": "0.0"
        },
        "2025-11-09": {
            "1": "0.0",
            "2": "100.0"
        },
        "2025-11-14": {
            "2": "100.0"
        }
    },
    "3120-F": {
        "2025-11-04": {
            "1": "100.0"
        },
        "2025-11-05": {
            "1": "100.0",
            "2": "100.0"
        },
        "2025-11-06": {
            "1": "100.0",
            "2": "0.0"
        },
        "2025-11-08": {
            "1": "0.0"
        },
        "2025-11-09": {
            "1": "0.0",
            "2": "100.0"
        },
        "2025-11-14": {
            "2": "100.0"
        }
    },
    "5233-Y": {
        "2025-11-04": {
            "1": "100.0"
        },
        "2025-11-05": {
            "1": "100.0",
            "2": "100.0"
        },
        "2025-11-06": {
            "1": "100.0",
            "2": "100.0"
        },
        "2025-11-08": {
            "1": "0.0"
        },
        "2025-11-09": {
            "1": "100.0",
            "2": "100.0"
        },
        "2025-11-14": {
            "2": "100.0"
        }
    },
    "6210-K": {
        "2025-11-04": {
            "1": "100.0"
        },
        "2025-11-05": {
            "1": "0.0",
            "2": "0.0"
        },
        "2025-11-06": {
            "1": "0.0",
            "2": "0.0"
        },
        "2025-11-08": {
            "1": "0.0"
        },
        "2025-11-09": {
            "1": "0.0",
            "2": "0.0"
        },
        "2025-11-14": {
            "2": "100.0"
        }
    },
    "6290-Q": {
        "2025-11-04": {
            "1": "0.0"
        },
        "2025-11-05": {
            "1": "0.0",
            "2": "0.0"
        },
        "2025-11-06": {
            "1": "100.0",
            "2": "0.0"
        },
        "2025-11-08": {
            "1": "0.0"
        },
        "2025-11-09": {
            "1": "0.0",
            "2": "100.0"
        },
        "2025-11-14": {
            "2": "0.0"
        }
    },
    "6465-K": {
        "2025-11-04": {
            "1": "100.0"
        },
        "2025-11-05": {
            "1": "100.0",
            "2": "100.0"
        },
        "2025-11-06": {
            "1": "100.0",
            "2": "100.0"
        },
        "2025-11-08": {
            "1": "0.0"
        },
        "2025-11-09": {
            "1": "100.0",
            "2": "100.0"
        },
        "2025-11-14": {
            "2": "0.0"
        }
    },
    "6748-U": {
        "2025-11-04": {
            "1": "100.0"
        },
        "2025-11-05": {
            "1": "0.0",
            "2": "0.0"
        },
        "2025-11-06": {
            "1": "0.0",
            "2": "100.0"
        },
        "2025-11-08": {
            "1": "0.0"
        },
        "2025-11-09": {
            "1": "0.0",
            "2": "100.0"
        },
        "2025-11-14": {
            "2": "0.0"
        }
    },
    "8893-Q": {
        "2025-11-04": {
            "1": "0.0"
        },
        "2025-11-05": {
            "1": "100.0",
            "2": "0.0"
        },
        "2025-11-06": {
            "1": "100.0",
            "2": "0.0"
        },
        "2025-11-08": {
            "1": "0.0"
        },
        "2025-11-09": {
            "1": "0.0",
            "2": "0.0"
        },
        "2025-11-14": {
            "2": "0.0"
        }
    },
    "9550-V": {
        "2025-11-04": {
            "1": "0.0"
        },
        "2025-11-05": {
            "1": "100.0",
            "2": "0.0"
        },
        "2025-11-06": {
            "1": "100.0",
            "2": "100.0"
        },
        "2025-11-08": {
            "1": "0.0"
        },
        "2025-11-09": {
            "1": "0.0",
            "2": "0.0"
        },
        "2025-11-14": {
            "2": "0.0"
        }
    }
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
      <Tooltip title={eventName} key={eventName}>
        <Chip
          key={eventName}
          size="small"
          label={`${text[status]} ב${eventName}`}
          tooltip={status}
          color={colorMap[status as keyof typeof colorMap]}
          variant="soft"
          sx={{ m: 0.3, p: 0 }}
        />

      </Tooltip>

    ))}
  </>
}
function eventAndDayFormat(text){
  const isDay = text.includes('-')
  if (isDay){
    return inHebrew(text, 'Dm')
  }
  return text
}

function convert(data) {
  const { columns, data: rows, index } = data;
  const result = {};

  // הכנה לכל סטודנט
  index.forEach(id => {
    result[id] = {};
  });

  columns.forEach(([day, event], colIndex) => {
    const key1 = eventAndDayFormat(day)
    const key2 = eventAndDayFormat(event)
    rows.forEach((row, rowIndex) => {
      const studentId = index[rowIndex];
      const value = row[colIndex];

      if (!result[studentId][key1]) result[studentId][key1] = {};
      result[studentId][key1][key2] = value;
    });
  });

  return result;
}

const getColorByStatus = (student) => {

  if (student.delay) {
    return { color: 'warning', label: 'איחר', icon: 'solar:check-circle-bold-duotone', type: 'delay', tooltip: 'התלמיד איחר' };
  }
  if (student.reason) {
    return { color: 'default', label: 'נעדר באישור', icon: 'solar:check-circle-bold-duotone', type: 'exceptional', tooltip: 'התלמיד נעדר באישור' };
  }
  if (Number(student.data)) {
    return { color: 'success', label: 'היה', icon: 'solar:check-circle-bold-duotone', type: 'present', tooltip: 'התלמיד היה נוכח' };
  }
  return { color: 'error', label: 'חיסר', icon: 'solar:check-circle-bold-duotone', type: 'absent', tooltip: 'התלמיד היה חסר' };
};


function presentage(arr){
  const len = arr.length;
  const is = arr.filter(e => e).length;

  return (is / len) * 100;
}


function SummaryMode({ student = {}, enhancedStudent = {}, summary = {} }: { children: React.ReactNode }) {
  const { color, label, icon, tooltip } = getColorByStatus(student);
  const SLabel = (
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
    <Card sx={{m: 1, boxShadow: (theme) => theme.customShadows.z8 }}>
      <CardHeader

        title={<Typography variant="subtitle1">{student.primary}</Typography>}
        avatar={

          <Box sx={{ position: 'relative' }}>
            <Avatar color={color} src="" alt="" sx={{ width: 48, height: 48, opacity: 0.7 }} />
            {SLabel}
          </Box>}

        subheader={<Typography variant="body2">{student.secondary}</Typography>}
        subheaderTypographyProps={{ color: 'success' }}
        sx={{ alignContent: 'center',  bgcolor: 'background.neutral', pb: 2 }}
      >

      </CardHeader>
      <CardContent>

        <Box sx={{ mb: 0, p: 0 }}>
          {Object.keys(summary).map(key => (
           <AccordionSummaryMode key={key} title={key} value={presentage(Object.values(summary[key]))}>
              <CountShows count={summary[key]} />
          </AccordionSummaryMode>
          ))}
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

function AccordionSummaryMode({ children, title, value }: { children: React.ReactNode, title: string, value: number }) {
  return (
    <Accordion>

      <AccordionSummary sx={{ width: '100%' }}>
        
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item xs={4}>
          <Typography variant="subtitle2" sx={{ p: 1 }}>
            {title}
          </Typography></Grid>
          <Grid item xs={8}>
          
          <RenderCell value={value} />
          
          </Grid>
          </Grid>
      </AccordionSummary>
      <AccordionDetails>
        {children}
      </AccordionDetails>

    </Accordion>
  )
}

function useLastEventsData() {
  const { selectedEvent } = useInsertStore(state => state);

  const lastEvents = useSuspenseQuery(apiListEvents());
  const allEventsData = {}
  const allDaysData = {}
  // 4 limit
  lastEvents.data.slice(0, 5).forEach((event) => {
    event.event = event.event_id;
    const eventData = useSuspenseQuery(apiDataStudentsEvent(event)).data;


    if (event.event_id === selectedEvent.event_id) {
      const textLabel = ` ${inHebrew(event.day, false, true)} | ${selectedEvent.event_name}`;
      allDaysData[textLabel] = [...eventData];
      allDaysData[textLabel].push(event);
    }
    allEventsData[`${event.event_name} | ${inHebrew(event.day, false, true)}`] = [...eventData];
  });

  return {
    event: transformEventsDataForCountShows(allEventsData),
    day: transformEventsDataForCountShows(allDaysData)
  };
}
  const sampleFormData = {
    events: ['1', '2'],
    start: '2025-11-01',
    end: '2025-11-30',
    group_by: ['day', 'event_name'],
    type: 'mean',
    days: [
      '2025-11-01',
      '2025-11-02',
      '2025-11-03',
      '2025-11-04',
      '2025-11-05',
      '2025-11-06',
      '2025-11-07',
      '2025-11-08',
      '2025-11-09',
      '2025-11-10',
      '2025-11-11',
      '2025-11-12',
      '2025-11-13',
      '2025-11-14'
    ]
  };
export function InsertList({ infoColumns, summaryMode, selectLabel, exceptionDialog, dialogDelay, currentData, methods, handleUpdate, filters }: InsertListProps) {
  // הכנה של ערכי ברירת מחדל

  const { summary } = useInsertStore();
  const summaryData = useSuspenseQuery(apiSummary(summary));
    console.log('convertedData: ', summaryData.data)
  const convertedData = Object.keys(summaryData.data).length ? convert(summaryData.data) : null;
  


  const { selectedEvent } = useInsertStore(state => state);

  const { handleSubmit } = methods;

  const onSubmit = (values: any) => {
    // כאן תוכל לשלוח את הערכים לשרת או להמשיך הלאה
    const toServer = Object.entries(values).map(([student_id, data]) => ({
      student_id,
      exception: currentData.find((item) => item.student_id === student_id)?.exception || '',
      data: Number(data),
      event: selectedEvent.event_id,
      day: selectedEvent.day,
      delay: currentData.find((item) => item.student_id === student_id)?.delay || ''

    }));
    // if there is data from server.

    handleUpdate(toServer, 'update')
  };



  const handleOnClick = useCallback((type, details, cData) => {

    if (type === 'exception') {
      const students = cData.filter((item) => item.exception_id === details.exception_id)
      console.table(cData);

      selectLabel({...details, students})
      exceptionDialog.onTrue()
    }
    if (type === 'delay') {
      selectLabel({ ...details, students: [details] })
      dialogDelay.onTrue()

    }
  }, [])

  const handleExportCSV = useCallback(() => {
    if (!convertedData) {
      console.warn('No converted data available for export');
      return;
    }

    // בניית headers דינמיים מהנתונים
    const headers = ['שם מלא'];
    const allDaysAndEvents = new Set<string>();

    // איסוף כל הימים והאירועים הייחודיים
    Object.entries(convertedData).forEach(([studentId, dayData]) => {
      Object.entries(dayData).forEach(([day, eventData]) => {
        Object.keys(eventData).forEach(event => {
          allDaysAndEvents.add(`${day} | ${event}`);
        });
      });
    });

    // הוספת כל היום-אירוע ל-headers
    const sortedDaysEvents = Array.from(allDaysAndEvents).sort();
    headers.push(...sortedDaysEvents);

    // בניית הנתונים לייצוא
    const exportData = currentData.map(student => {
      const studentSummary = convertedData[student.student_id];
      const row: any = {
        'שם מלא': student.primary
      };

      // מילוי הערכים לכל יום ואירוע
      sortedDaysEvents.forEach(dayEvent => {
        const [day, event] = dayEvent.split(' | ');
        if (studentSummary && studentSummary[day] && studentSummary[day][event] !== undefined) {
          row[dayEvent] = studentSummary[day][event];
        } else {
          row[dayEvent] = '';
        }
      });

      return row;
    });

    const timestamp = new Date().toISOString().split('T')[0];
    exportDataToCSV(exportData, headers, `students-summary-${timestamp}.csv`);
  }, [convertedData, currentData]);

  console.log('convertedData: ', convertedData);
  /*
  sample of convertedData:
  const convertedData = {
    "1149-N": {
        "י״ב כסלו": {
            "חסידות בוקר": 0,
            "תפילה": 0
        },
        "י״ג כסלו": {
            "חסידות בוקר": 0
        },
        "כ׳ כסלו": {
            "חסידות בוקר": 100
        }
    },
    "1152-K": {
        "י״ב כסלו": {
            "חסידות בוקר": 100,
            "תפילה": 100
        },
        "י״ג כסלו": {
            "חסידות בוקר": 100
        },
        "כ׳ כסלו": {
            "חסידות בוקר": 100
        }
    },
    "1571-L": {
        "י״ב כסלו": {
            "חסידות בוקר": 0,
            "תפילה": 0
        },
        "י״ג כסלו": {
            "חסידות בוקר": 0
        },
        "כ׳ כסלו": {
            "חסידות בוקר": 100
        }
    },
    "1607-H": {
        "י״ב כסלו": {
            "חסידות בוקר": 0,
            "תפילה": 0
        },
        "י״ג כסלו": {
            "חסידות בוקר": 0
        },
        "כ׳ כסלו": {
            "חסידות בוקר": 100
        }
    }
}
  */

  return (
    <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Box
        className="insert-list__container"
        data-testid="student-list"
        gap={1}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
      >
        {[...currentData].map((student) => {
          const enhancedStudent = enhanceStudentData(student);
          return !summaryMode ? (

            <Field.BoolianList
              key={student.student_id}
              name={student.student_id}
              color={enhancedStudent.color}
              
              icon={enhancedStudent.icon}
              label={enhancedStudent.label}
              tooltip={enhancedStudent.tooltip}
              onClick={() => handleOnClick(enhancedStudent.type, student, currentData)}
              primary={student.primary}
              secondary={student.secondary}
              
            />

          ) : convertedData ? (
            <SummaryMode
              key={student.student_id}
              student={student}
              enhancedStudent={enhancedStudent}
              summary={convertedData[student.student_id]}
            />) : null;
        })}

        <ButtonGreen
          type="submit"
          variant="extended"
          className="insert-list__submit-button"
          data-testid="update-button"
          sx={{ mt: 2 }}
          onClick={() => { }}
          icon="solar:upload-square-bold-duotone"
          text="עדכן נוכחות"
        />

      </Box>
    </Form>
  );
}
