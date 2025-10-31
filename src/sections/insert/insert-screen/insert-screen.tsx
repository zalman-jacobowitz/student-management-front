import { useForm } from "react-hook-form";
import { useEffect, useCallback, useState } from "react";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import { Button } from "@mui/material";

import { updateData } from "src/hooks/use-update";
import { useBoolean } from "src/hooks/use-boolean";

import { DashboardContent } from "src/layouts/dashboard";
import { apiDataStudentsEvent, dataStudentsEventUpdate } from "src/actions/data_students_event";

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
import { mergeWithStudents } from "src/sections/exceptions/utils";



function useInsertForm() {
  
  const infoStudents = useSuspenseQuery(apiInfoStudents()).data;
  const infoColumns = useSuspenseQuery(apiInfoColumns()).data;
  // מקבל את נתוני הרישום - ואת פרטי הסדר
  const {  selectedEvent } = useInsertStore();
  
  // פונקציית עידכון התלמידים
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation(dataStudentsEventUpdate({queryClient, tamplateData: selectedEvent})); 
  
  // טכניקות של react-hook-form לניהול הטופס
  const methods = useForm();
  const { reset, watch } = methods;

  const crnt = useSuspenseQuery(apiDataStudentsEvent());
  console.log('crnt.data in useInsertForm: ', crnt.data);
  const currentData = mergeWithStudents(infoStudents, crnt.data, infoColumns);
  console.log('currentData in useInsertForm: ', currentData);
  useEffect(() => {
    reset(formValues(crnt.data))
  }, [selectedEvent]);

  const handleUpdate = useCallback(async (data: any, mode = 'update')=>{
    await updateData({
      data: {data, eventDetails: selectedEvent},
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
    infoColumns,
    infoStudents,
    currentData,
    reset,
    watch
  } = useInsertForm();
  
  const dialogDelay = useBoolean();
  const exceptionDialog = useBoolean();


  const summaryMode = useBoolean();

  const [selectedLabel, selectLabel] = useState({});

  useEffect(() => {
   if (!dialogDelay.value){
    selectLabel({})
  }
  }, [dialogDelay.value])

  const [sortBy, setSortBy] = useState<string | null>(null);

  const [filters, setFilters] = useState<{ [key: string]: any }>({});
  
  const handleFilters = useCallback((key: string, value: any) => {
    setFilters((prev) => ({...prev, [key]: value}));
  }, []);


  return (
    <DashboardContent sx={{}} disablePadding={false}>

      <InsertListHeader currentData={currentData} watch={watch}/>

      <InsertToolbar
        exceptionDialog={exceptionDialog}
        selectedLabel={selectedLabel}
        dialogDelay={dialogDelay} 
        handleDelete={(data: any)=> handleUpdate(data, 'delete')}
        currentData={currentData}
        setSortBy={setSortBy}
        reset={reset}
        handleFilter={handleFilters}
        filters={filters}
        summaryMode={summaryMode}
        infoColumns={infoColumns}
        infoStudents={infoStudents}
      />

      {!currentData.length && <EmptyContent title="לא נמצאו תלמידים" filled sx={{ py: 10 }} imgUrl="" action={null} slotProps={{}} description="" />}
      
      <InsertList
        infoColumns={infoColumns}
        summaryMode={summaryMode.value}
        selectLabel={selectLabel}
        dialogDelay={dialogDelay}
        exceptionDialog={exceptionDialog}
        currentData={applyFilters(currentData, filters, sortBy)}
        methods={methods}
        handleUpdate={handleUpdate}
        filters={filters}
      />
    </DashboardContent>
);
}


function applyFilters(oldData: any[], filters: { [key: string]: any }, sortBy: string | null) {
  
  const { data } = filters;
  let filteredData = [...oldData];
  console.log('applying filters:', filters);
  if (data) {

    filteredData = filteredData.filter((item) => {
      if (data === 'all') return true;
      if (data === 'true') return item.data === 1;
      if (data === 'false') return item.data === 0;
      if (data === 'delayed') return item.delay;
      if (data === 'exception') return item.exception;
      return true;
    });
  }
  if (sortBy) {
    if (sortBy === 'up') {
      filteredData.sort((a, b) => a.primary.localeCompare(b.primary));
    } else if (sortBy === 'down') {
      filteredData.sort((a, b) => b.primary.localeCompare(a.primary));
    } else if (sortBy === 'name') {
      filteredData.sort((a, b) => a.primary.localeCompare(b.primary));
    }
  }

  return filteredData;
  
}