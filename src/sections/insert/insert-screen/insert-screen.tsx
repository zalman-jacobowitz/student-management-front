import { useForm } from "react-hook-form";
import { useEffect, useCallback, useState } from "react";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import { Box, Button, Card, CardActionArea, CardActions, CardContent, Divider, Stack, TextField, Typography } from "@mui/material";

import { updateData } from "src/hooks/use-update";
import { useBoolean } from "src/hooks/use-boolean";

import { DashboardContent } from "src/layouts/dashboard";
import { apiDataStudentsEvent, dataStudentsEventUpdate } from "src/actions/data_students_event";

import { EmptyContent } from "src/components/empty-content";

import { InsertList } from "./insert-list";
import useInsertStore from "../insert-state";
import { FabButton, InsertToolbar } from "./insert-toolbar";
import { InsertListHeader } from "./insert-header";
import { InsertFilters } from "../components/filters";
import { formValues, insertTemplate } from "../functions";
import { useLoadCurrentData } from "./functions-insert-load-data";
import { apiInfoStudents } from "src/actions/info_students";
import { apiInfoColumns } from "src/actions/info_columns";
import { mergeWithStudents } from "src/sections/exceptions/utils";
import { inHebrew } from "src/utils/hebrew/getter";
import { IconButton } from "yet-another-react-lightbox";
import { Iconify } from "src/components/iconify";



function useInsertForm() {

  const infoStudents = useSuspenseQuery(apiInfoStudents()).data;
  const infoColumns = useSuspenseQuery(apiInfoColumns()).data;
  // מקבל את נתוני הרישום - ואת פרטי הסדר
  const { selectedEvent } = useInsertStore();

  // פונקציית עידכון התלמידים
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation(dataStudentsEventUpdate({ queryClient, tamplateData: selectedEvent }));

  // טכניקות של react-hook-form לניהול הטופס
  const methods = useForm();
  const { reset, watch } = methods;

  const crnt = useSuspenseQuery(apiDataStudentsEvent());
  const currentData = mergeWithStudents(infoStudents, crnt.data, infoColumns);


  useEffect(() => {
    reset(formValues(crnt.data))
  }, [selectedEvent, crnt.data, reset]);

  const handleUpdate = useCallback(async (data: any, mode = 'update') => {
    console.table(data);

    await updateData({
      data: { data, eventDetails: selectedEvent },
      mode,
      mutateAsync
    })
  }, [mutateAsync, selectedEvent])


  // פילטרים לתצוגת התלמידים
  const [filters, setFilters] = useState<{ [key: string]: any }>({});

  const handleFilter = (data: any) => {
    setFilters((prev) => ({ ...data }));
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


export function InsertListView({ }) {
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
    if (!dialogDelay.value) {
      selectLabel({})
    }
  }, [dialogDelay.value])

  const [sortBy, setSortBy] = useState<string | null>(null);

  const [filters, setFilters] = useState<{ [key: string]: any }>({});

  const handleFilters = useCallback((filterDict: { [key: string]: any }) => {
    setFilters((prev) => ({ ...prev, ...filterDict }));
  }, []);


  const { selectedEvent, currentEventIndex, allEvents, nextEvent, prevEvent, onBack } = useInsertStore(state => state);



  // קבלת שם האירוע הקודם
  const prevEventName = currentEventIndex > 0 ? allEvents[currentEventIndex - 1]?.event_name : '';
  const prevEventDay = currentEventIndex > 0 ? allEvents[currentEventIndex - 1]?.day : '';

  // קבלת שם האירוע הבא
  const nextEventName = currentEventIndex < allEvents.length - 1 ? allEvents[currentEventIndex + 1]?.event_name : '';
  const nextEventDay = currentEventIndex < allEvents.length - 1 ? allEvents[currentEventIndex + 1]?.day : '';

  // WITH ICON
  const searchFilter = (
    
    <TextField
      fullWidth
      placeholder="חיפוש..."
      value={filters.search || ''}
      onChange={(e) => handleFilters({ search: e.target.value })}
      InputProps={{
        startAdornment: <Iconify icon="solar:magnifer-line-duotone" mr={1} width={20} style={{ ml: 8, color: 'text.disabled' }} />,
      }}
    />
  )

  return (
    <DashboardContent sx={{}} disablePadding={false} >
      <Card>
        {/* Three-Section Header Layout */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr 1fr',
            gap: 2,
            pt: 3,
            pl: 2,
            pr: 2,
            alignItems: 'center',
            justifyItems: 'center',
          }}
        >
          {/* Left Section - Previous Event Button */}

          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            {prevEventDay &&
              <FabButton
                icon=""

                subLabel={<Typography variant="h5" color="text.primary">סדר {prevEventName}</Typography>}
                label={<Typography variant="body2">{inHebrew(prevEventDay, 'Dm')}</Typography>}
                color="default"
                variant="outlinedExtended"
                onClick={prevEvent}
                testId="prev-event-fab"
                showSubLabel
                sizeMultiplier={7}
              >
                <Iconify icon="solar:alt-arrow-right-bold" width={24} sx={{ mr: 1, color: 'text.disabled' }} />
              </FabButton>
            }
          </Box>


          {/* Center Section - Event Title and Date */}


          <Box sx={{ textAlign: 'center', width: '100%' }}>
            <Typography variant="h3" sx={{ mb: 0 }}>
              סדר {selectedEvent.event_name}
            </Typography>
            <Typography variant="h6" color='text.secondary'>
              {inHebrew(selectedEvent.day, 'Dms')}
            </Typography>
          </Box>

          {/* Right Section - Next Event Button */}

          {nextEventDay &&
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <FabButton
                icon=""
                iconAfter
                subLabel={<Typography variant="h5" color="text.primary">סדר {nextEventName}</Typography>}
                label={<Typography variant="body2">{inHebrew(nextEventDay, 'Dm')}</Typography>}
                color="default"
                variant="outlinedExtended"
                onClick={nextEvent}
                testId="next-event-fab"
                showSubLabel
                sizeMultiplier={7}
              >
                <Iconify icon="solar:alt-arrow-left-bold" width={24} sx={{ ml: 1, color: 'text.disabled' }} onClick={onBack} />

              </FabButton>
            </Box>
          }
        </Box>

        <InsertToolbar
          exceptionDialog={exceptionDialog}
          selectedLabel={selectedLabel}
          dialogDelay={dialogDelay}
          handleDelete={(data: any) => handleUpdate(data, 'delete')}
          currentData={currentData}
          setSortBy={setSortBy}
          reset={reset}
          handleFilter={handleFilters}

          filters={filters}
          summaryMode={summaryMode}
          infoColumns={infoColumns}
          infoStudents={infoStudents}
        />
        <Divider />


        <CardContent>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {searchFilter}
          </Box>
          {!currentData.length && <EmptyContent title="לא נמצאו תלמידים" filled sx={{ py: 10 }} imgUrl="" action={null} slotProps={{}} description="" />}

          <InsertList
            infoColumns={infoColumns}
            summaryMode={summaryMode.value}
            selectLabel={selectLabel}
            dialogDelay={dialogDelay}
            exceptionDialog={exceptionDialog}
            currentData={applyFilters(currentData, filters, sortBy, infoStudents)}
            methods={methods}
            handleUpdate={handleUpdate}
            filters={filters}
          />
        </CardContent>
      </Card>

    </DashboardContent>
  );
}


function applyFilters(oldData: any[], filters: { [key: string]: any }, sortBy: string | null, infoStudents: any[]) {

  const { data, search } = filters;
  let filteredData = [...oldData];

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
  if (search) {
    const searchLower = search.toLowerCase();
    filteredData = filteredData.filter((item) => {
      const fullName = `${item.primary}`.toLowerCase();
      return fullName.includes(searchLower)
    });
  }
  
  Object.keys(filters).forEach(column => {
    if (['data', 'search'].includes(column)) return;
    const value = filters[column];
    if (!value || value.length === 0) return;

    filteredData = filteredData.filter((item) => {
      const all = infoStudents.find(stu=>stu.student_id===item.student_id);
      if (all && all[column]) {
        return Array.isArray(value) ? value.includes(all[column]) : all[column] === value;
      }
      return false;
    }
    )
  })

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