# מקטע Actions - שכבת הנתונים

## מטרה עסקית ותפקיד במערכת

תיקיית Actions משמשת כשכבת הנתונים המרכזית במערכת ניהול הנוכחות. זוהי השכבה שמקשרת בין רכיבי הממשק למשתמש (Frontend Components) לבין השרת (Backend API), ומנהלת את כל פעולות שליפת, עדכון ושמירת הנתונים במערכת.

### תפקידים עיקריים:

#### 1. ניהול תקשורת עם השרת
- **קריאות API מרכזיות**: כל התקשורת עם השרת עוברת דרך קבצי ה-Actions
- **Authentication**: אימות אוטומטי עם Supabase JWT tokens
- **Error Handling**: טיפול מרכזי בשגיאות ותקשורת

#### 2. ניהול מצב נתונים עם React Query
- **Caching**: קאשינג חכם של נתונים לביצועים טובים יותר
- **Background Sync**: סנכרון נתונים ברקע
- **Optimistic Updates**: עדכונים מיידיים בממשק המשתמש

#### 3. שכבת הפשטה (Abstraction Layer)
- **Data Transformation**: המרת נתונים בין השרת לקומפוננטים
- **Normalization**: אחידות במבנה הנתונים
- **Type Safety**: בדיקת תקינות טיפוסי נתונים

## ארכיטקטורה טכנית

### מבנה הקבצים

```
src/actions/
├── info_students.js          # ניהול נתוני תלמידים
├── data_students_event.js    # רישום נוכחות באירועים
├── info_columns.js           # הגדרות עמודות דינמיות
├── select_options.js         # אפשרויות לרשימות נפתחות
├── columns_with_select.js    # שילוב עמודות עם אפשרויות
├── list_of_events.js         # רשימת אירועים
├── events_today.js           # אירועי היום
├── users.js                  # ניהול משתמשים
├── table.js                  # פעולות טבלה כלליות
└── moks/                     # נתוני Mock לבדיקות
    ├── browser.js
    ├── handlers.js
    └── mokes.js
```

### תבניות אינטגרציה עם React Query

#### תבנית Query (קריאה)
```javascript
export function apiTableName() {
  const postData = { table_name: 'table_name', mode: 'select', data: [] };
  return queryOptions({
    queryKey: ['table_name'],
    queryFn: async () => {
      const res = await apiFetch('all', postData);
      return res?.data ?? null;
    },
    suspense: true,
  });
}
```

#### תבנית Mutation (עדכון)
```javascript
export const tableNameUpdate = ({queryClient}) => ({
  mutationKey: ['table_name'],
  mutationFn: async ({data, mode='update'}) => {
    const res = await apiFetch('all', {
      table_name: 'table_name',
      mode,
      data
    });
    return res?.data ?? null;
  },
  onSuccess: (data, _variables, _ctx) => {
    queryClient.invalidateQueries({ queryKey: ['table_name'] });
  },
})
```

### ניהול Authentication

```javascript
// manager-fetch.js מוסיף אוטומטית:
- JWT Token בכותרת Authorization
- פרטי משתמש בגוף הבקשה (user_id, user_email)
- Timestamp לכל בקשה
- Error handling עם מידע מפורט
```

## תיעוד קבצים לפי קטגורייה

### 1. ניהול נתוני תלמידים

#### info_students.js
**תפקיד**: ניהול מרכזי של רשימת התלמידים במערכת

**פונקציות עיקריות**:
- `apiInfoStudents()` - שליפת כל התלמידים
- `infoStudentsUpdate()` - עדכון פרטי תלמידים

**מיוחדויות**:
- המרת נתונים מפורמט שטוח לפורמט key-value pairs
- כל תכונת תלמיד נשמרת כרשומה נפרדת עם `student_id`, `group_name`, `value`

**דוגמת שימוש**:
```javascript
// בקומפוננט
const { data: students } = useSuspenseQuery(apiInfoStudents());
```

#### data_students_event.js
**תפקיד**: רישום ועדכון נוכחות תלמידים באירועים

**פונקציות עיקריות**:
- `apiDataStudentsEvent(tamplateData)` - שליפת נתוני נוכחות
- `dataStudentsEventUpdate()` - עדכון נתוני נוכחות

**מיוחדויות**:
- מותנה ב-`tamplateData` לא ריק (`enabled: !!tamplateData.length`)
- המרת נתוני boolean ("100" = true, "0" = false)
- מבטל קאש של `list_of_events` בעדכון

### 2. הגדרות מערכת

#### info_columns.js
**תפקיד**: ניהול הגדרות עמודות דינמיות לכל הטבלאות במערכת

**פונקציות עיקריות**:
- `apiInfoColumns()` - שליפת הגדרות עמודות

**שימוש**: נטען בכל מסך שמציג טבלאות דינמיות

#### select_options.js
**תפקיד**: אפשרויות לרשימות נפתחות (dropdowns)

**פונקציות עיקריות**:
- `apiSelectOptions()` - שליפת כל האפשרויות

#### columns_with_select.js
**תפקיד**: שילוב הגדרות עמודות עם אפשרויות select

**פונקציות עיקריות**:
- `useInfoColumns(tableName)` - Hook מורכב שמחזיר עמודות עם אפשרויות
- `createSelectOptions()` - פונקציית עזר לשילוב הנתונים

**Logic מתקדם**:
```javascript
// מסנן עמודות לפי table_name
// ממיין לפי שדה sorting
// מצרף אפשרויות select לעמודות מסוג 'select'
```

### 3. ניהול אירועים

#### list_of_events.js
**תפקיד**: רשימת כל האירועים במערכת

**פונקציות עיקריות**:
- `apiListEvents(students_ids)` - שליפת אירועים לפי תלמידים

#### events_today.js
**תפקיד**: אירועים המתרחשים היום

**פונקציות עיקריות**:
- `apiEventsToday(day)` - שליפת אירועי יום ספציפי

### 4. ניהול משתמשים

#### users.js
**תפקיד**: ניהול נתוני משתמשים והרשאות

**פונקציות עיקריות**:
- `apiUsers()` - שליפת כל המשתמשים

### 5. פעולות כלליות

#### table.js
**תפקיד**: פעולות כלליות על טבלאות וייבוא/ייצוא

**פונקציות עיקריות**:
- `useGetTable(table, more)` - Hook כללי לכל טבלה
- `editData()` - המרת נתונים לפני שליחה לשרת
- `updateData()` - פונקציית עדכון כללית

**תכונות מתקדמות**:
- תמיכה בייבוא Excel (`import * as XLSX`)
- Optimistic updates עם rollback
- Error handling עם alert למשתמש

### 6. Mock Data ובדיקות

#### moks/handlers.js
**תפקיד**: Mock Server לבדיקות ופיתוח

**תכונות**:
- Endpoint יחיד `/all` תומך בכל הטבלאות
- מצבי select ו-update
- In-memory database שמחזיק מצב בין בקשות
- אימות Supabase מזויף

## מבנה נתונים מהשרת

### info_students - נתוני תלמידים

```json
{
  "client": "kg_gdola",
  "student_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "user_id": "zalmanjacob@gmail.com",
  "ארץ_לידה": "ישראל",
  "ארץ_לידה_הורים": "פולין",
  "בן_מתחת_גיל_18": "",
  "דואל": "rivka.gutman10@gmail.com",
  "כתובת_מגורים": "דרך מנחם בגין 20, באר שבע",
  "מין": "נקבה",
  "מספר_טלפון": "525678901",
  "משפחה": "גוטמן",
  "שם": "רבקה",
  "שנת_לידה": "2010"
}
```

**שדות מרכזיים**:
- `student_id`: מזהה ייחודי של התלמיד (UUID)
- `user_id`: מזהה המשתמש שיצר את התלמיד (email)
- `client`: זיהוי הלקוח/מוסד
- **שדות דינמיים**: כל השדות האחרים נקבעים דינמית לפי הגדרות `info_columns`

### info_columns - הגדרות עמודות

```json
{
  "client": "kg_gdola",
  "filters": "extra",
  "group_name": "primary",
  "hidden": "",
  "label": "שם",
  "name": "שם",
  "required": "",
  "sorting": 1,
  "table_name": "info_students",
  "type": "text"
}
```

**שדות התצורה**:
- `table_name`: איזו טבלה השדה שייך אליה
- `name`: שם השדה בדאטה (key)
- `label`: התווית שמוצגת למשתמש
- `type`: סוג השדה (text, select, date, checkbox, etc.)
- `sorting`: סדר הצגה בטבלה
- `hidden`: האם להסתיר את העמודה ("t", "1" = מוסתר)
- `filters`: סוג הסינון ("regular", "extra", "" = ללא)
- `group_name`: קיבוץ עמודות ("primary", "secondary")
- `required`: האם השדה חובה

**סוגי שדות נתמכים**:
- `text` - טקסט רגיל
- `select` - רשימה נפתחת
- `date` - תאריך עברי
- `checkbox` - תיבת סימון
- `phone` - מספר טלפון
- `email` - כתובת אימייל
- `address` - כתובת עם השלמה אוטומטית
- `country` - בחירת מדינה

### select_options - אפשרויות לרשימות נפתחות

```json
{
  "client": "kg_gdola",
  "label": "זכר",
  "name": "מין",
  "table_name": "info_students",
  "value": "Male"
}
```

**שדות**:
- `table_name`: לאיזו טבלה האפשרות שייכת
- `name`: לאיזה שדה בטבלה האפשרות שייכת
- `value`: הערך שנשמר בדאטה (באנגלית לרוב)
- `label`: הטקסט שמוצג למשתמש (בעברית)
- `client`: זיהוי הלקוח/מוסד

**דוגמאות אפשרויות**:
- **מגדר**: זכר/נקבה (Male/Female)
- **שיעורים**: א/ב/ג
- **מיקום**: ישראל/ארצות הברית (Asia/Jerusalem, America/New_York)

### supabase_users - נתוני משתמשים

```json
{
  "id": "89588098-774c-4b6c-8f39-5102b0618d90",
  "email": "totalshj@gmail.com",
  "raw_user_meta_data": {
    "user": {
      "email": "totalshj@gmail.com",
      "firstName": "כהן",
      "lastName": "יוסף",
      "country": "Asia/Jerusalem"
    },
    "screens": {
      "info": true,
      "users": false,
      "insert": true,
      "profile": true,
      "userPermissions": false
    },
    "permissions": [
      {
        "side": "server",
        "label": "מייל",
        "table": "info_students",
        "values": ["totalshj@gmail.com"],
        "operator": "and",
        "columnName": "user_id"
      }
    ],
    "stepAccess": {
      "events": {
        "סעודות ליל שבת": true,
        "סעודת ראש השנה": true,
        "מפגשי בר בת מצווה": true
      }
    }
  }
}
```

**מבנה הרשאות**:
- `screens`: גישה למסכים שונים במערכת
- `permissions`: הרשאות ברמת נתונים (איזה תלמידים המשתמש רואה)
- `stepAccess.events`: גישה לאירועים ספציפיים
- `stepUser`: פרטי המשתמש האישיים

### data_students - נתוני נוכחות

```json
{
  "student_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "event_id": "event_123",
  "event_name": "סעודת שבת",
  "date": "2024-01-12",
  "data": true  // או "100" לפני המרה
}
```

**המרות נתונים**:
- השרת מחזיר `"100"/"0"` כמחרוזות
- הקוד ממיר ל-`true/false` לצורך העבודה בקומפוננטים
- בעדכון חוזר ל-`"100"/"0"` לפני שליחה לשרת

## תבניות אינטגרציה נפוצות

### 1. שליפת נתונים בקומפוננט

```javascript
// בקומפוננט רגיל
import { useSuspenseQuery } from '@tanstack/react-query';
import { apiInfoStudents } from 'src/actions/info_students';

function StudentsComponent() {
  const { data: students } = useSuspenseQuery(apiInfoStudents());
  
  return (
    <div>
      {students?.map(student => (
        <div key={student.student_id}>
          {student.שם} {student.משפחה}
        </div>
      ))}
    </div>
  );
}
```

### 2. עדכון נתונים עם Mutation

```javascript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { infoStudentsUpdate } from 'src/actions/info_students';

function EditStudentComponent() {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation(infoStudentsUpdate({ queryClient }));
  
  const handleUpdate = async (studentData) => {
    await mutateAsync({
      data: [studentData],
      mode: 'update'
    });
  };
  
  // ...
}
```

### 3. שימוש בעמודות דינמיות

```javascript
import { useInfoColumns } from 'src/actions/columns_with_select';

function DynamicTableComponent() {
  const { newData: columns } = useInfoColumns('info_students');
  
  // columns מכיל עמודות עם אפשרויות select מוכנות לשימוש
  return (
    <TableComponent columns={columns} />
  );
}
```

### 4. טיפול בשגיאות

```javascript
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

function ComponentWithErrorHandling() {
  const { mutateAsync, isLoading, error } = useMutation({
    mutationFn: updateFunction,
    onError: (error) => {
      toast.error(`שגיאה בעדכון: ${error.message}`);
    },
    onSuccess: () => {
      toast.success('העדכון בוצע בהצלחה');
    }
  });
  
  // ...
}
```

## Best Practices

### 1. שימוש ב-React Query
- השתמש ב-`useSuspenseQuery` לנתונים שחובה שיהיו זמינים
- השתמש ב-`useQuery` לנתונים אופציונליים
- תמיד ספק `queryClient` ל-mutations

### 2. Error Handling
- כל הפונקציות מחזירות `null` במקרה של שגיאה
- השתמש ב-`?.` operator בגישה לנתונים
- הצג הודעות שגיאה ידידותיות למשתמש

### 3. Data Transformation
- המר נתונים בשכבת ה-Actions, לא בקומפוננטים
- שמור על עקביות בתבניות ההמרה
- תעד המרות מיוחדות בקוד

### 4. Caching Strategy
- השתמש ב-`invalidateQueries` אחרי עדכונים
- השתמש ב-`cancelQueries` כשנתונים קשורים משתנים
- ספק `queryKey` עקביים ותיאוריים

## קישורים למסכים

Actions אלו משמשים את המסכים הבאים:
- **מסך תלמידים** (`src/sections/students/`) - `info_students`, `columns_with_select`
- **מסך הכנסת נתונים** (`src/sections/insert/`) - `data_students_event`, `list_of_events`
- **מסך עמודות** (`src/sections/infoColumns/`) - `info_columns`, `select_options`
- **מסך משתמשים** (`src/sections/users/`) - `users`
- **מסך פרופיל** (`src/sections/profile/`) - `info_students`

## הערות פיתוח

### Testing
- השתמש בקבצי ה-Mock לבדיקות יחידה
- ה-Mock Server תומך בכל הפעולות הבסיסיות
- נתוני ה-Mock כוללים דוגמאות מציאותיות

### Performance
- React Query מבצע caching אוטומטי
- השתמש ב-`suspense: true` לטעינה אסינכרונית
- המונע רינדורים מיותרים עם אותם queryKeys

### Security
- כל הבקשות עוברות אימות JWT אוטומטי
- פרטי המשתמש מתווספים אוטומטית לכל בקשה
- Log מפורט לכל קריאות ה-API

---

מסמך זה מספק מבט מקיף על שכבת הנתונים במערכת ניהול הנוכחות ומיועד לסייע למפתחים ולמודלים של בינה מלאכותית להבין את זרימת הנתונים וה-API במערכת.