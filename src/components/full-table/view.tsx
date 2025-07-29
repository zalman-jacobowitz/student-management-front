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




function useFullTableWrapper() {

  const importData = useBoolean(false)
  const quickAdd = useBoolean(false)
  const filterDrawer = useBoolean();

  //
  const [filters, setFilters] = useState<FilterObject>({});

  const handleFilter = useCallback((filterData: FilterObject) => {
    setFilters(() => ({ ...filterData }));
  }, []);

  //
  const { tableData } = useTableConfig()

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
      {importButton && <ImportButton onClick={importData} />}
    </PageLinksHeader>
  )
}


type FilterObject = { [key: string]: string | string[]; };

export function FullTableWrapper({ config }: { config: TableConfig }) {

  const {
    importData,
    quickAdd,
    filterDrawer,
    dataFiltered,
    handleFilter,
    filters
  } = useFullTableWrapper()

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

  // Initialize the global state with the config
  useEffect(() => {
    initialize(config)
  }, [config.headingTitle, initialize])

  const renderHeader = isHeader && <Header importData={importData.onTrue} />
  const renderToolbar = isToolbar && <FullTableToolbar />
  const renderTable = <FullTable dataFiltered={dataFiltered} />
  const renderAddBtn = addButton && <ButtonGreen onClick={quickAdd.onTrue} />

  const renderImportDialog = (<FullTableImportDialog
    onClose={importData.onFalse}
    open={importData.value}
    oldData={tableData}
  />
  )

  const renderEditDialog = EditComponent && (
    <EditComponent
      open={quickAdd.value}
      onClose={quickAdd.onFalse}
      column={defaultValues || {}}
    />
  )

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
