/**
 * בדיקת מעמד אירוע ומחזירת טקסט רלוונטי
 * תוקף בדיקות על: האם האירוע בעבר, האם נעשה בו רישום, וסטטוס כללי של האירוע
 */

interface EventData {
  event_id?: string | number;
  event_name?: string;
  day?: string;
  event_start?: string;
  event_end?: string;
  [key: string]: any;
}

interface EventStatus {
  isPast: boolean;
  hasRegistration: boolean;
  statusText: string;
  statusDetails: string[];
  severity: 'error' | 'warning' | 'success' | 'info';
}

/**
 * מחזירה אם תאריך וזמן נתון הוא בעבר
 */
function isEventInPast(day: string, eventStart: string, currentDate: Date = new Date()): boolean {
  try {
    // פורמט זמן צפוי: HH:mm
    const [startHour, startMinute] = eventStart.split(':').map(Number);
    
    // יצירת Date object לאירוע
    const eventDate = new Date(`${day}T${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}:00`);
    
    return eventDate < currentDate;
  } catch (error) {
    console.error('שגיאה בבדיקת זמן האירוע:', error);
    return false;
  }
}

/**
 * מחזירה אם לאירוע יש רישום בהיסטוריה
 */
function hasEventRegistration(
  event: EventData,
  allEvents: EventData[],
  registeredEvents?: EventData[]
): boolean {
  if (!event.event_id || !allEvents) {
    return false;
  }

  // בדיקה אם האירוע קיים ברשימת כל האירועים (סימן שנעשה בו רישום)
  const isRegistered = allEvents.some(
    (e) => e.event_id === event.event_id && e.day === event.day
  );

  return isRegistered;
}

/**
 * פונקציה ראשית: בדיקת מעמד אירוע ומחזירת טקסט רלוונטי
 * 
 * @param event - אובייקט האירוע
 * @param allEvents - רשימת כל האירועים המעודכנים
 * @param registeredEvents - אופציונלי: רשימת אירועים שנעשה בהם רישום
 * @param currentDate - אופציונלי: תאריך ושעה לבדיקה (לצורך טסטינג)
 * @returns EventStatus - מעמד האירוע עם טקסט רלוונטי
 */
export function getEventStatusText(
  event: EventData,
  allEvents: EventData[] = [],
  registeredEvents?: EventData[],
  currentDate?: Date
): EventStatus {
  const now = currentDate || new Date();
  const details: string[] = [];
  let statusText = '';
  let severity: 'error' | 'warning' | 'success' | 'info' = 'info';

  // בדיקה 1: האם האירוע בעבר?
  const isPast = event.day && event.event_start ? isEventInPast(event.day, event.event_start, now) : false;

  // בדיקה 2: האם נעשה רישום לאירוע?
  const hasRegistration = hasEventRegistration(event, allEvents, registeredEvents);

  // בנייה של הפלט
  if (isPast) {
    details.push(`אירוע בעבר (${event.day})`);
    severity = 'warning';

    if (hasRegistration) {
      details.push('עשוי לכלול רישום בוצע');
      statusText = `✓ אירוע בעבר עם רישום: ${event.event_name} (${event.event_start})`;
      severity = 'success';
    } else {
      details.push('לא בוצע רישום');
      statusText = `✗ אירוע בעבר ללא רישום: ${event.event_name}`;
      severity = 'error';
    }
  } else {
    // אירוע בעתיד או בהווה
    details.push(`אירוע עתידי/בהווה (${event.day})`);
    severity = 'info';

    if (hasRegistration) {
      details.push('קיים בתוכנית');
      statusText = `➤ אירוע מתוכנן: ${event.event_name} (${event.event_start} - ${event.event_end})`;
      severity = 'info';
    } else {
      details.push('חדש או לא מתוכנן');
      statusText = `⨁ אירוע חדש: ${event.event_name} (${event.event_start})`;
      severity = 'warning';
    }
  }

  return {
    isPast,
    hasRegistration,
    statusText,
    statusDetails: details,
    severity,
  };
}

/**
 * גרסה מקוצרת: מחזירה רק את הטקסט הרלוונטי
 */
export function getEventStatusShortText(
  event: EventData,
  allEvents: EventData[] = [],
  registeredEvents?: EventData[],
  currentDate?: Date
): string {
  const status = getEventStatusText(event, allEvents, registeredEvents, currentDate);
  return status.statusText;
}

/**
 * גרסה לצילום בתוך UI: מחזירה צבע וסמל לפי המעמד
 */
export function getEventStatusUI(
  event: EventData,
  allEvents: EventData[] = [],
  registeredEvents?: EventData[],
  currentDate?: Date
) {
  const status = getEventStatusText(event, allEvents, registeredEvents, currentDate);

  const colorMap = {
    error: 'error',
    warning: 'warning',
    success: 'success',
    info: 'info',
  };

  const iconMap = {
    error: 'solar:close-circle-bold-duotone',
    warning: 'solar:alarm-bold-duotone',
    success: 'solar:check-circle-bold-duotone',
    info: 'solar:info-circle-bold-duotone',
  };

  return {
    color: colorMap[status.severity],
    icon: iconMap[status.severity],
    label: status.statusText,
    severity: status.severity,
    details: status.statusDetails,
  };
}
