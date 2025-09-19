import { useCallback, useMemo, useState } from "react";
import { getAllYear } from "src/utils/hebrew/getter";
import { getMonthDates } from "./hebrew-date-picker";

type CalendarHook = {
    selectedDate: string,
    selectedYear: string
}

export function useCalendarView({
    selectedDate,
    selectedYear
}: CalendarHook ){
        // רשימת התאריכים והפרטים עליהם בשנה מסויימת
    const allDates = useMemo(()=> getAllYear(selectedYear), [selectedYear])

    // format: "2024-12-29"
    const today =  new Date().toISOString().slice(0, 10)
    const todayHebrew = allDates.find(day=> day.יום === today)

    // בחירה של יום - ברירת מחדל היום.
    const [selectedMonth, setSelectedMonth] = useState(todayHebrew?.['חודש_עברי'] || 'תשרי');


    // רשימת החודשים העבריים בשנה זו
    const hebrewMonths = useMemo(() => [...new Set(allDates.map(date => date['חודש_עברי']))], [allDates]);

    // קבלת רשימת הימים לחודש זה הנבחר
    const monthDates = useMemo(() => getMonthDates(selectedMonth, allDates), [selectedMonth, allDates]);
    
    // שינוי החודש על ידי שימוש באינדקס קימה ואחורה
    const handleMonthChange = useCallback((direction: number) => {
        const currentIndex = hebrewMonths.indexOf(selectedMonth);
        const newIndex = currentIndex + direction;
        if (newIndex >= 0 && newIndex < hebrewMonths.length) {
            setSelectedMonth(hebrewMonths[newIndex]);
        }
    }, [hebrewMonths, selectedMonth])
    
    return {
        handleMonthChange,
        selectedMonth,
        monthDates,
        todayHebrew
    }
}
