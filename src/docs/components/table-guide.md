# מדריך ליצירת טבלאות במערכת

## מבנה בסיסי

### 1. יבואים נדרשים
```jsx
import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Box, TableCell } from "@mui/material";

import { Scrollbar } from "src/components/scrollbar";
import { RegularTable } from "src/components/regular-table/regular-table";
import { useTable, emptyRows, TableNoData, TableEmptyRows } from "src/components/table";
import { RegularTablePagination } from "src/components/regular-table/regular-table-pagination";
import { TableSelectedHeader } from "src/components/regular-table/regular-table-selected-header";
import { RegularRowProvider } from "src/components/regular-table/regular-row-provider";
import { CellAction, CellAvatar, CellCheckbox } from "src/components/regular-table";
```

### 2. הגדרת useTable
```jsx
const table = useTable({ 
  defaultRowsPerPage: 6,
  defaultDense: false,
  defaultOrder: 'asc',
  defaultOrderBy: 'name'
});
```

### 3. הגדרת כותרות עמודות
```jsx
const headLabels = [
  { name: 'name', label: 'שם', width: 88 },
  { name: 'email', label: 'דואר אלקטרוני', width: 200 },
  { name: 'phone', label: 'טלפון', width: 150 },
  { name: 'status', label: 'סטטוס', width: 100 },
  { name: '', width: 88 }, // עמודת פעולות
  { name: '', width: 40 }  // עמודת בחירה
];
```

## יצירת טבלה עם נתונים

### 1. פונקציית סינון
```jsx
function applyFilters({ inputData, filters = {} }) {
  const { search, status } = filters;
  
  if (search) {
    inputData = inputData.filter(
      (item) => item.name.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  if (status && status !== 'all') {
    inputData = inputData.filter((item) => item.status === status);
  }
  
  return inputData;
}
```

### 2. רכיב טבלה עיקרי
```jsx
export function MyTable({ data, filters }) {
  const table = useTable({ defaultRowsPerPage: 6 });
  
  // סינון נתונים
  const dataFiltered = applyFilters({ inputData: data, filters });
  
  // דף נוכחי
  const dataPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );
  
  // פונקציות עדכון
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation(updateAPI);
  
  const handleUpdate = useCallback(async (data, mode = 'update') => {
    await mutateAsync({ data, mode });
  }, [mutateAsync]);
  
  // פעולות עבור פריטים נבחרים
  const selectedActions = (
    <Button onClick={() => handleUpdate(dataFiltered, 'delete')}>
      מחק נבחרים
    </Button>
  );
  
  return (
    <TableProvider 
      table={table} 
      headLabels={headLabels} 
      tableData={dataFiltered} 
      selectedActions={selectedActions}
    >
      {dataPage.map((item) => (
        <MyTableRow 
          key={item.id}
          item={item}
          selected={table.selected.includes(item.id)}
          onSelectRow={() => table.onSelectRow(item.id)}
        />
      ))}
      
      <TableEmptyRows
        height={table.dense ? 56 : 76}
        emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
      />
      
      <TableNoData notFound={!dataFiltered.length} />
    </TableProvider>
  );
}
```

### 3. רכיב Provider לטבלה
```jsx
function TableProvider({ children, headLabels, tableData, table, selectedActions }) {
  return (
    <>
      <Box sx={{ position: 'relative' }}>
        <TableSelectedHeader
          table={table}
          tableData={tableData}
          action={selectedActions}
        />
        <Scrollbar>
          <RegularTable headLabels={headLabels} tableData={tableData} table={table}>
            {children}
          </RegularTable>
        </Scrollbar>
      </Box>
      <RegularTablePagination table={table} tableData={tableData} />
    </>
  );
}
```

## יצירת שורות טבלה

### 1. רכיב שורת טבלה
```jsx
export function MyTableRow({ item, selected, onSelectRow }) {
  const quickEdit = useBoolean();
  const router = useRouter();
  
  // הגדרת עמודות הפעולה
  const actionColumns = [
    {
      before: true,
      props: {
        checked: selected,
        onClick: onSelectRow,
        id: item.id
      },
      component: CellCheckbox
    },
    {
      before: true,
      props: {
        name: item.name,
        avatarUrl: item.avatarUrl,
        email: item.email
      },
      component: CellAvatar
    },
    {
      props: {
        icon: "solar:pen-bold-duotone",
        onClick: quickEdit.onTrue,
        tooltip: "עריכה מהירה"
      },
      component: CellAction
    },
    {
      props: {
        icon: 'solar:user-id-bold-duotone',
        onClick: () => router.push(`/profile/${item.id}`),
        tooltip: 'פרופיל אישי'
      },
      component: CellAction
    }
  ];
  
  return (
    <RegularRowProvider selected={selected} columns={actionColumns}>
      <TableCell>{item.name}</TableCell>
      <TableCell>{item.email}</TableCell>
      <TableCell>{item.phone}</TableCell>
      <TableCell>
        <Label color={item.status === 'active' ? 'success' : 'error'}>
          {item.status}
        </Label>
      </TableCell>
      
      {/* דיאלוג עריכה */}
      <EditDialog
        item={item}
        open={quickEdit.value}
        onClose={quickEdit.onFalse}
      />
    </RegularRowProvider>
  );
}
```

### 2. סוגי תאים זמינים

#### CellCheckbox - תיבת סימון
```jsx
{
  before: true,
  props: {
    checked: selected,
    onClick: onSelectRow,
    id: item.id
  },
  component: CellCheckbox
}
```

#### CellAvatar - תמונה + פרטים
```jsx
{
  before: true,
  props: {
    name: item.name,
    avatarUrl: item.avatarUrl,
    email: item.email
  },
  component: CellAvatar
}
```

#### CellAction - כפתורי פעולה
```jsx
{
  props: {
    icon: "solar:pen-bold-duotone",
    onClick: handleEdit,
    tooltip: "עריכה"
  },
  component: CellAction
}
```

## תכונות מתקדמות

### 1. סינון דינמי
```jsx
const [filters, setFilters] = useState({
  search: '',
  status: 'all',
  dateRange: null
});

// עדכון מסננים
const handleFilterChange = useCallback((name, value) => {
  setFilters(prev => ({
    ...prev,
    [name]: value
  }));
  table.onResetPage(); // חזרה לעמוד הראשון
}, [table]);
```

### 2. מיון עמודות
```jsx
const headLabels = [
  { 
    name: 'name', 
    label: 'שם', 
    width: 88,
    sortable: true // ניתן למיון
  },
  { 
    name: 'email', 
    label: 'דואר אלקטרוני', 
    width: 200,
    sortable: true
  }
];
```

### 3. עמודות דינמיות
```jsx
// עמודות מהגדרות משתמש
const visibleColumns = columns.filter(col => !col.hidden);

const headLabels = [
  { name: 'name', label: 'שם', width: 88 },
  ...visibleColumns.map(col => ({
    name: col.name,
    label: col.label,
    width: col.width || 120
  })),
  { name: '', width: 88 }
];
```

### 4. פעולות בכמות
```jsx
const selectedActions = (
  <Stack direction="row" spacing={1}>
    <Button 
      variant="contained" 
      color="error"
      onClick={() => handleBulkDelete(table.selected)}
    >
      מחק ({table.selected.length})
    </Button>
    <Button 
      variant="outlined"
      onClick={() => handleBulkExport(table.selected)}
    >
      ייצא ({table.selected.length})
    </Button>
  </Stack>
);
```

## טיפים נוספים

### 1. טעינה והודעות
```jsx
// מצב טעינה
if (isLoading) {
  return <TableSkeleton />;
}

// טבלה ריקה
<TableNoData 
  notFound={!dataFiltered.length} 
  title="לא נמצאו נתונים"
  description="נסה לשנות את המסננים"
/>
```

### 2. ביצועים
```jsx
// שימוש ב-memo לשורות
const MyTableRow = memo(({ item, selected, onSelectRow }) => {
  // ...
});

// דחיית עדכון מסננים
const debouncedSearch = useDebounce(search, 300);
```

### 3. נגישות
```jsx
// תוויות נגישות
<RegularTable
  headLabels={headLabels}
  tableData={tableData}
  table={table}
  aria-label="טבלת נתונים"
  role="table"
>
```

### 4. עיצוב מותאם
```jsx
// ערכות נושא שונות
<RegularTable 
  themeTable="separated" // או "default"
  headLabels={headLabels}
  tableData={tableData}
  table={table}
/>
```

## מבנה קבצים מומלץ

```
components/
├── my-table.jsx              # טבלה עיקרית
├── my-table-row.jsx          # רכיב שורה
├── my-table-toolbar.jsx      # סרגל כלים
├── my-table-filters.jsx      # מסננים
└── components/
    ├── bulk-actions.jsx      # פעולות בכמות
    ├── quick-edit-dialog.jsx # עריכה מהירה
    └── table-provider.jsx   # Provider מותאם
```

המדריך מספק מסגרת מלאה ליצירת טבלאות מתקדמות במערכת בהתבסס על הדפוסים הקיימים.