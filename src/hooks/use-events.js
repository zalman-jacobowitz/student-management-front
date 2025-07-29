import { create } from "zustand";

function textMinuts(min) {
  let formatS = ''
  if (min > 60) {
      if (min > 120) {
          formatS += `${parseInt(min / 60, 10)} שעות`
      }
      else {
          formatS += 'שעה'
      }
      formatS += ` ו${Math.round(((min / 60) - parseInt(min / 60, 20)) * 60)} דקות`
  }
  else {
      formatS += `${Math.round(min)} דקות`
  }
  return formatS
}

export function timeNow(location='Asia/Jerusalem') {
  // הגדרת אזור הזמן של ישראל
  const now = new Date();

  // קבלת התאריך והשעה בפורמט ישראל
  const options = {
      timeZone: location,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
  };

  // שימוש ב-Intl.DateTimeFormat להדפסת הזמן
  const formatter = new Intl.DateTimeFormat('en-US', options);
  const israelTimeString = formatter.format(now);

  // החזרת אובייקט תאריך בזמן ישראל
  const israelTime = new Date(
      new Date().toLocaleString('en-US', { timeZone: location })
  );

  return israelTime;
}

function timeStringToMinutes(timeString) {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * פונקציה המחזירה את זמן שחלף מאז תחילת האירוע בפורמט HH:MM
 * @param {number} ms - מספר מילישניות שחלפו
 * @returns {string} - זמן בפורמט HH:MM (שעות:דקות)
 */
function formatElapsedTime(ms) {
  // המרת מילישניות לשעות ודקות
  const totalMinutes = Math.floor(ms / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  // פורמט לתצוגה עם אפסים מובילים
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * פונקציה המחזירה מערך של ערכים יחודיים מתוך מערך אובייקטים לפי מפתח אחד או שניים
 * @param {Array} array - המערך המקורי
 * @param {string} key - המפתח הראשון שאת ערכיו אנו רוצים לחלץ
 * @param {string} [secondKey] - מפתח שני אופציונלי לסינון כפול
 * @returns {Array} - מערך חדש המכיל את כל הערכים היחודיים (כמחרוזות או כאובייקטים אם יש שני מפתחות)
 */
export function getUniqueValues(array, key, secondKey) {
  // אם לא הועבר מפתח שני, נשתמש בפונקציונליות המקורית
  if (!secondKey) {
    const uniqueValuesSet = new Set();
    
    array.forEach(item => {
      if (item && item[key] !== undefined) {
        uniqueValuesSet.add(item[key]);
      }
    });
    
    return Array.from(uniqueValuesSet);
  }
  
  // אם יש מפתח שני, נבצע סינון כפול
  const uniquePairsMap = new Map();
  
  array.forEach(item => {
    if (item && item[key] !== undefined && item[secondKey] !== undefined) {
      // יצירת מחרוזת מפתח המשלבת את שני הערכים לזיהוי יחודי
      const compositeKey = `${item[key]}_${item[secondKey]}`;
      
      if (!uniquePairsMap.has(compositeKey)) {
        // שמירת האובייקט המכיל את שני הערכים
        uniquePairsMap.set(compositeKey, {
          [key]: item[key],
          [secondKey]: item[secondKey]
        });
      }
    }
  });
  
  // המרת המפה למערך של אובייקטים
  return Array.from(uniquePairsMap.values());
}
const useEventStore = create((set, get) => ({
    events: [], // כל האירועים
    availableWeeks: [],
    availableDays: [], // רשימת הימים הזמינים
    availableTimes: [], // האירועים של היום הנבחר
    current: {},
    start: () => new Date(`${get().current.day} ${get().current.start_event}`).getTime(),
    end: () => new Date(`${get().current.day} ${get().current.end_event}`).getTime(),
    minute: () => (get().end() - get().start()) / 60000,
    isSeder: (location='Asia/Jerusalem') => {
      const getDateNow = timeNow(location).getTime();
      const sederNow = get().start() < getDateNow && get().end() > getDateNow;
      return sederNow;
    },
    lateTime: (time) => {
      const thisTime = timeStringToMinutes(time) * 60000
      const precent = 100 - (thisTime / ((get().end() - get().start()) / 100 ))
      return precent.toFixed(1);
    },
    lateInMinutes: (pcnt) => {
      const precent = (get().end() - get().start()) / 100 
      const m = ((100 - pcnt ) * precent) / 60000
      return textMinuts(m)
    },
    lateInMinutesEvent: (pcnt, event, day) => {
      const { events } = get()
      const eventDetails = events.find(e => e.event === event && e.day === day)
      if (!eventDetails) return '00:00'
      const start = new Date(`${eventDetails.day} ${eventDetails.start_event}`).getTime()
      const end = new Date(`${eventDetails.day} ${eventDetails.end_event}`).getTime()
      const precent = (end - start) / 100 
      const m = ((100 - pcnt ) * precent) / 60000
      return textMinuts(m)
    },
    // אתחול הרשימה
    initialize: (eventList) => {
      eventList.reverse()
      
      const uniqueWeeks = getUniqueValues(eventList, "week");
      const  { current } = get()
      const newCurrent = current.week? current : eventList[0]

      set({
        events: eventList,
        availableWeeks: uniqueWeeks,
        availableDays:
        getUniqueValues(eventList.filter((event) => event.week === newCurrent?.week), "day", "יום_מלא"),
        availableTimes: getUniqueValues(eventList.filter(
          (event) => event.day === newCurrent?.day
        ), "event"),
        current: newCurrent
        
      });
      
    },
    selectWeek: (week) => {
      const { events } = get();
      const daysForWeek = events.filter((event) => event.week === week)
      if (daysForWeek.length > 0) {
        set({
          availableDays: getUniqueValues(daysForWeek, "day", "יום_מלא"),
          availableTimes: getUniqueValues(events.filter(
            (event) => event.day === daysForWeek[0].day
          ), "event"),
          current: daysForWeek[0]
        });
      }
    },
    // בחירת יום
    selectDay: (day) => {
          const { events, current  } = get();
          const eventsForDay = events.filter((event) => event.day === day)
          const thisTime = eventsForDay.filter(e => e.event === current.event);
          if (eventsForDay.length > 0) {
            set({
              availableTimes:  getUniqueValues(eventsForDay, "event"),
              current: thisTime.length ? thisTime[0]: eventsForDay[0]
            });
          }
        },
    // בחירת אירוע ספציפי
    selectEvent: (thisEvent) => {
      const { events , current} = get();
      const selectedEvent = events.find((event) => event.event === thisEvent && event.day === current.day);
      if (selectedEvent) {
        set({
          current: selectedEvent
        });
      }
    },
    exceptionEvent: () => ({start: get().start(), end: get().end()}),
    exceptionDay: () => ({
      start: new Date(`${get().current.day} 00:00:00`).getTime(),
      end: new Date(`${get().current.day} 23:59:59`).getTime(),
    }),
    lastEvent: ()=>{
      const { events } = get();
      const lastIndex = 0;
      if (lastIndex < events.length) {
        const nextEvent = events[lastIndex];
        set({
          currentIndex: lastIndex,
          currentDay: nextEvent.day,
          currentTime: nextEvent.event,
          availableTimes: events.filter(
            (event) => event.day === nextEvent.day
          ).map(e=> e.event),
          current: nextEvent
        });
      }
    },
    // מעבר לאירוע הבא
    nextEvent: () => {
      const { events, currentIndex } = get();
      const nextIndex = currentIndex - 1;
      if (nextIndex < events.length) {
        const nextEvent = events[nextIndex];
        set({
          currentIndex: nextIndex,
          currentDay: nextEvent.day,
          currentTime: nextEvent.event,
          availableTimes: events.filter(
            (event) => event.day === nextEvent.day
          ).map(e=> e.event),
          current: nextEvent
        });
      }
    },
  
    // מעבר לאירוע הקודם
    previousEvent: () => {
      const { events, currentIndex } = get();
      const prevIndex = currentIndex + 1;
      if (prevIndex >= 0) {
        const prevEvent = events[prevIndex];
        set({
          currentIndex: prevIndex,
          currentDay: prevEvent.day,
          currentTime: prevEvent.event,
          availableTimes: events.filter(
            (event) => event.day === prevEvent.day
          ).map(e=>e.event),
          current: prevEvent
        });
      }
    },
    
    // פונקציה חדשה שמחזירה כמה זמן עבר מתחילת האירוע בפורמט MM:SS
    getElapsedTime: (location='Asia/Jerusalem') => {
      const { start , isSeder } = get()
      if (!isSeder(location)) return "00:00";
      
      const now = timeNow(location).getTime();
      
      const elapsedMs = now - start();
      
      return formatElapsedTime(elapsedMs);
    }

  }));
  
  export default useEventStore;
