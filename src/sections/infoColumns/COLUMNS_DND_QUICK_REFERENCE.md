# DnD Columns - Quick Reference Guide

## 🎯 שימוש מהיר

### Import ה-Component:
```typescript
import { SortableColumnsList } from "src/sections/infoColumns/columns-sortable-list";
```

### שימוש בקוד:
```tsx
<SortableColumnsList
  columns={columns}
  handleColumnClick={handleColumnClick}
  onOrderChange={handleOrderChange}
/>
```

---

## 📂 מבנה הקבצים

```
src/sections/infoColumns/
├── columns-dnd-functions.ts            # 🔧 לוגיקה ניהול
├── columns-dnd.types.ts                # 📝 טיפוסים וממשקים  
├── columns-sortable-list.tsx           # 🎨 UI Component
├── columns-minimal-list-view.tsx       # 👨‍👩‍👧‍👦 Parent Component
├── COLUMNS_DND_DOCUMENTATION.md        # 📚 תיעוד מלא
└── COLUMNS_DND_QUICK_REFERENCE.md     # 📖 זה הקובץ
```

---

## 🚀 Features

| תכונה | סטטוס | הערות |
|------|--------|--------|
| Drag & Drop | ✅ | גרירה של עמודות |
| Mouse Support | ✅ | עכבר |
| Touch Support | ✅ | מסך מגע |
| Keyboard | ✅ | חצים + מקלדת |
| Save to Server | ✅ | אוטומטי |
| Toast Notifications | ✅ | הצלחה/שגיאה |
| Undo on Error | ✅ | חזרה לאחור |
| RTL | ✅ | עברית |

---

## 🔑 Key Functions

### `saveColumnOrder(columns, queryClient)`
שומרת סדר לשרת
```typescript
import { saveColumnOrder } from "./columns-dnd-functions";

await saveColumnOrder(columns, queryClient);
```

### `reorderColumns(columns, fromIndex, toIndex)`
מחזירה סדר חדש (ללא שמירה)
```typescript
const reordered = reorderColumns(columns, 0, 2);
```

### `validateColumnOrder(columns)`
בדוקת תוקף
```typescript
const isValid = validateColumnOrder(columns);
```

---

## 🎨 Component Props

```typescript
interface SortableColumnsListProps {
  columns: InfoColumn[];                        // רשימת עמודות
  handleColumnClick: (col: InfoColumn) => void; // לחיצה על עמודה
  onOrderChange?: (cols: InfoColumn[]) => void; // שינוי order
}
```

---

## 💾 Data Flow

```
מקבל columns → DnD Container → שינוי ברמה מקומית → שמירה בשרת → Toast
```

---

## ⚙️ Configuration

### Sensors (חיישנים):
- **MouseSensor** - לעכבר
- **TouchSensor** - לטאץ'
- **KeyboardSensor** - לקיצורי מקלדת

### Collision Detection:
```typescript
closestCenter // זיהוי התנגשויות לפי המרכז
```

---

## 🐛 Troubleshooting

### בעיה: העמודות לא משתנות סדר
- ✓ בדוק שהעמודות בעלות `name` ייחודי
- ✓ ודא שה-`columns` prop מועדכן

### בעיה: שגיאה בשמירה
- ✓ בדוק את ה-`queryClient`
- ✓ בדוק את החיבור לשרת
- ✓ בדוק את הקונסול לשגיאות

### בעיה: DnD לא עובד באופן כולל
- ✓ ודא ש-@dnd-kit packages מותקנים
- ✓ בדוק import paths
- ✓ בדוק את הקונסול

---

## 📦 Dependencies

```json
{
  "@dnd-kit/core": "^x.x.x",
  "@dnd-kit/sortable": "^x.x.x",
  "@dnd-kit/utilities": "^x.x.x",
  "@tanstack/react-query": "^x.x.x",
  "@mui/material": "^x.x.x",
  "sonner": "^x.x.x"
}
```

---

## 🔍 Inspecting State

### בקומפוננטה:
```typescript
console.log("Sorted columns:", sortedColumns);
console.log("Active column:", activeColumn);
console.log("Is saving:", isSaving);
```

---

## 💡 Tips & Tricks

### 1. Track changes:
```typescript
const [originalColumns, setOriginalColumns] = useState(columns);
const hasChanged = JSON.stringify(sortedColumns) !== JSON.stringify(originalColumns);
```

### 2. Debug order:
```typescript
console.table(sortedColumns.map((c, i) => ({ name: c.name, index: i })));
```

### 3. Reset order:
```typescript
setSortedColumns(columns);
```

---

## 🎓 Learning Resources

1. **@dnd-kit Documentation**: https://docs.dndkit.com/
2. **Sortable Plugin**: https://docs.dndkit.com/presets/sortable
3. **React Hook Form**: https://react-hook-form.com/
4. **Material-UI**: https://mui.com/

---

## ✨ Best Practices

- ✅ תמיד בדוק את ה-`columns` prop
- ✅ תן משוב למשתמש (Toast)
- ✅ טפל בשגיאות בעדינות
- ✅ שמור את סדר בשרת
- ✅ בדוק סוגים עם TypeScript

---

## 📞 Support

עבור בעיות או שאלות:
1. בדוק את `COLUMNS_DND_DOCUMENTATION.md`
2. בדוק את הקונסול לשגיאות
3. בדוק את Network tab ב-DevTools
4. בדוק את ה-Database

---

**Last Updated:** 2025-11-05  
**Version:** 1.0
