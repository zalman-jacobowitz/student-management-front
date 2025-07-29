import { useEffect, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@mui/material";

import { useBoolean } from "src/hooks/use-boolean";
import { updateData } from "src/hooks/use-update";

import { DashboardContent } from "src/layouts/dashboard";

import { dataStudentsEventUpdate } from "src/actions/data_students_event";

import { EmptyContent } from "src/components/empty-content";

import { formValues, insertTamplate } from "../functions";
import useInsertStore from "../insert-state";
import { InsertFilters } from "../components/filters";
import { InsertList } from "./insert-list";
import { InsertToolbar } from "./insert-toolbar";
import { InsertListHeader } from "./insert-header";
import { useLoadCurrentData } from "./functions-insert-load-data";

interface InsertListViewProps {
  infoStudents: any[];
  infoColumns: any[];
}

export function InsertListView({infoStudents, infoColumns}: InsertListViewProps) {
  const {currentData, selectedEvent} = useInsertStore(state => state);

  const queryClient = useQueryClient();
  
  const { mutateAsync } = useMutation(dataStudentsEventUpdate({queryClient}))
  
  const tamplateData = insertTamplate(infoStudents, selectedEvent);

  const defaultValues = formValues(tamplateData);
  
  const methods = useForm({defaultValues});
  
  const filterDrawer = useBoolean();

  const { reset, watch} = methods;

  useLoadCurrentData(reset, tamplateData);

  
  const previousData = useInsertStore(state => state.previousData);
  useEffect(() => {
    if (!previousData.length) {
      reset(formValues(currentData))
    }
  }, [previousData.length, reset, currentData])

  const handleUpdate = useCallback(async (data: any, mode = 'update')=>{
    await updateData({
      data,
      mode,
      mutateAsync
    })
  }, [mutateAsync])

  const [filters, setFilters] = useState<{ [key: string]: any }>({});
  
  const handleFilter = (data: any) => {
    setFilters((prev) => ({...data}));
  }

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
