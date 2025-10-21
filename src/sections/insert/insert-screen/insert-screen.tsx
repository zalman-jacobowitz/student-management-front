import { useForm } from "react-hook-form";
import { useEffect, useCallback, useState } from "react";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import { Button } from "@mui/material";

import { updateData } from "src/hooks/use-update";
import { useBoolean } from "src/hooks/use-boolean";

import { DashboardContent } from "src/layouts/dashboard";
import { dataStudentsEventUpdate } from "src/actions/data_students_event";

import { EmptyContent } from "src/components/empty-content";

import { InsertList } from "./insert-list";
import useInsertStore from "../insert-state";
import { InsertToolbar } from "./insert-toolbar";
import { InsertListHeader } from "./insert-header";
import { InsertFilters } from "../components/filters";
import { formValues, insertTamplate } from "../functions";
import { useLoadCurrentData } from "./functions-insert-load-data";
import { apiInfoStudents } from "src/actions/info_students";
import { apiInfoColumns } from "src/actions/info_columns";


function useInsertForm() {
  
  const infoStudents = useSuspenseQuery(apiInfoStudents()).data;
  
  const infoColumns = useSuspenseQuery(apiInfoColumns()).data;
  

  // מקבל את נתוני הרישום - ואת פרטי הסדר
  const { currentData , selectedEvent } = useInsertStore();

  // פונקציית עידכון התלמידים
  const queryClient = useQueryClient();
  
  const { mutateAsync } = useMutation(dataStudentsEventUpdate({queryClient, tamplateData: selectedEvent})); 
  
  // תבנית הכנסת נתונים באם לא התבצע רישום לסדר זה
  const tamplateData = insertTamplate(infoStudents, selectedEvent);

  // ערכי ברירת מחדל לטופס - מבוסס על תבנית הכנסת הנתונים
  const defaultValues = formValues(tamplateData);
  
  // טכניקות של react-hook-form לניהול הטופס
  const methods = useForm({defaultValues});
  const { reset, watch} = methods;

  // טעינת נתוני הרישום הנוכחיים או התבנית במידה ואין רישום קיים
  useLoadCurrentData(reset, tamplateData);

  // נתוני רישום קודמים להדבקה - במקרה הצורך
  const previousData = useInsertStore(state => state.previousData);
  
  useEffect(() => {
    if (!previousData.length) {
      reset(formValues(currentData))
    }
  }, [previousData.length, reset, currentData])


  // הפונקציה שמבצעת את העידכון בפועל
  const handleUpdate = useCallback(async (data: any, mode = 'update')=>{
    await updateData({
      data,
      mode,
      mutateAsync
    })
  }, [mutateAsync])


  // פילטרים לתצוגת התלמידים
  const [filters, setFilters] = useState<{ [key: string]: any }>({});
  
  const handleFilter = (data: any) => {
    setFilters((prev) => ({...data}));
  }



  return {
    methods,
    handleUpdate,
    handleFilter,
    filters,
    infoColumns,
    infoStudents,
    currentData,
    reset,
    watch
}
}


export function InsertListView({}) {
  const {
    methods,
    handleUpdate,
    handleFilter,
    filters,
    infoColumns,
    infoStudents,
    currentData,
    reset,
    watch
  } = useInsertForm();

  return (
    <DashboardContent sx={{}} disablePadding={false}>

      <InsertListHeader currentData={currentData} watch={watch}/>

      <InsertToolbar
        handleDelete={(data: any)=> handleUpdate(data, 'delete')}
        currentData={currentData}
        reset={reset}
        handleFilter={handleFilter}
        filters={filters}
        infoColumns={infoColumns}
        infoStudents={infoStudents}
      />

      {!currentData.length && <EmptyContent title="לא נמצאו תלמידים" filled sx={{ py: 10 }} imgUrl="" action={null} slotProps={{}} description="" />}
      
      <InsertList
        methods={methods}
        infoColumns={infoColumns}
        currentData={currentData}
        handleUpdate={handleUpdate}
        filters={filters}
      />


    </DashboardContent>
);
}
