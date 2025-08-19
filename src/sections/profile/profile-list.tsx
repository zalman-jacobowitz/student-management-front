
import { useForm } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Box, Button } from "@mui/material";

import { updateData } from "src/hooks/use-update";

import { dataStudentsEventUpdate } from "src/actions/data_students_event";

import { Form, Field } from "src/components/hook-form";
import { ButtonGreen } from "src/components/button-green";

import useInsertStore from "../insert-state";
import { newApplyFilters } from "../components/filters";
import { getDesc, descriptionColumns } from "../functions";
import { inHebrew } from "src/utils/hebrew/getter";

interface InsertListProps {
  methods: any;
  infoColumns: any[];
  currentData: any[];
  filters: {
    [key: string]: any;
  };
  handleUpdate: (data: any, mode?: string) => void;
}






export function ProfileList({ methods, currentData, handleUpdate, filters }: InsertListProps) {
  // הכנה של ערכי ברירת מחדל

  console.log({currentData})
  const { handleSubmit } = methods;

  const onSubmit = (values: any) => {

    // כאן תוכל לשלוח את הערכים לשרת או להמשיך הלאה
    const toServer = Object.entries(values).map(([student_id, data]) => ({
        student_id,
        data: Number(data) === 1
    }));
    
    handleUpdate(toServer, 'update')
  };

  const dataFiltered = currentData
  
  
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
        {dataFiltered.map((event) => {
          const enhancedStudent = {}
          return (
            <Field.BoolianList
              key={`${event.event}-${event.day}`}
              name={`${event.event}-${event.day}`}
              color={enhancedStudent.color}
              icon={enhancedStudent.icon}
              label={enhancedStudent.label}
              tooltip={enhancedStudent.tooltip}
              primary={inHebrew(event.day, true)}
              secondary={event.event_name}
            />
          );
        })}
        <ButtonGreen type="submit" data-testid="update-button" sx={{ mt: 2 }} onClick={() => {}} />

      </Box>
    </Form>
  );
}

export function formValues(tamplateData: any[]): Record<string, boolean> {
  return Object.fromEntries(tamplateData.map((item) => [`${item.event}-${item.day}`, !!Number(item.data)]))
}

export function ProfileListView({currentData}) {

  const queryClient = useQueryClient();
  
  const { mutateAsync } = useMutation(dataStudentsEventUpdate({queryClient}))

  const defaultValues = formValues(currentData);
  console.log({defaultValues})
  const methods = useForm({defaultValues});
  
  
  const { reset, watch} = methods;

  
  useEffect(() => {
      reset(formValues(currentData))
  }, [currentData])

  const handleUpdate = useCallback(async (data: any, mode = 'update')=>{
    await updateData({
      data,
      mode,
      mutateAsync
    })
  }, [mutateAsync])

  const [filters, setFilters] = useState<{ [key: string]: any }>({});
  return <ProfileList methods={methods} currentData={currentData} handleUpdate={handleUpdate} filters={filters} />;
}