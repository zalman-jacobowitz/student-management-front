
import { useState } from "react";

import { Button, Stack, Fab, IconButton } from "@mui/material";

import { useBoolean } from "src/hooks/use-boolean";

import { PopoverActions } from "src/components/popover-actions";
import { RegularSelect, RegularButton, RegularSearch } from "src/components/form-elements";

import { changeBool } from "../functions";
import useInsertStore from "../insert-state";
import { CopyPasteButtons } from "../components/copy-paste-buttons";
import { InsertFilters } from "../components/filters";
import { DelayDialog } from "../delays/delays-edit-steps";
import { ButtonGreen } from "src/components/button-green";
import { ExceptionDialog } from "src/sections/exceptions/exceptions-edit-steps";
import { Iconify } from "src/components/iconify/iconify";



// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { label: 'סדר עולה', value: 'up', icon: 'solar:arrow-up-bold-duotone' },
  { label: 'סדר יורד', value: 'down', icon: 'solar:arrow-down-bold-duotone' },
  { label: 'שם פרטי', value: 'name', icon: 'solar:user-bold-duotone' },
];
const FILTER_OPTIONS = [
{ label: 'נוכחים', value: 'true', icon: 'solar:check-circle-bold-duotone', color: 'success' },
{ label: 'חסרים', value: 'false', icon: 'solar:close-circle-bold-duotone', color: 'error' },
{ label: 'מאחרים', value: 'delayed', icon: 'solar:clock-circle-bold-duotone', color: 'warning' },
{ label: 'הכל', value: 'all', icon: 'solar:list-bold-duotone', color: 'default' },
];

// ----------------------------------------------------------------------

interface InsertToolbarProps {
  delay: string,
  handleDelete: (data: any) => void;
  currentData: any[];
  reset?: (values: any) => void;
  filters: any;
  handleFilter: (data: any) => void;
  infoColumns: any[];
  infoStudents: any[];
}

export function InsertToolbar({
  summaryMode,
  setSortBy,
  exceptionDialog,
  selectedLabel,
  dialogDelay,
  handleDelete,
  currentData,
  reset,
  filters,
  handleFilter,
  infoColumns,
  infoStudents,
}: InsertToolbarProps) {
  
  const onBack  = useInsertStore(state => state.onBack);

  const listActionsMap = [
    {
      icon: 'solar:trash-bin-trash-bold-duotone',
      label: 'מחק',
      onClick: () => {
        handleDelete(changeBool(currentData))
      }
    },
    {
      icon: 'solar:export-bold',
      label: 'ייצוא',
      onClick: () => {
        // exportToExcel([], 'students_export.xlsx');
      }
    },
    {
      icon: 'solar:copy-bold',
      label: 'העתק',
      component: <CopyPasteButtons infoStudents={infoStudents} reset={reset} />
    },
    {
      icon: 'solar:chart-bold-duotone',
      label: summaryMode ? 'מצב רגיל' : 'מצב סיכום',
      color: summaryMode ? 'primary' : 'default',
      onClick: () => {
        summaryMode.onToggle();
      }
    }
  ]

  const filterDrawer = useBoolean();
  

  return (
    <Stack
      spacing={1}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{ xs: 'column', md: 'row' }}
      sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
    >

      <Fab color="default" variant="outlinedExtended" onClick={onBack}
          sx={{ padding: 3,  borderRadius: 1 }}>
         <Iconify icon="solar:arrow-right-bold-duotone" width={24} />
         חזור
      </Fab>
      <Fab color="default" variant="outlinedExtended" onClick={filterDrawer.onTrue} sx={{ padding: 3,  borderRadius: 1  }}>
         <Iconify icon="solar:filter-bold-duotone" width={24} />
         סנן
      </Fab>
      <Fab color="warning" variant="softExtended" onClick={dialogDelay.onTrue} sx={{ padding: 3,  borderRadius: 1  }}>
        <Iconify icon="solar:clock-circle-bold-duotone"  />
         איחור
      </Fab>
      <Fab color="default" variant="softExtended" onClick={exceptionDialog.onTrue} sx={{ padding: 3, borderRadius: 1 }}>
        <Iconify icon="solar:user-check-rounded-bold-duotone" width={24}  />
         אישור
      </Fab>

      {/*
      <RegularSelect
        label="סדר לפי"
        onChange={(e) => setSortBy(e)}
        options={SORT_OPTIONS}
        data-testid="sort-select"
      />
      
      <RegularSelect
        label="הצג רק"
        onChange={(e)=> {
          console.log('filter value:', e)
          handleFilter('data', e)
        }}
        options={FILTER_OPTIONS}
        data-testid="filter-select"
        />
      */}
      <RegularSearch
        onChange={(e)=>{handleFilter({...filters, search: e})}}
        data-testid="search-input"
      />
      <PopoverActions listActions={listActionsMap} />
      
      <InsertFilters
        open={filterDrawer.value}
        onClose={filterDrawer.onFalse}
        infoColumns={infoColumns}
        handleFilter={handleFilter}
        filters={filters}
        table={currentData}
      />

      <DelayDialog
        open={dialogDelay.value}
        onClose={dialogDelay.onFalse}
        delay={selectedLabel}
        onComplete={(data) => {
          dialogDelay.onFalse();
        }}
  
      />
      <ExceptionDialog
        open={exceptionDialog.value}
        onClose={exceptionDialog.onFalse}
        onComplete={(data) => {
          exceptionDialog.onFalse();
        }}
        column={selectedLabel}
      /> 
     
    </Stack>
);
}
