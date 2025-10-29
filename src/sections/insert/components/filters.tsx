import { Box, Button, Divider, Drawer, Stack, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { FilterElement } from "src/components/filter-elements";
import { Field, Form } from "src/components/hook-form";
import { Iconify } from "src/components/iconify";
import { Scrollbar } from "src/components/scrollbar";



type InsertFiltersProps = {
    infoColumns: any[];
    handleFilter: (filters: any) => void;
    filters: any;
    open: boolean;
    onClose: () => void;
    [key: string]: any;
}

type FilterColumn = {
    client: string;
    filters: string;
    group_name: string;
    hidden: string;
    label: string;
    name: string;
    required: string;
    sorting: number;
    filter_type: string;
    table_name: string;
    type: string;
    options?: Array<{ label: any; value: any }>;
}
const demoInfoColumns = [
  {
      "client": "kg_gdola",
      "filters": "extra",
      "group_name": "primary",
      "hidden": "1",
      "label": "שם",
      "name": "שם",
      "required": "",
      "sorting": 1,
      "filter_type": "text",
      "table_name": "info_students",
      "type": "text"
  },
  {
      "client": "kg_gdola",
      "filters": "extra",
      "group_name": "primary",
      "hidden": "1",
      "label": "משפחה",
      "name": "משפחה",
      "required": "",
      "sorting": 2,
      "filter_type": "text",
      "table_name": "info_students",
      "type": "text"
  },
  {
      "client": "kg_gdola",
      "filters": "regular",
      "group_name": "",
      "hidden": "1",
      "label": "ארץ לידה הורים",
      "name": "ארץ_לידה_הורים",
      "required": "",
      "sorting": 4,
      "filter_type": "text",
      "table_name": "info_students",
      "type": "text"
  },
  {
      "client": "kg_gdola",
      "filters": "",
      "group_name": "secondary",
      "hidden": "1",
      "label": "כתובת מגורים",
      "name": "כתובת_מגורים",
      "required": "",
      "sorting": 6,
      "filter_type": "text",
      "table_name": "info_students",
      "type": "text"
  },
  {
      "client": "kg_gdola",
      "filters": "",
      "group_name": "",
      "hidden": "",
      "label": "שנת לידה",
      "name": "שנת_לידה",
      "required": "",
      "sorting": 9,
      "filter_type": "text",
      "table_name": "info_students",
      "type": "text"
  },
  {
      "client": "kg_gdola",
      "filters": "",
      "group_name": "",
      "hidden": "1",
      "label": "client",
      "name": "client",
      "required": "",
      "sorting": 12,
      "filter_type": "text",
      "table_name": "info_students",
      "type": "text"
  },
  {
      "client": "kg_gdola",
      "filters": "",
      "group_name": "",
      "hidden": "t",
      "label": "student id",
      "name": "student_id",
      "required": "",
      "sorting": 13,
      "filter_type": "text",
      "table_name": "info_students",
      "type": "text"
  },
  {
      "client": "kg_gdola",
      "filters": "",
      "group_name": "",
      "hidden": "t",
      "label": "user id",
      "name": "user_id",
      "required": "",
      "sorting": 14,
      "filter_type": "text",
      "table_name": "info_students",
      "type": "text"
  },
  {
      "client": "kg_gdola",
      "filters": "regular",
      "group_name": "",
      "hidden": "",
      "label": "ארץ לידה",
      "name": "ארץ_לידה",
      "required": "",
      "sorting": 15,
      "filter_type": "text",
      "table_name": "info_students",
      "type": "text"
  },
  {
      "client": "kg_gdola",
      "filters": "",
      "group_name": "",
      "hidden": "1",
      "label": "דואל",
      "name": "דואל",
      "required": "",
      "sorting": 16,
      "filter_type": "text",
      "table_name": "info_students",
      "type": "text"
  },
  {
      "client": "kg_gdola",
      "filters": "regular",
      "group_name": "",
      "hidden": "",
      "label": "מגדר",
      "name": "מין",
      "required": "",
      "sorting": 17,
      "filter_type": "text",
      "table_name": "info_students",
      "type": "text"
  },
  {
      "client": "kg_gdola",
      "filters": "",
      "group_name": "",
      "hidden": "",
      "label": "מספר טלפון",
      "name": "מספר_טלפון",
      "required": "",
      "sorting": 18,
      "filter_type": "number",
      "table_name": "info_students",
      "type": "text"
  },
  {
      "client": "kg_gdola",
      "filters": "",
      "group_name": "",
      "hidden": "1",
      "label": "בן מתחת 18",
      "name": "בן_מתחת_גיל_18",
      "required": "",
      "sorting": 19,
      "filter_type": "text",
      "table_name": "info_students",
      "type": "text"
  }
]



// איתחול הפילטרים יהיה לפי סוג העמודה
const getDefaultFilters = (infoColumns: any[]) => {
  const filters = {}
  infoColumns.forEach(col => {
      filters[col.name] = col.filter_type === 'multiple' ? [] : '';
  })
  return filters
}

// החלה של הפילטרים לפי הגדרת הסוג שלהם.

export function newApplyFilters(data: any[], filters: any, infoColumns: any[]) {
  if (Object.keys(filters).length === 0 || data.length === 0) {
    return data
  }
  
  let filteredData = data

  infoColumns.forEach(col => {
    if (filters[col.name] !== '') {
      if (col.filter_type === 'multiple') {
        filteredData = filteredData.filter((student: any) => filters[col.name].includes(student[col.name]))
      }
      if (col.filter_type === 'text') {
        filteredData = filteredData.filter((item: any) => item[col.name].includes(filters[col.name]))
      }
    }
  })

  if (filters.search && filters.search !== '') {

    filteredData = filteredData.filter((item: any) => `${item.שם} ${item.משפחה}`.startsWith(filters.search.toLowerCase()))
  }
  if (filters.data && filters.data !== '') {

    filteredData = filteredData.filter((item: any) =>
      filters.data ==='true' && item.data ||
      filters.data ==='false' && !item.data ||
      filters.data ==='all'
    )
  }

  return filteredData
}


export function InsertFilters({
    // infoColumns,
    handleFilter,
    table,
    filters,
    open,
    onClose,
    ...other
  }: InsertFiltersProps) {

    const infoColumns = demoInfoColumns

    const methods = useForm({defaultValues: getDefaultFilters(infoColumns)});

    const { handleSubmit, reset } = methods;

    const onSubmit = (data: any) => {
      if (Object.keys(data).length === 0) {
        reset();
        handleFilter({});
      } else {
        handleFilter(data);
      }
      onClose();
    }

    const fieldFilters = infoColumns.filter(e => e.filters)

    const fieldWithOptions = fieldFilters.map((e: FilterColumn) => {
      if (e.filter_type === 'multiple') {
        const options = new Set(table.map((student: any) => student[e.name]))
        e.options = Array.from(options).map((option: any) => ({
          label: option,
          value: option
        }))
      }
      return e
    })

    const renderFilters = (
        <>
          {fieldWithOptions.map(col => (
              <FilterElement
                key={col.name}
                name={col.name}
                info={col}
                isFilter
              />
          ))}
        </>
      );

      const renderHeader = (
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.5 }}>
          <Typography variant="h6"> סינון נתונים </Typography>
            <Button
              variant={"outlined" as any}
              color="primary"
              size="small"
              onClick={() => onSubmit({})}
              type="reset"
            >
            <Iconify icon="mdi:refresh" width={20} sx={{}} />
          </Button>
        </Stack>
      )
      const renderFooter = (
        <Box sx={{ p: 2.5, position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <Button
            fullWidth
            variant={"soft" as any}
            color="primary"
            size="large"
            type="submit"
          >
          סינון
        </Button>
      </Box>
    )
    
    return (
      <Drawer
        open={open}
        onClose={onClose}
        anchor="right"
        slotProps={{ backdrop: { invisible: true } }}
        PaperProps={{ sx: { width: 320 } }}
        {...other}
      >
        <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Scrollbar>
            {renderHeader}
              <Divider />
              <Stack direction="column" alignItems="center" justifyContent="space-between" sx={{ p: 2.5, gap: 2 }}>
                <Stack spacing={1} sx={{ width: 1 }}>
                {renderFilters}
                </Stack>
              </Stack>
            </Scrollbar>
            {renderFooter}
        </Form>
      </Drawer>
  );
  }