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


// כפתור "החל" לסינון התוצאות
const ApplyFilter = () => (
  <LoadingButton type="submit" variant="text" size="small">
    החל
  </LoadingButton>
);

export function FullTableToolbar(): React.JSX.Element {
  
  // קבלת הפרטים על הסרגל כלים מהקונפיגורצייה:
  const {
    // רשימת הפעולות המופיעות בסרגל הכלים
    listActionsMap,
    // הנתונים על העמודות לצורך התאמה אישית של הפילטרים
    tableColumns
  } = useTableConfig()

  // הצגה של הפילטרים שנקבעו על פי הגדרות המשתמש: מזוהה על פי המידע על העמודות
  const renderFilters = <ToolbarFilters infoColumns={tableColumns}/>
  // הצגה של שדה החיפוש: חיפוש לפי השדות הראשיים שהוגדרו
  const renderSearch = <RegularSearch onChange={()=>alert('search')} />
  // הצגה של כפתור "החל" לצורך ביצוע החיפוש בשדות החיפוש הנגישות
  const renderApplyFilterBtn = <ApplyFilter />
  // הצגה של פעולות נוספות אם יש
  const renderActions = listActionsMap && <PopoverActions listActions={listActionsMap}/> 
  
  return (
    <FormProvider handleFilters={(filters)=> console.log(filters)}>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{ xs: 'column', md: 'row' }}
        sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}>
        {renderFilters}
        {renderSearch}
        {renderApplyFilterBtn}
        {renderActions}
      </Stack>
    </FormProvider>
  )
}
