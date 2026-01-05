# פונקציות מיון וסינון נתונים - מסך הרישום

## סקירה כללית

הקובץ `insert-data-handlers.ts` מכיל את כל הפונקציות המשמשות למיון וסינון הנתונים של התלמידים במסך הרישום.

## פונקציות המיון

### `sortAscending(data, field)`
ממיין את התלמידים בסדר עולה לפי השדה המבוקש (ברירת מחדל: `primary`).
- **פרמטרים:** מערך התלמידים, שם השדה
- **החזרה:** מערך ממויין בסדר עולה
- **דוגמה:** 
  ```ts
  const sorted = sortAscending(students, 'primary');
  ```

### `sortDescending(data, field)`
ממיין את התלמידים בסדר יורד לפי השדה המבוקש (ברירת מחדל: `primary`).
- **פרמטרים:** מערך התלמידים, שם השדה
- **החזרה:** מערך ממויין בסדר יורד

### `sortByName(data)`
ממיין את התלמידים לפי השם המלא (שם ומשפחה).
- **פרמטרים:** מערך התלמידים
- **החזרה:** מערך ממויין לפי שם מלא

### `applySorting(data, sortType)`
בוחר את פונקציית המיון הנכונה לפי סוג המיון המבוקש.
- **סוגי מיון זמינים:**
  - `'עולה'` - מיון עולה
  - `'יורד'` - מיון יורד
  - `'שם'` - מיון לפי שם

## פונקציות הסינון

### `filterByStatus(data, filterType)`
סינון התלמידים לפי סטטוס נוכחותם.

**סוגי סינון:**
- `'true'` - נוכחים בלבד (data === 1)
- `'false'` - חסרים בלבד (data === 0 וללא איחור או אישור)
- `'late'` - מאחרים בלבד (יש להם delay)
- `'all'` - כל התלמידים

### `filterBySearch(data, searchTerm)`
סינון התלמידים לפי חיפוש טקסט בשם.
- **פרמטרים:** מערך התלמידים, מחרוזת חיפוש
- **החזרה:** מערך של התלמידים שמתאימים לחיפוש
- **דוגמה:**
  ```ts
  const results = filterBySearch(students, 'ישראל');
  ```

### `applyAllFilters(data, filters)`
מיישמת את כל הפילטרים בו-זמנית.
- **פרמטר filters:**
  - `data` - סוג הסינון לפי סטטוס (true/false/late/all)
  - `search` - מחרוזת החיפוש
- **החזרה:** מערך מסונן

## פונקציות משולבות

### `applySortingAndFiltering(data, sortType, filters)`
מיישמת סינון ואז מיון בסדר זה.
- **פרמטרים:**
  - `data` - מערך התלמידים
  - `sortType` - סוג המיון
  - `filters` - אובייקט עם כל הפילטרים
- **החזרה:** מערך ממויין ומסונן

**סדר הפעולות:**
1. קודם מסננים לפי כל הפילטרים
2. אחרי זה ממיינים לפי סוג המיון המבוקש

## טיפוסים

```ts
export type SortType = 'עולה' | 'יורד' | 'שם';
export type FilterType = 'true' | 'false' | 'late' | 'all';

export interface FilterState {
  data?: FilterType;
  search?: string;
  [key: string]: any;
}

export interface SortState {
  type: SortType;
}
```

## שימוש בקומפוננטה

הקומפוננטה `InsertToolbar` משתמשת בפונקציות אלה דרך:

```tsx
// אימוט מיון
const [sortType, setSortType] = useState<SortType>('עולה');

// טיפול בשינוי מיון
const handleSortChange = (sortValue: any) => {
  setSortType(sortValue as SortType);
};

// טיפול בשינוי סינון
const handleFilterChange = (filterValue: any) => {
  handleFilter({ ...filters, data: filterValue });
};

// טיפול בחיפוש
const handleSearchChange = (searchValue: string) => {
  handleFilter({ ...filters, search: searchValue });
};
```

## שימוש בקומפוננטה `InsertList`

הקומפוננטה `InsertList` משתמשת בפונקציה `newApplyFilters` מקובץ `filters.tsx` כדי לסנן את הנתונים:

```tsx
const dataFiltered = newApplyFilters(currentData, filters, infoColumns)
```

שילוב עם מיון יכול להיעשות כמו:

```tsx
const filtered = applyAllFilters(currentData, filters);
const sorted = applySorting(filtered, sortType);
```

או בשימוש בפונקציה המשולבת:

```tsx
const result = applySortingAndFiltering(currentData, sortType, filters);
```
