# מקטע הכנסת נתונים - Insert Section

## מטרה עסקית ושימוש במסך

מקטע זה מיועד לרישום נוכחות תלמידים באירועים שונים במערכת ניהול הנוכחות. המשתמש יכול לבחור אירוע מתוך רשימת האירועים הזמינים, לרשום נוכחות של תלמידים, ולשמור את הנתונים במערכת.

### זרימת עבודה למשתמש:
1. **בחירת אירוע**: המשתמש בוחר אירוע מתוך רשימת האירועים של היום או אירועים קודמים
2. **רישום נוכחות**: המשתמש מסמן נוכחות/חיסור עבור כל תלמיד
3. **שמירת נתונים**: המשתמש שומר את הנתונים במערכת

### תכונות מתקדמות:
- **העתקה והדבקה**: אפשרות להעתיק נתונים מאירוע אחד ולהדביק באירוע אחר
- **חיפוש וסינון**: חיפוש תלמידים לפי שם וסינון לפי סטטוס נוכחות
- **מיון**: מיון רשימת התלמידים לפי קריטריונים שונים
- **ייצוא**: ייצוא נתונים לקובץ Excel (בפיתוח)

## ארכיטקטורה טכנית

### ניהול מצב (State Management)
המסך משתמש ב-Zustand store (`insert-state.ts`) לניהול מצב המסך:
- `selectEventScreen`: מצב המסך - בחירת אירוע או רישום נוכחות
- `selectedEvent`: האירוע שנבחר
- `currentData`: נתוני התלמידים הנוכחיים
- `previousData`: נתונים שהועתקו לשימוש בהדבקה

### זרימת נתונים (Data Flow)
- **React Query**: לטעינת נתונים מהשרת (תלמידים, אירועים, נתוני נוכחות)
- **React Hook Form**: לניהול טפסים ואימות נתונים
- **Zod**: לאימות נתונים בטפסים

### ניווט דו-שלבי
המסך עובד בשני שלבים:
1. **שלב בחירת אירוע** (`selectEventScreen: true`)
2. **שלב רישום נוכחות** (`selectEventScreen: false`)

## מבנה הקומפוננטות

### נקודת הכניסה הראשית
```typescript
// view/insert-view.tsx
```
- **תפקיד**: נקודת כניסה למסך עם Suspense wrapper
- **קומפוננטות**: `InsertForm` או `InsertListView` לפי מצב המסך
- **תלויות**: `useInsertStore`, `useSuspenseQuery`, `useInfoColumns`

### מסכים ראשיים

#### 1. מסך בחירת אירוע
```typescript
// form-event/insert-form-defind-event.tsx
```
- **תפקיד**: בחירת אירוע לרישום נוכחות
- **תכונות**: 
  - בחירת תאריך עברי
  - בחירת אירוع מרשימת אירועי היום
  - גישה לאירועים קודמים
- **טפסים**: React Hook Form עם Zod validation
- **קומפוננטות עיקריות**:
  - `Field.HebrewDatePicker` - בחירת תאריך עברי
  - `Field.Select` - בחירת אירוע
  - `InsertFormPastEvents` - רשימת אירועים קודמים

#### 2. מסך רישום נוכחות
```typescript
// insert-screen/insert-screen.tsx
```
- **תפקיד**: מסך ראשי לרישום נוכחות תלמידים
- **קומפוננטות**:
  - `InsertListHeader` - כותרת המסך עם סיכום
  - `InsertToolbar` - כלי עזר וניווט
  - `InsertList` - רשימת התלמידים לרישום
- **פונקציונליות**:
  - עדכון נתוני נוכחות
  - מחיקת נתונים
  - ניהול טפסים

### קומפוננטות משתפות

#### כלי עזר וניווט
```typescript
// insert-screen/insert-toolbar.tsx
```
- **כפתורים**: חזרה, העתקה/הדבקה, פעולות נוספות
- **סינון ומיון**: `RegularSelect` עם אפשרויות סינון ומיון
- **חיפוש**: `RegularSearch` לחיפוש תלמידים
- **תפריט פעולות**: `PopoverActions` למחיקה וייצוא

#### רשימת התלמידים
```typescript
// insert-screen/insert-list.tsx
```
- **תפקיד**: הצגת רשימת התלמידים לרישום נוכחות
- **תכונות**:
  - Grid responsive לתצוגה בכל הגדלים
  - `Field.BoolianList` לכל תלמיד
  - הצגת פרטי תלמיד (ראשי ומשני)
- **טפסים**: React Hook Form לניהול נתוני הנוכחות

#### קומפוננטות עזר
```typescript
// components/
```
- **`copy-paste-buttons.tsx`**: כפתורי העתקה והדבקה
- **`page-title.tsx`**: כותרת דף דינמית
- **`regular-button.tsx`**: כפתור מותאם אישית
- **`regular-search.tsx`**: שדה חיפוש מותאם
- **`reglar-select.tsx`**: רכיב Select מותאם
- **`label-summary.tsx`**: תצוגת סיכום נתונים

### אירועים קודמים
```typescript
// form-event/insert-form-past-events.tsx
```
- **תפקיד**: הצגת רשימת אירועים קודמים לעריכה
- **תכונות**:
  - רשימה גלילה עם אירועים קודמים
  - תאריכים בעברית
  - בחירת אירוע לעריכה
- **מצבי טעינה**: `InsertFormEventLoading` לטעינה

## פונקציות עזר

### מעבד נתונים
```typescript
// functions.ts
```
- **`get_students_ids`**: מחילוץ מזהי תלמידים
- **`description`**: יצירת תיאורים לתלמידים (ראשי ומשני)
- **`descriptionColumns`**: חלוקת עמודות לקבוצות תיאור
- **`insertTemplate`**: יצירת תבנית נתונים לרישום
- **`changeBool`**: המרת ערכי boolean למספרים
- **`formValues`**: הכנת ערכי ברירת מחדל לטפסים

### טעינת נתונים
```typescript
// insert-screen/functions-insert-load-data.tsx
```
- **`useLoadCurrentData`**: Custom hook לטעינת נתונים נוכחיים
- **תפקיד**: סינכרון נתונים מהשרת עם מצב המסך המקומי

## תלויות וקומפוננטות חיצוניות

### ספריות חיצוניות
- **React Query**: `useSuspenseQuery`, `useQuery`, `useMutation`
- **React Hook Form**: `useForm`, `Controller`, `Field`
- **Zod**: לאימות נתונים בטפסים
- **Lodash**: `orderBy` למיון נתונים
- **Sonner**: `toast` להודעות למשתמש

### קומפוננטות מערכת
- **Layout**: `DashboardContent` לפריסת המסך
- **UI Components**: 
  - `LoadingScreen` - מסך טעינה
  - `EmptyContent` - תוכן ריק
  - `ButtonGreen` - כפתור ירוק מותאם
  - `ConfirmDialog` - דיאלוג אישור
- **Form Components**: 
  - `Form`, `Field` - קומפוננטות טפסים
  - `Field.HebrewDatePicker` - בחירת תאריך עברי
  - `Field.BoolianList` - רשימת ערכי boolean
- **Utility Components**:
  - `PopoverActions` - תפריט פעולות
  - `ComponentContainer` - מיכל לקומפוננטות

### Actions (API Calls)
- **`apiInfoStudents`**: טעינת פרטי תלמידים
- **`apiEventsToday`**: טעינת אירועי היום
- **`apiListEvents`**: טעינת רשימת אירועים
- **`apiDataStudentsEvent`**: טעינת נתוני נוכחות
- **`dataStudentsEventUpdate`**: עדכון נתוני נוכחות
- **`useInfoColumns`**: טעינת הגדרות עמודות

### Custom Hooks
- **`useBoolean`**: ניהול מצב boolean
- **`useUpdate`**: עדכון נתונים בשרת
- **`useInsertStore`**: גישה למצב המסך
- **`useLoadCurrentData`**: טעינת נתונים נוכחיים

## הערות מיוחדות

### תמיכה בעברית
- כל הטקסטים בעברית
- תמיכה בתאריכים עבריים
- כיוון RTL נתמך

### בדיקות (Testing)
- כל הקומפוננטות כולל `data-testid` לבדיקות אוטומטיות
- תמיכה בבדיקות Playwright

### ביצועים
- שימוש ב-Suspense לטעינה אסינכרונית
- React Query לקאשינג נתונים
- Zustand לניהול מצב קל משקל

---

מסמך זה מספק מבט מקיף על מקטע הכנסת הנתונים ומיועד לסייע למפתחים ולמודלים של בינה מלאכותית להבין את המבנה והשימוש במסך זה.