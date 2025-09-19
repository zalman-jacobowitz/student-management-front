import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";

import { getAllYear } from "src/utils/hebrew/getter";

import { getMonthDates } from "./hebrew-date-picker";

function CalendarHeader({ monthName, onMonthChange }) {
    return (
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{ padding: 2 }}
        >
            <Button variant="outlined" onClick={() => onMonthChange(-1)}>
                {'<'} הקודם
            </Button>
            <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
               חודש {monthName} 
            </Typography>
            <Button variant="outlined" onClick={() => onMonthChange(1)}>
                הבא {'>'}
            </Button>
        </Box>
    );
}

function CalendarViewGrid({ monthDates, selectedDate, setSelectedDate, eventsData = [], defaultDayEvents = () => null }) {
    const daysOfWeek = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
    
    // Create a map for quick lookup of events by date
    const eventsMap = eventsData.reduce((acc, event) => {
        acc[event.day] = event.component;
        return acc;
    }, {});

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
            {daysOfWeek.map((day, index) => (
                <Typography
                    key={index}
                    variant="body2"
                    sx={{
                        fontWeight: 'bold',
                        textAlign: 'center',
                        padding: 1,
                        backgroundColor: '#f0f0f0',
                        borderRadius: 1
                    }}
                >
                    {day}
                </Typography>
            ))}
            {monthDates.map((date, index) => (
                <Box
                    key={index}
                    sx={{
                        minHeight: 60,
                        border: '1px solid #e0e0e0',
                        borderRadius: 1,
                        padding: 1,
                        backgroundColor: date['יום'] === selectedDate['יום'] ? '#e3f2fd' : 'white',
                        cursor: date['יום'] ? 'pointer' : 'default',
                        opacity: date['יום'] ? 1 : 0.3,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                    onClick={() => {
                        if (date['יום'] && setSelectedDate) {
                            setSelectedDate(date);
                        }
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: date['יום'] === selectedDate['יום'] ? 'bold' : 'normal',
                            marginBottom: 0.5
                        }}
                    >
                        {date['יום_עברי']}
                    </Typography>
                    {date['יום'] && (
                        <Box sx={{ flexGrow: 1, width: '100%' }}>
                            {eventsMap[date['יום']] || defaultDayEvents(date['יום'])}
                        </Box>
                    )}
                </Box>
            ))}
        </Box>
    );
}
// הסבר לכל לוח השנה.

export function HebrewCalendarView({
        // היום הנבחר כעת
        selectedDate,
        // פונקציית קאללבאק בעת בחירה של יום בלוח השנה
        setSelectedDate,
        // קומפוננטות לתצוגה לכל יום
        eventsData = [],
        // קומפוננטה להצגה בימים ללא קומפוננטה מפורשת
        defaultDayEvents = () => null

    }) {
    // בחירה של יום
    const [selectedMonth, setSelectedMonth] = useState(selectedDate?.['חודש_עברי'] || 'תשרי');

    // רשימת התאריכים והפרטים עליהם בשנה מסויימת
    const allDates = getAllYear('תשפ״ה');
    // רשימת החודשים העבריים בשנה זו
    const hebrewMonths = [...new Set(allDates.map(date => date['חודש_עברי']))];
    // קבלת רשימת הימים לחודש זה הנבחר
    const monthDates = getMonthDates(selectedMonth, allDates);
    
    // שינוי החודש על ידי שימוש באינדקס קימה ואחורה
    const handleMonthChange = (direction) => {
        const currentIndex = hebrewMonths.indexOf(selectedMonth);
        const newIndex = currentIndex + direction;
        if (newIndex >= 0 && newIndex < hebrewMonths.length) {
            setSelectedMonth(hebrewMonths[newIndex]);
        }
    };

    return (
        <Box>
            <CalendarHeader monthName={selectedMonth} onMonthChange={handleMonthChange} />
            <CalendarViewGrid
                monthDates={monthDates}
                selectedDate={selectedDate || {}} 
                setSelectedDate={setSelectedDate}
                eventsData={eventsData}
                defaultDayEvents={defaultDayEvents}
            />
        </Box>
    );
}