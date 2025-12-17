/**
 * דוגמאות שימוש בפונקציות בדיקת מעמד אירוע
 */

import {
  getEventStatusText,
  getEventStatusShortText,
  getEventStatusUI,
} from './event-status';

// דוגמה 1: אירוע בעבר ללא רישום
const pastEventNoRegistration = {
  event_id: '1',
  event_name: 'דרמה',
  day: '2025-11-10',
  event_start: '10:30',
  event_end: '11:30',
};

// דוגמה 2: אירוע בעתיד עם רישום
const futureEventWithRegistration = {
  event_id: '2',
  event_name: 'מתמטיקה',
  day: '2025-11-20',
  event_start: '14:00',
  event_end: '15:00',
};

// רשימת כל האירועים
const allEvents = [
  futureEventWithRegistration,
  {
    event_id: '3',
    event_name: 'אנגלית',
    day: '2025-11-19',
    event_start: '09:00',
    event_end: '10:00',
  },
];

// דוגמת שימוש:
console.log('--- דוגמה 1: אירוע בעבר ---');
const status1 = getEventStatusText(
  pastEventNoRegistration,
  allEvents,
  undefined,
  new Date('2025-11-17T12:00:00')
);
console.log('סטטוס מלא:', status1);
console.log('טקסט קצר:', getEventStatusShortText(pastEventNoRegistration, allEvents));
console.log('UI:', getEventStatusUI(pastEventNoRegistration, allEvents));

console.log('\n--- דוגמה 2: אירוע בעתיד עם רישום ---');
const status2 = getEventStatusText(
  futureEventWithRegistration,
  allEvents,
  undefined,
  new Date('2025-11-17T12:00:00')
);
console.log('סטטוס מלא:', status2);
console.log('טקסט קצר:', getEventStatusShortText(futureEventWithRegistration, allEvents));
console.log('UI:', getEventStatusUI(futureEventWithRegistration, allEvents));

/**
 * שימוש ב-React Component:
 */
import { Chip, Tooltip } from '@mui/material';
import { Iconify } from 'src/components/iconify/iconify';

export function EventStatusChip({ event, allEvents }) {
  const ui = getEventStatusUI(event, allEvents);

  return (
    <Tooltip title={ui.details.join(', ')}>
      <Chip
        icon={<Iconify icon={ui.icon} />}
        label={ui.label}
        color={ui.color as any}
        variant="outlined"
        size="medium"
      />
    </Tooltip>
  );
}

/**
 * שימוש בהטופס (Insert Form):
 */
export function useEventStatusHelper(selectedEvent, allEvents) {
  const status = getEventStatusText(selectedEvent, allEvents);

  return {
    canRegister: !status.isPast || status.hasRegistration, // ניתן לערוך רק אם לא בעבר או אם כבר היה רישום
    warningMessage: status.isPast && !status.hasRegistration 
      ? 'זהו אירוע בעבר ולא בוצע בו רישום'
      : undefined,
    infoMessage: status.statusText,
    severity: status.severity,
  };
}
