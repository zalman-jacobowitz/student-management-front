// react
import { useCallback, useEffect, useMemo, useState } from "react";

// mui
import { Button, Card } from "@mui/material";

// hooks
import { useBoolean } from "src/hooks/use-boolean";

// layouts
import { DashboardContent } from "src/layouts/dashboard";

// components
import { ButtonGreen } from "src/components/button-green";
import { PageLinksHeader } from "src/components/layout/header-links";

// sections
import { InsertFilters, newApplyFilters } from "src/sections/insert/components/filters";

// full table
import { FullTable } from "./table";
import { TableConfig } from "./types";
import { ImportButton } from "./buttons";
import { FullTableToolbar } from "./toolbar";
import { FullTableImportDialog } from "./import-dialog";
import { getHeadLabels } from "./functions/head-labels";
import useTableConfig from "./table-state";




function useTableFunctions() {

  // סטייטים לשליטה בדיאלוגים:
  const importData = useBoolean(false) // יבוא
  const quickAdd = useBoolean(false) // הוספה מהירה
  const filterDrawer = useBoolean(); // מסנן

  // סטייטים לסינון
  const [filters, setFilters] = useState<FilterObject>({});

  // פונקציית סינון
  const handleFilter = useCallback((filterData: FilterObject) => {
    setFilters(() => ({ ...filterData }));
  }, []);

  // קבלת הנתונים של הטבלה
  const { tableData } = useTableConfig()

  // החלה של הפונקציונליות של הסינון על הטבלה
  const dataFiltered = tableData  // useMemo(() => newApplyFilters(data.tableData, filters, data.tableColumns), [data.tableData, filters, data.tableColumns])

  return {
    importData,
    quickAdd,
    filterDrawer,

    dataFiltered,
    // 
    handleFilter,
    filters
  }
}

function Header({ importData }: { importData: () => void }) {

  const {
    headingLinks,
    headingTitle,
    importButton
  } = useTableConfig()

  return (
    <PageLinksHeader links={headingLinks} heading={headingTitle} >
      {importButton && <ImportButton  onClick={importData} />}
    </PageLinksHeader>
  )
}


type FilterObject = { [key: string]: string | string[]; };

export function FullTableWrapper({ config }: { config: TableConfig }) {
  // יבוא האפשרויות של הטבלה
  const {
    importData,
    quickAdd,
    filterDrawer,
    dataFiltered,
    handleFilter,
    filters
  } = useTableFunctions()

  // איתחול הקונפיגורציה בסטייט הכללי לצורך שיתוף הפרטים
  const { initialize } = useTableConfig()

  const {
    styleTable,
    isHeader,
    isToolbar,
    addButton,
    tableData,
    tableColumns,
    EditComponent,
    defaultValues

  } = useTableConfig()

  // מימוש פונקציית האיתחול
  useEffect(() => {
    initialize(config)
  }, [config, initialize])

  // שורת כפותי עזר מעל הטבלה
  const renderHeader = isHeader && <Header importData={importData.onTrue} />
  // סרגל הכלים של הטבלה
  const renderToolbar = <FullTableToolbar />
  // הטבלה עצמה
  const renderTable = <FullTable dataFiltered={dataFiltered} />
  // כפתור הוספה
  const renderAddBtn = addButton && <ButtonGreen data-testid="add-button" onClick={quickAdd.onTrue} />
  // דיאלוג הייבוא טבלה חדשה
  const renderImportDialog = (<FullTableImportDialog
    onClose={importData.onFalse}
    open={importData.value}
    oldData={tableData}
    infoColumns={tableColumns}
  />
  )
  // דיאלוג ההוספה או עריכה של רשומה
  const renderEditDialog = EditComponent && (
    <EditComponent
      open={quickAdd.value}
      onClose={quickAdd.onFalse}
      column={defaultValues || {}}
    />
  )
  // קומפוננטת הסינון בפועל המופיעה בצד המסך
  const renderFiltersDialog = (
    <InsertFilters
      open={filterDrawer.value}
      onClose={filterDrawer.onFalse}
      infoColumns={tableColumns}
      handleFilter={handleFilter}
      filters={filters}
      table={tableData}
    />
  )
  // הצגת הטבלה על פי הקונפיגורציה
  return (
    <DashboardContent sx={{}} disablePadding={false}>
      {renderHeader}
      <Card sx={{ p: 2, backgroundColor: styleTable }}>
        {renderToolbar}
        {renderTable}
      </Card>
      {renderAddBtn}
      {renderImportDialog}
      {renderEditDialog}
      {renderFiltersDialog}
    </DashboardContent>
  )
}
