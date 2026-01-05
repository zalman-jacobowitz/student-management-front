# טופס הגדרת משתמש - תיעוד היישום

## סקירה כללית
הטופס `NewDefinitionStep` בקובץ `new-form.jsx` הוא טופס מדורג (multi-step) המאפשר הגדרה מלאה של משתמשים עם הרשאות גישה מפורטות.

## מבנה הטופס

### שלב 1: פרטי משתמש (User Details)
- **שם פרטי** (`user.firstName`) - שדה טקסט חובה
- **שם משפחה** (`user.lastName`) - שדה טקסט חובה
- **מדינה** (`user.country`) - שדה טקסט חובה
- **דואר אלקטרוני** (`user.email`) - שדה דואר אלקטרוני חובה

### שלב 2: בחירת מסכים (Screens Selection)
- **מסך מידע** (`screens.info`) - שדה Switch
- **מסך הוספה** (`screens.insert`) - שדה Switch

### שלב 3: הרשאות מפורטות (Permissions)
טופס מורכב המאפשר הגדרת הגבלות גישה:

#### פרטי ההגבלה:
- **בחירת טבלה** - בחירה בין `info_students` (תלמידים) או `delays` (עיכובים)
- **בחירת עמודה** - בחירת העמודה הרלוונטית מהטבלה שנבחרה
  - מקור הנתונים: `apiInfoColumns()` - עמודות ייחודיות
- **בחירת ערכים** - בחירה מרובה של ערכים לסינון
  - מקור הנתונים: `apiInfoStudents()` - ערכים ייחודיים מהעמודה שנבחרה
- **סוג החיבור** (Operator) - בחירה בין `AND` (וגם) או `OR` (או)
- **צד ביצוע הפילטור** (Side) - בחירה בין `server` (שרת) או `client` (לקוח)

## מרכיבי הטופס

### 1. `useNewDefinition` Hook
- מטפל בשמירת הנתונים
- מחזיר `true/false` בהתאם להצלחה
- משודר toast עם הודעות אבטחה

```javascript
const { onSubmit: handleExceptionSubmit } = useNewDefinition({ existingUser });
```

### 2. `PermissionsStep` Component
קומפוננטה מורכבת המטפלת בהגדרת הרשאות:

#### תכונות עיקריות:
- **Suspense Queries**: טוען נתונים עמודות ותלמידים באמצעות React Query
- **State Management**: מנהל מצב זמני לטופס ההרשאה
- **Dynamic Columns**: עמודות משתנות בהתאם לטבלה שנבחרה
- **Dynamic Values**: ערכים משתנים בהתאם לעמודה שנבחרה

#### פונקציות:
- `handleTableChange` - עדכן את הטבלה ואפס עמודה וערכים
- `handleColumnChange` - עדכן את העמודה ואפס ערכים
- `handleValueChange` - עדכן את הערכים שנבחרו
- `handleAddPermission` - הוסף הגבלה חדשה
- `handleRemovePermission` - הסר הגבלה קיימת

### 3. `PermissionItemDisplay` Component
מציג הגבלה קיימת בפורמט ידידותי עם:
- שם הטבלה והעמודה
- הערכים שנבחרו
- סוג החיבור
- צד הביצוע
- כפתור הסרה

## Schema ו-Validation

```javascript
const WizardSchema = z.object({
  user: z.object({
    email: z.string().email('כתובת מייל לא תקינה'),
    country: z.string().min(1, 'יש לבחור מדינה'),
    lastName: z.string().min(1, 'שם משפחה נדרש'),
    firstName: z.string().min(1, 'שם פרטי נדרש')
  }),
  screens: z.object({
    info: z.boolean(),
    insert: z.boolean()
  }),
  permissions: z.array(z.object({
    side: z.string(),
    label: z.string(),
    table: z.string(),
    values: z.array(z.string()),
    operator: z.string(),
    columnName: z.string()
  })).optional()
});
```

## השלבים (Steps)

| שלב | תור | שם | סמל | תווית |
|------|-----|------|------|-------|
| 1 | user details | `userDetails` | mdi:account-outline | פרטי משתמש |
| 2 | screens | `screens` | mdi:monitor-outline | בחירת מסכים |
| 3 | permissions | `permissions` | mdi:shield-outline | הרשאות מפורטות |
| 4 | complete | `complete` | - | השלמה |

## Default Values

```javascript
const initialValues = {
  user: existingUser?.user || {
    email: '',
    country: '',
    lastName: '',
    firstName: ''
  },
  screens: existingUser?.screens || {
    info: true,
    insert: true
  },
  permissions: existingUser?.permissions || []
};
```

## ממשק המשתמש (UI)

### שלב 1: טופס טקסט פשוט
- כל שדה מרוהט עם Filled variant
- שדה דואר אלקטרוני עם validation

### שלב 2: Switch Toggles
- שני Toggles לבחירת מסכים
- ברירת מחדל: שניהם מסומנים

### שלב 3: Form המוניטרי
- טופס בכרטיסיה ניטרלית
- רשימת הגבלות קיימות
- כפתור "הוסף הגבלה" ממוקד

## זרימת הנתונים

1. המשתמש מגדיר פרטים בשלב 1
2. המשתמש בוחר מסכים בשלב 2
3. המשתמש מוסיף הגבלות בשלב 3:
   - בוחר טבלה
   - בוחר עמודה (מתעדכנת עם העמודות מהטבלה)
   - בוחר ערכים (מתעדכנים עם הערכים הייחודיים מהעמודה)
   - בוחר operator וside
   - לוחץ על "הוסף"
4. כל הגבלה מתווספת לרשימה
5. ניתן להסיר הגבלות לפי הצורך
6. בסיום, כל הנתונים נשלחים ל-`onSubmit`

## Dialog Integration

```javascript
export function NewDialog({ open, onClose, onComplete, existingUser, editMode=false }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
      <NewDefinitionStep
        existingUser={existingUser?.details}
        onComplete={handleWizardComplete}
        editMode={editMode}
      />
    </Dialog>
  );
}
```

## Features

✅ **Multi-step Wizard** - טופס בשלבים מובנה עם ניווט  
✅ **Dynamic Selects** - בחירות משתנות לפי בחירות קודמות  
✅ **Validation** - validation מלא עם Zod  
✅ **RTL Support** - תמיכה מלאה בעברית  
✅ **Suspense Queries** - טעינה אסינכרונית של נתונים  
✅ **Error Handling** - טיפול בשגיאות עם toast  
✅ **Editable** - תמיכה בעריכה של משתמשים קיימים  
✅ **Responsive Design** - עיצוב מגיב

## שימוש

```jsx
import { NewDialog } from 'src/sections/users/new-form.jsx';

function MyComponent() {
  const [open, setOpen] = useState(false);
  const [existingUser, setExistingUser] = useState(null);

  const handleComplete = (data) => {
    console.log('Form completed:', data);
    // Save to database or API
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>הוסף משתמש</Button>
      <NewDialog
        open={open}
        onClose={() => setOpen(false)}
        onComplete={handleComplete}
        existingUser={existingUser}
        editMode={!!existingUser}
      />
    </>
  );
}
```

## הערות חשובות

1. ההגבלות משמשות לסינון הנתונים שהמשתמש יכול לראות
2. סוג החיבור (AND/OR) קובע כיצד מוגבלות מרובות משולבות
3. הצד (Server/Client) קובע היכן הסינון מתבצע
4. כל עמודה יכולה להכיל הגבלה אחת בלבד
5. ערכים מרובים ב-הגבלה יחידה משומשים עם OR פנימי

