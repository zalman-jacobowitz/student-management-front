
import { useState } from "react";

import { Button, Stack } from "@mui/material";

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



// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { label: 'סדר עולה', value: 'עולה' },
  { label: 'סדר יורד', value: 'יורד' },
  { label: 'שם פרטי', value: 'שם' },
];
const FILTER_OPTIONS = [
{ label: 'נוכחים', value: 'true' },
{ label: 'חסרים', value: 'false' },
{ label: 'מאחרים', value: 'late' },
{ label: 'הכל', value: 'all' },
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
      icon: 'solar:trash-bold-duotone',
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
    }
  ]

  const filterDrawer = useBoolean();
  

  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{ xs: 'column', md: 'row' }}
      sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
    >
      <RegularButton onClick={onBack} icon="solar:arrow-right-bold" data-testid="back-button">חזור</RegularButton>
      <Button onClick={filterDrawer.onTrue}>סינון</Button>      
      <RegularSelect
        label="סדר לפי"
        onChange={()=>{}}
        options={SORT_OPTIONS}
        data-testid="sort-select"
      />
      
      <RegularSelect
        label="הצג רק"
        onChange={(e)=> {
          handleFilter({...filters, data: e})
        }}
        options={FILTER_OPTIONS}
        data-testid="filter-select"
        />
      
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
      <ButtonGreen number={1} color="warning" onClick={dialogDelay.onTrue}/>
      <ButtonGreen number={2} color="default" onClick={exceptionDialog.onTrue}/>

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
