/*
 * TYPE SAFETY ISSUES / בעיות TYPE SAFETY:
 * 1. No TypeScript interfaces for toolbar props / אין ממשקי TypeScript לפרופס הטולבר
 * 2. Missing type definitions for infoColumns array / אין הגדרות טיפוס למערך infoColumns
 * 3. Untyped listActionsMap parameter / פרמטר listActionsMap לא מוגדר
 * 4. Missing type safety for form handling / אין בטיחות טיפוסים לטיפול בטפסים
 * 5. No validation for filter and search operations / אין ולידציה לפעולות סינון וחיפוש
 */

/*
 * not solved:
 * 1. No validation for filter and search operations / אין ולידציה לפעולות סינון וחיפוש
 */


import { Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";


import { FormProvider } from "src/components/form-provider";
import { ToolbarFilters } from "src/components/toolbar-filters";
import { PopoverActions } from "src/components/popover-actions";
import { RegularSearch } from "src/components/form-elements";
import { InfoColumn, toolbarType } from "./types";
import useTableConfig from "./table-state";


interface FullTableToolbarProps {
  // Remove props - using global state instead
}

const ApplyFilter = () => (
  <LoadingButton type="submit" variant="text" size="small">
    החל
  </LoadingButton>
);

export function FullTableToolbar({}: FullTableToolbarProps){
  
  const {
    listActionsMap,
    tableColumns
  } = useTableConfig()
  
  return (
    <FormProvider handleFilters={(filters)=> console.log(filters)}>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{ xs: 'column', md: 'row' }}
        sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}>
        
        <ToolbarFilters
          infoColumns={tableColumns}
        />
        
        <RegularSearch
          onChange={()=>alert('search')}
        />

        <ApplyFilter />

        {listActionsMap && <PopoverActions listActions={listActionsMap}/> }

      </Stack>
    </FormProvider>
  )
}
