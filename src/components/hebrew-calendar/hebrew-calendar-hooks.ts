import { useCallback, useMemo, useState } from "react";

import { getAllYear } from "src/utils/hebrew/getter";
import hebrewData from "src/utils/hebrew/hebrew.json";

import { getMonthDates } from "./hebrew-date-picker";

type CalendarHook = {
    selectedDate: string,
    selectedYear: string
}

export function useCalendarView({
    selectedDate,
    selectedYear
}: CalendarHook ){

    
    const hebrewYears = useMemo(() => {
        const years = hebrewData.map(date => date.שנה_עברית);
        return [...new Set(years)];
    }, []);
    
    const [currentYear, setCurrentYear] = useState(selectedYear);
    // רשימת התאריכים והפרטים עליהם בשנה מסויימת
    const allDates = useMemo(() => getAllYear(currentYear), [currentYear])

    // format: "2024-12-29"
    const today =  new Date().toISOString().slice(0, 10)
    const todayHebrew = allDates.find(day=> day.יום === today)

    // בחירה של יום - ברירת מחדל היום.
    const [selectedMonth, setSelectedMonth] = useState(todayHebrew?.['חודש_עברי'] || 'תשרי');


    // רשימת החודשים העבריים בשנה זו
    const hebrewMonths = useMemo(() => [...new Set(allDates.map(date => date['חודש_עברי']))], [allDates, currentYear]);

    // קבלת רשימת הימים לחודש זה הנבחר
    const monthDates = useMemo(() => getMonthDates(selectedMonth, allDates), [selectedMonth, allDates]);
    
    // שינוי החודש על ידי שימוש באינדקס קימה ואחורה
    const handleMonthChange = useCallback((direction: number) => {
        const currentIndex = hebrewMonths.indexOf(selectedMonth);
        const newIndex = currentIndex + direction;
        if (newIndex >= 0 && newIndex < hebrewMonths.length) {
            setSelectedMonth(hebrewMonths[newIndex]);
        }
        // לעבור לשנה הבאה או הקודמת - לפי אינדקס
        else if (newIndex < 0) {
            const currentYearIndex = hebrewYears.indexOf(currentYear);
            
            const newYearIndex = currentYearIndex - 1;
            if (newYearIndex >= 0) {
                setCurrentYear(hebrewYears[newYearIndex]);
                setSelectedMonth(hebrewMonths[hebrewMonths.length - 1]);
            }
        } else if (newIndex >= hebrewMonths.length) {
            const currentYearIndex = hebrewYears.indexOf(currentYear);
            
            const newYearIndex = currentYearIndex + 1;
            if (newYearIndex < hebrewYears.length) {
                setCurrentYear(hebrewYears[newYearIndex]);
                setSelectedMonth(hebrewMonths[0]);
            }
        }
        
    }, [hebrewMonths, selectedMonth, hebrewYears, currentYear])

    return {
        handleMonthChange,
        selectedMonth,
        monthDates,
        todayHebrew,
        currentYear
    }
}
