
import { Box, Button } from "@mui/material";

import { Form, Field } from "src/components/hook-form";
import { ButtonGreen } from "src/components/button-green";

import useInsertStore from "../insert-state";
import { getDesc, descriptionColumns } from "../functions";
import { newApplyFilters } from "../components/filters";
import { useCallback } from "react";

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




export function InsertList({selectLabel,exceptionDialog, dialogDelay, currentData, methods, handleUpdate, filters }: InsertListProps) {
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
    console.table(toServer.map(e=>({נוכחות: e.data, איחור: e.delay, אישור: e.exception, student_id: e.student_id})))
    // if there is data from server.
    
    handleUpdate(toServer, 'update')
  };

  const handleOnClick = useCallback((type, details) =>{

    if (type === 'exception'){
      console.log('details: ', details)
      selectLabel(details)
      exceptionDialog.onTrue()
    }
    if (type === 'delay'){
      selectLabel({...details, students: [details]})
      dialogDelay.onTrue()
      
    }
  }, [])

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
          return (
            <Field.BoolianList
              key={student.student_id}
              name={student.student_id}
              color={enhancedStudent.color}
              icon={enhancedStudent.icon}
              label={enhancedStudent.label}
              tooltip={enhancedStudent.tooltip}
              onClick={()=>handleOnClick(enhancedStudent.type, student)}
              primary={student.primary}
              secondary={student.secondary}
            />
          );
        })}
        <ButtonGreen type="submit" data-testid="update-button" sx={{ mt: 2 }} onClick={() => {}} />

      </Box>
    </Form>
  );
}
