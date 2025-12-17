# Drag and Drop - סדר העמודות

## 📋 תיאור כללי

מסמך זה מתאר את הממשק וההלוגיקה של Drag and Drop לסידור עמודות בטבלה. הפונקציונליות מאפשרת למשתמשים לשנות את סדר ההצגה של העמודות על ידי גרירה ושחרור.

## 📁 הקבצים שנוצרו

### 1. `columns-dnd-functions.ts`
**קובץ לוגיקה נפרד** המכיל את כל הפונקציות הדרושות לניהול סדר העמודות.

#### פונקציות עיקריות:

- **`createSortableId(columnName: string)`**
  - יוצרת Branded Type ID עבור עמודה
  - שימוש: `const id = createSortableId(column.name)`

- **`getSortableIdValue(id: SortableColumnId)`**
  - מחזירה את ערך השם של העמודה מה-ID
  - שימוש: `const name = getSortableIdValue(id)`

- **`getColumnIndex(columns: InfoColumn[], columnId: SortableColumnId)`**
  - מחזירה את האינדקס של עמודה במערך
  - שימוש: `const index = getColumnIndex(columns, sortableId)`

- **`reorderColumns(columns, activeIndex, overIndex)`**
  - מחזירה מערך חדש עם העמודות בסדר חדש
  - שימוש: `const reordered = reorderColumns(columns, 0, 2)`

- **`saveColumnOrder(columns, queryClient)`**
  - שומרת את סדר העמודות לשרת (async)
  - שולחת עדכון ל-API
  - שימוש: `await saveColumnOrder(columns, queryClient)`

- **`restoreColumnOrder(columns)`**
  - משחזרת את סדר העמודות מהשדה `order`
  - שימוש: `const restored = restoreColumnOrder(columns)`

- **`validateColumnOrder(columns)`**
  - בדוקה האם סדר העמודות תקני
  - מחזירה `boolean`

- **`fixMissingOrder(columns)`**
  - תיקון עמודות ללא ערך `order`
  - שימוש: `const fixed = fixMissingOrder(columns)`

#### ממשקים וטיפוסים:

```typescript
export type SortableColumnId = string & { readonly __brand: "SortableColumnId" };

export interface InfoColumn {
  name: string;
  label: string;
  type: string;
  hidden: number;
  required: number;
  order?: number;
  // ... שדות נוספים
}
```

---

### 2. `columns-sortable-list.tsx`
**קומפוננטה ראשית** לרינדור רשימה של עמודות עם Drag and Drop.

#### קומפוננטות משנה:

##### `ColumnChip`
- מציגה Chip עם אייקון
- תיאור של תכונת העמודה

##### `SortableColumnRow`
- שורה בודדת של עמודה
- כוללת ידית לגרירה (drag handle)
- משפיעה על `useSortable` hook

##### `DragOverlayColumn`
- תמונה שנראית בזמן הגרירה
- מראה Chip-ים וסימן הגרירה

#### Props של `SortableColumnsList`:

```typescript
interface SortableColumnsListProps {
  columns: InfoColumn[];                          // מערך העמודות
  handleColumnClick: (column: InfoColumn) => void; // callback על לחיצה
  onOrderChange?: (columns: InfoColumn[]) => void; // callback על שינוי סדר
}
```

#### פעולה:

1. **משתמש גורר** עמודה בעזרת **ידית הגרירה** (drag handle)
2. **DnD Context** מזהה את הפעולה
3. **סדר המערך מתעדכן** ברמה המקומית
4. **השינוי משתקף מיד** בממשק
5. **בקשת API** נשלחת לשרת לשמירה
6. **הודעת Toast** מופיעה (הצלחה/שגיאה)

---

### 3. `columns-minimal-list-view.tsx`
**קומפוננטת האב** שמשתמשת ב-`SortableColumnsList`.

#### שינויים:

- **השתמשות** ב-`SortableColumnsList` במקום `ColumnsList`
- **הוספת** Alert עם טיפ לגבי הגרירה
- **ניהול סטייט** של העמודה הנבחרת
- **Callbacks** לעדכון והשמירה

---

## 🎯 זרימת הנתונים

```
┌─────────────────────────────────────┐
│   useInfoColumns('info_students')   │
│   (קבלת נתוני העמודות משרת)           │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│   SortableColumnsList               │
│   (קומפוננטה ראשית עם DnD)           │
└────────────────┬────────────────────┘
                 │
         ┌───────┴────────┐
         ▼                ▼
   ┌──────────────┐   ┌─────────────────────┐
   │ Local State  │   │ Save to Server      │
   │ (setSorted)  │   │ (saveColumnOrder)   │
   └──────────────┘   └─────────────────────┘
         │                     │
         └──────────┬──────────┘
                    ▼
         ┌─────────────────────┐
         │ Toast Notification  │
         └─────────────────────┘
```

---

## 🔧 הגדרות ותצורה

### DnD Context Options:
```typescript
{
  id: "dnd-columns",                              // מזהה ייחודי
  sensors: [MouseSensor, TouchSensor, KeyboardSensor],
  collisionDetection: closestCenter,              // זיהוי התנגשויות
  measuring: { droppable: { strategy: MeasuringStrategy.Always } }
}
```

### Animation Config:
```typescript
const dropAnimationConfig = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: { active: { opacity: "0.5" } }
  })
}
```

---

## ✅ תכונות

- ✅ **Drag and Drop** - גרירה ושחרור של עמודות
- ✅ **Touch Support** - תמיכה בעכבר וטאץ'
- ✅ **Keyboard Support** - קיצורי מקלדת (חצים)
- ✅ **Real-time Save** - שמירה מיידית לשרת
- ✅ **Drag Overlay** - תמונה של הפריט בגרירה
- ✅ **Animations** - אנימציות חלקות
- ✅ **Error Handling** - טיפול בשגיאות וחזרה לאחור
- ✅ **Loading State** - הצגת מצב שמירה
- ✅ **RTL Support** - תמיכה בעברית (RTL)

---

## 🚀 שימוש

### בקומפוננטה:

```tsx
import { SortableColumnsList } from "./columns-sortable-list";

export function MyComponent() {
  const columns = [/* ... */];

  const handleOrderChange = (reorderedColumns) => {
    console.log("סדר חדש:", reorderedColumns);
  };

  return (
    <SortableColumnsList
      columns={columns}
      handleColumnClick={(col) => console.log(col)}
      onOrderChange={handleOrderChange}
    />
  );
}
```

### בשרת:

פונקציית `saveColumnOrder` משתמשת ב-`infoColumnsUpdate` mutation:

```typescript
const saveColumnOrder = async (columns, queryClient) => {
  const orderedColumns = calculateColumnOrder(columns);
  const updateMutation = infoColumnsUpdate({ queryClient });
  
  await updateMutation.mutateAsync({
    data: orderedColumns,
    mode: "update"
  });
};
```

---

## 🛠️ Debugging

### הדפסת לוג שינויים:

```typescript
const handleDragEnd = async (event) => {
  console.log("Before:", sortedColumns);
  // ... logic ...
  console.log("After:", newSortedColumns);
};
```

### בדיקת ה-Order בשרת:

```typescript
const validateOrderInDB = (columns) => {
  const isValid = validateColumnOrder(columns);
  console.log("Is valid:", isValid);
};
```

---

## 📊 מבנה של InfoColumn

```typescript
interface InfoColumn {
  name: string;           // שם העמודה (ID)
  label: string;          // שם תצוגה
  type: string;           // סוג הנתונים
  hidden: number;         // 1 = מוסתר, 0 = גלוי
  required: number;       // 1 = חובה, 0 = אופציונלי
  order?: number;         // סדר ההצגה (חדש)
  table_name: string;     // שם הטבלה
  filters?: string;       // סוג הפילטר
  group_name?: string;    // קבוצה
  sorting?: number;       // סדר ממיון
  client?: number;        // סוג לקוח
}
```

---

## ⚠️ הערות חשובות

1. **ה-`order` שדה**: חיוני לשמירה בשרת
2. **Query Invalidation**: ה-`saveColumnOrder` מטפלת בזה
3. **Error Handling**: אם יש שגיאה, הסדר חוזר לקודם
4. **Type Safety**: שימוש ב-Branded Types ללא שגיאות

---

## 🔄 עדכונים עתידיים

- [ ] הוספת יכולת Undo/Redo
- [ ] שמירת העדפות משתמש
- [ ] הנפקה בקבץ CSV של סדר חדש
- [ ] סטטיסטיקה על שימוש בעמודות

---

## 📚 ספריות משומשות

- **@dnd-kit/core** - DnD Engine
- **@dnd-kit/sortable** - Sortable Plugin
- **@dnd-kit/utilities** - CSS Utilities
- **@tanstack/react-query** - Server State Management
- **@mui/material** - UI Components
- **sonner** - Toast Notifications

---

## 📝 רישום שינויים

| תאריך | גרסה | שינוי |
|-------|------|--------|
| 2025-11-05 | 1.0 | יצירה ראשונית |

---

**עדכון אחרון:** 2025-11-05  
**סטטוס:** ✅ פעיל וגמור
