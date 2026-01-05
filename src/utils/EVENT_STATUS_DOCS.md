# Event Status Utils - תיעוד

## מטרה
קבוצת פונקציות לבדיקת מעמד אירוע ומחזירת טקסט רלוונטי המבוססת על:
- ✓ האם האירוע בעבר (לפי תאריך וזמן התחלה)
- ✓ האם נעשה בו רישום (לפי רשימת האירועים)
- ✓ מידע רלוונטי והודעות למשתמש

## פונקציות

### 1. `getEventStatusText()`
**מטרה:** בדיקה מלאה של מעמד האירוע עם פרטים מלאים

**חתימה:**
```typescript
getEventStatusText(
  event: EventData,
  allEvents: EventData[] = [],
  registeredEvents?: EventData[],
  currentDate?: Date
): EventStatus
```

**הוחזר:**
```typescript
{
  isPast: boolean;                    // האם אירוע בעבר
  hasRegistration: boolean;           // האם יש רישום
  statusText: string;                 // טקסט תיאור מלא
  statusDetails: string[];            // מערך של פרטים
  severity: 'error' | 'warning' | 'success' | 'info';
}
```

**דוגמה:**
```typescript
const event = {
  event_id: '1',
  event_name: 'מתמטיקה',
  day: '2025-11-17',
  event_start: '10:00',
  event_end: '11:00',
};

const status = getEventStatusText(event, allEvents);
console.log(status.statusText); // "✓ אירוע בעבר עם רישום: מתמטיקה (10:00)"
console.log(status.severity);   // "success"
```

### 2. `getEventStatusShortText()`
**מטרה:** קבלת רק הטקסט (בלי צבע או סמל)

**חתימה:**
```typescript
getEventStatusShortText(
  event: EventData,
  allEvents: EventData[] = [],
  registeredEvents?: EventData[],
  currentDate?: Date
): string
```

**דוגמה:**
```typescript
const text = getEventStatusShortText(event, allEvents);
// "✓ אירוע בעבר עם רישום: מתמטיקה (10:00)"
```

### 3. `getEventStatusUI()`
**מטרה:** קבלת נתונים לשימוש בצילום UI (צבע, סמל, טקסט)

**חתימה:**
```typescript
getEventStatusUI(
  event: EventData,
  allEvents: EventData[] = [],
  registeredEvents?: EventData[],
  currentDate?: Date
): {
  color: string;
  icon: string;
  label: string;
  severity: string;
  details: string[];
}
```

**דוגמה:**
```typescript
const ui = getEventStatusUI(event, allEvents);
<Chip
  icon={<Iconify icon={ui.icon} />}
  label={ui.label}
  color={ui.color}
  variant="outlined"
/>
```

## משמעויות ה-Severity

| Status | Severity | משמעות | דוגמה |
|--------|----------|--------|--------|
| **Success** | `success` | אירוע בעבר עם רישום בוצע | ✓ הרישום בוצע בהצלחה |
| **Error** | `error` | אירוע בעבר ללא רישום | ✗ אירוע בעבר ללא רישום |
| **Info** | `info` | אירוע בעתיד עם רישום מתוכנן | ➤ אירוע מתוכנן |
| **Warning** | `warning` | אירוע בעתיד ללא רישום | ⨁ אירוע חדש (עדיין לא מתוכנן) |

## שימוש בקומפוננטה React

### Chip Component
```tsx
import { EventStatusChip } from 'src/utils/event-status-examples';

<EventStatusChip event={selectedEvent} allEvents={allEvents} />
```

### In Form
```tsx
import { useEventStatusHelper } from 'src/utils/event-status-examples';

function MyForm({ selectedEvent, allEvents }) {
  const { canRegister, warningMessage, infoMessage, severity } = 
    useEventStatusHelper(selectedEvent, allEvents);

  return (
    <>
      <Alert severity={severity}>{infoMessage}</Alert>
      {warningMessage && <Alert severity="warning">{warningMessage}</Alert>}
      <Button disabled={!canRegister}>רישום</Button>
    </>
  );
}
```

## שימוש בקומפוננטת Insert Form

```tsx
import { getEventStatusUI } from 'src/utils/event-status';

export function InsertForm() {
  const { methods, eventsToday, listOfTimes } = useInsertForm();
  const selectedEvent = eventsToday.find(e => e.event_id === methods.watch('event'));

  if (selectedEvent) {
    const status = getEventStatusUI(selectedEvent, listOfTimes.data);
    
    return (
      <>
        <Alert severity={status.severity}>
          {status.label}
        </Alert>
        {/* ... שאר הטופס ... */}
      </>
    );
  }
}
```

## בדיקות

כל הפונקציות מכוסות ע"י בדיקות:

```bash
npm test -- event-status.spec.ts
```

בדיקות כוללות:
- ✓ אירוע בעבר ללא רישום
- ✓ אירוע בעבר עם רישום
- ✓ אירוע בעתיד עם רישום
- ✓ אירוע בעתיד ללא רישום
- ✓ Edge cases (missing fields, etc.)

## מבנה EventData

```typescript
interface EventData {
  event_id?: string | number;    // מזהה ייחודי של האירוע
  event_name?: string;           // שם האירוע בעברית
  day?: string;                  // תאריך בפורמט YYYY-MM-DD
  event_start?: string;          // זמן התחלה בפורמט HH:mm
  event_end?: string;            // זמן סיום בפורמט HH:mm
  [key: string]: any;            // שדות נוספים
}
```

## חישובי זמן

### פורמט תאריך וזמן
- **תאריך:** `YYYY-MM-DD` (ISO format)
- **זמן:** `HH:mm` (24-hour format)

### דוגמה:
```javascript
// אירוע: 17 בנובמבר 2025, בשעה 10:30
{
  day: '2025-11-17',
  event_start: '10:30'
}
```

### בדיקת "בעבר"
האירוע נחשב כ"בעבר" אם:
- **זמן התחלת האירוע + יום האירוע < זמן נוכחי**

לדוגמה (עם זמן נוכחי: 17 בנובמבר 2025, 12:00):
- ✓ בעבר: 2025-11-17 10:30
- ✗ לא בעבר: 2025-11-17 13:00
- ✗ לא בעבר: 2025-11-18 10:00

## הערות חשובות

1. **Default allEvents:** אם לא מועבר `allEvents`, הפונקציה תחזיר `hasRegistration: false`
2. **currentDate:** אם לא מועבר, תשתמש בזמן הנוכחי של המערכת
3. **registeredEvents:** שדה אופציונלי למידע נוסף על אירועים מסוגים שונים
4. **Error Handling:** הפונקציות בטוחות לשגיאות בפורמט תאריך/זמן

## דוגמה שימוש מלא

```tsx
import { getEventStatusUI, getEventStatusShortText } from 'src/utils/event-status';

function EventStatusDisplay() {
  const { selectedEvent } = useInsertStore();
  const { data: allEvents } = useSuspenseQuery(apiListEvents());

  const status = getEventStatusUI(selectedEvent, allEvents);
  const shortText = getEventStatusShortText(selectedEvent, allEvents);

  return (
    <Card>
      <CardContent>
        <Chip
          icon={<Iconify icon={status.icon} />}
          label={status.label}
          color={status.color}
        />
        <Typography variant="body2">{shortText}</Typography>
        <List dense>
          {status.details.map((detail) => (
            <ListItem key={detail}>
              <ListItemText primary={detail} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
```
