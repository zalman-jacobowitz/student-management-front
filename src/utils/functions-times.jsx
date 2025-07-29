import useEventStore from "src/hooks/use-events"


export function stringLaters(mode = 'now') {
    let formatS = ''
    const late = mode === 'now' ? 60 : mode

    if (late > 60) {
        if (late > 120) {
            formatS += `${parseInt(late / 60, 10)} שעות`
        }
        else {
            formatS += 'שעה'
        }
        formatS += ` ו${Math.round(((late / 60) - parseInt(late / 60, 20)) * 60)} דקות`
    }
    else {
        formatS += `${Math.round(late)} דקות`
    }
    return formatS
}



export function formatTextMinuts(mode = 'now') {
    let formatS = ''
    const minute = useEventStore.getState().minute()
    const late = mode === 'now' ? minute : mode
    if (late > 60) {
        if (late > 120) {
            formatS += `${parseInt(late / 60, 10)} שעות`
        }
        else {
            formatS += 'שעה'
        }
        formatS += ` ו${Math.round(((late / 60) - parseInt(late / 60, 20)) * 60)} דקות`
    }
    else {
        formatS += `${Math.round(late)} דקות`
    }
    return formatS
}

export function useInfoColumn(data, allSelect = false) {
    const gaps = null

    if (data && gaps.data) {

        const info = gaps.data
        const newInfo = info.map(e => {
            const newE = e
            if (!Object.keys(newE).includes('options')) {
                if (allSelect || e.type === 'select') {
                    newE.options = [...new Set(data.map(r => r[e.name]))]
                }
            }

            return newE
        })

        return newInfo
    }
    return []
}
export function useFilterColumn(data, infoColumns, allSelect = false) {
    if (data) {

        const info = infoColumns
        const newInfo = info.map(e => {
            const newE = e

            if (!Object.keys(newE).includes('options')) {
                if (allSelect || e.type === 'select') {
                    if (allSelect || e.select.type === 'self') {
                        newE.options = [...new Set(data.map(r => r[e.id]))]
                    }
                }
            }

            return newE
        })

        return newInfo
    }
    return []
}


export function toHebrew(dt, dates, withDay = true, month = true) {

    return dt
}

function timeNow() {
    // הגדרת אזור הזמן של ישראל
    const now = new Date();

    // קבלת התאריך והשעה בפורמט ישראל
    const options = {
        timeZone: 'Asia/Jerusalem',
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
        new Date().toLocaleString('en-US', { timeZone: 'Asia/Jerusalem' })
    );

    return israelTime;
}

export function convertTime(dt) {
    // get date format - new Date()
    // return string for example: '2024-01-01'
    // קבלת התאריך והשעה בפורמט המיועד
    const formatter = dt.toISOString().slice(0, 10)
    const israelTime = formatter.replace('/', '-').replace('/', '-');
    return israelTime
}

export const FormatTime = (timeF) => timeF.length === 3 ? `0${timeF}` : timeF
// get string - '100'
// return string - '0100'

export function converDateTime(Time, Day) {
    const dateTimeString = `${Day} ${FormatTime(Time)}`
    const formattedDateTime = `${dateTimeString.slice(0, 11)} ${dateTimeString.slice(11, 13)}:${dateTimeString.slice(13)}`
    return new Date(formattedDateTime)
}


export function toTime() {

    const start = 56
    // const end = converDateTime(readLocal('end'), readLocal('day')).getTime()
    const dateNow = new Date().getTime()
    // יצירת אובייקט תאריך עבור השעה הנוכחית

    const totalLate = dateNow - start
    const inPresernt = totalLate / (1000 * 60);
    return String(inPresernt)
}

export function presentToTime(present) {
    const dateLate = (totalTime('present') * present) / (1000 * 60);
    return stringLaters(dateLate)
}

export function lateInMinute() {
    const start = 56
    const dateNow = 56
    const totalLate = dateNow - start
    const inMinute = totalLate / 60000
    return converToMformat(parseInt(inMinute, 10))
}

const Format = (n) => n < 10 ? `0${n}` : n


export function dateToTime(date) {
    // קבלת השעה והדקה
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // הוספת אפסים במידה והערך קטן מ-10
    const newhours = hours < 10 ? `0${hours}` : hours;
    const newminutes = minutes < 10 ? `0${minutes}` : minutes;

    // חיבור השעה והדקה לפורמט "hh:mm"
    const timeString = `${newhours}:${newminutes}`

    return timeString
}

export function converToMformat(date) {
    const Hours = date > 60 ? parseInt(date / 60, 10) : 0
    const Minute = Hours ? parseInt(date - (Hours * 60), 10) : parseInt(date, 10)
    return `${Format(Hours)}:${Format(Minute)}`
}



const totalTime = (mode = 'time') => mode === 'time' ? 56 : 56

export function timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map((num) => Number(num));
    return hours * 60 + minutes;
}


export function calculateAttendance(eventStart, eventEnd, studentArrival) {
  const start = timeToMinutes(eventStart);
  const end   = timeToMinutes(eventEnd);
  const arrive= timeToMinutes(studentArrival);

  const eventDuration = end >= start ? end - start : 1440 - start + end;
  const latenessMinutes = arrive - start;

  let presentMinutes;
  if (latenessMinutes >= eventDuration) {
    presentMinutes = 0;
  } else if (latenessMinutes <= 0) {
    presentMinutes = eventDuration;
  } else {
    presentMinutes = eventDuration - latenessMinutes;
  }

  const attendancePercentage = Number(((presentMinutes / eventDuration) * 100).toFixed(2));
  return { attendancePercentage, latenessMinutes };
}

export function convertMinuteToPresent(minute) {
    const timePoint = minute * 60000
    return parseFloat(timePoint / totalTime('present')).toFixed(1)
}


export function convertNumToTime(num) {
    return num
}



export function precentToTime(present, allTime) {
    const dateLate = (allTime * (100 - present)) / (1000 * 60);
    return formatTextMinuts(dateLate)
}