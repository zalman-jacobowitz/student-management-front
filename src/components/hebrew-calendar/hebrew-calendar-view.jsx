import { useState } from "react";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";

import { getAllYear } from "src/utils/hebrew/getter";

import { getMonthDates } from "./hebrew-date-picker";
import { CalendarHeader } from "./hebrew-calendar-header";
import { useCalendarView } from "./hebrew-calendar-hooks";


function useCalendarMonthView(eventsData) {
    // רשימה וסדר הימים
    const daysOfWeek = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

    // השמה של הקומננטות של הימים ברשימה של מילון
    const eventsMap = eventsData.reduce((acc, event) => {
        acc[event.day] = event.component;
        return acc;
    }, {});

    return {
        eventsMap,
        daysOfWeek
    }
}

function CalendarDayView({
    index,
    date,
    selectedDate,
    setSelectedDate,
    eventsMap,
    defaultDayEvents,
    today
}) {
    // בודק אם יש ליום זה קומפוננטה ואם לא - שם את ברירת המחדל
    const renderDayComponenet = date['יום']? eventsMap[date['יום']] || defaultDayEvents(date['יום']) : null
    console.log('today', today)
    // בודק אם היום הנבחר הוא היום הנוכחי
    const isSelected = date.יום === today?.יום


    if (!date.יום){
        return <Box />
    }

    return  <Button
        key={index}
        variant={isSelected? "text": "soft"}

        sx={{
            padding: .7,
            boxShadow: (theme) => theme.shadows[2],
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}
        onClick={() => setSelectedDate(date)}
    >
        <Typography variant="body2" padding={.7}>{date['יום_עברי']}</Typography>

        {renderDayComponenet}
    </Button>
}

function CalendarViewGrid({today, monthDates, selectedDate, setSelectedDate, eventsData = [], defaultDayEvents = () => null }) {

    const {
        eventsMap,
        daysOfWeek
    } = useCalendarMonthView(eventsData)

    // רינדור הימים בשבוע
    const renderWeekDays = daysOfWeek.map(day => (<Typography variant="body2" sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>{day}</Typography>))

    // התצוגה מחולקת לשבעה חלקים
    return (
        <Box
            gap={1}
            display="grid"
            gridTemplateColumns={{
                xs: 'repeat(7, 1fr)',
                sm: 'repeat(7, 1fr)',
                md: 'repeat(7, 1fr)',
            }}
        >
            {renderWeekDays}
            {monthDates.map((date, index) => (
                <CalendarDayView
                    index={index}
                    date={date}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    eventsMap={eventsMap}
                    defaultDayEvents={defaultDayEvents}
                    today={today}
                />
                
                ))}
        </Box>
    );
}
// הסבר לכל לוח השנה.

export function HebrewCalendarView({
    selectedYear = "תשפ״ו",
    // היום הנבחר כעת
    selectedDate,
    // פונקציית קאללבאק בעת בחירה של יום בלוח השנה
    setSelectedDate,
    // קומפוננטות לתצוגה לכל יום
    eventsData = [],
    // קומפוננטה להצגה בימים ללא קומפוננטה מפורשת
    defaultDayEvents = () => null

}) {

    const {
        handleMonthChange,
        selectedMonth,
        monthDates,
        todayHebrew,
        currentYear
    } = useCalendarView({ selectedDate, selectedYear })


    return (
        <Card>
            
            <CalendarHeader
                selectedYear={currentYear}
                monthName={selectedMonth}
                onMonthChange={handleMonthChange}
            />
            <CardContent>
            <CalendarViewGrid
                monthDates={monthDates}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                eventsData={eventsData}
                defaultDayEvents={defaultDayEvents}
                today={todayHebrew}
            />
            </CardContent>
        </Card>
    );
}