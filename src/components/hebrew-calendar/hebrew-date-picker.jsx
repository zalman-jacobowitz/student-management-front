import { useState } from "react";
import { useFormContext } from "react-hook-form";

import { Box, Button, Typography } from "@mui/material";

import { getAllYear } from "src/utils/hebrew/getter";
import { useTranslate } from "src/locales/use-locales";


/*
    {
        "יום":"2024-10-04",
        "יום_בשבוע":"שישי",
        "יום_עברי":"ב׳",
        "חודש_עברי":"תשרי",
        "שנה_עברית":"תשפ״ו",
        "פרשת_השבוע":"האזינו"
    },
*/


function paddingStart(monthDates){
    const firstDate = monthDates[0];

    const firstDayOfWeek = firstDate['יום_בשבוע'];
    const daysOfWeek = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
    const paddingDays = [];
    const startIndex = daysOfWeek.indexOf(firstDayOfWeek);
    [...Array(startIndex).keys()].forEach(i => {
        paddingDays.push({
            יום: '',
            יום_בשבוע: daysOfWeek[i],
            יום_עברי: '',
            חודש_עברי: '',
            שנה_עברית: '',
            פרשת_השבוע: ''
        });
    }
    );
    return paddingDays;

}

export function getMonthDates(monthName, allDates) {
    // Filter dates for the specified month
    const monthDates = allDates.filter(date => date['חודש_עברי'] === monthName);
    // Add padding at the start of the month
    const paddedDates = paddingStart(monthDates);
    return paddedDates.concat(monthDates);

}

function CalendarHeader({ monthName, onMonthChange, t }) {
    return (
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{ padding: 2 }}
        >
            <Button variant="outlined" onClick={() => onMonthChange(-1)}>
                {'<'} {t('calendar.previous')}
            </Button>
            <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
               {t('calendar.month')} {monthName} 
            </Typography>
            <Button variant="outlined" onClick={() => onMonthChange(1)}>
                {t('calendar.next')} {'>'}
            </Button>
        </Box>

    );
}

function CalendarGrid({ monthDates, selectedDate, setSelectedDate, onClose, name, t }) {
    const { setValue, watch } = useFormContext();

    const daysOfWeek = [
        t('calendar.sunday'),
        t('calendar.monday'),
        t('calendar.tuesday'),
        t('calendar.wednesday'),
        t('calendar.thursday'),
        t('calendar.friday'),
        t('calendar.saturday')
    ];
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
            <Button
                sx={{ width: '100%' }}
                key={index}
                data-testid={`hebrew-date-picker-day-${index}`}
                disabled={!date['יום']}
                variant={date['יום'] === selectedDate['יום'] ? 'outlined' : 'text'}
                color='primary'
                onClick={() => {
                    setSelectedDate(date);
                    onClose();
                    setValue(name, date['יום']);
                }}
                sx={{
                    padding: 1,
                    textAlign: 'center'
                }}
            >{date['יום_עברי']}
            </Button>
        ))}
        </Box>
    );
}

export function HebrewDateCal({selectedDate, setSelectedDate, onClose, name}){
    const { t } = useTranslate();
    const [selectedMonth, setSelectedMonth] = useState(selectedDate['חודש_עברי'] || 'תשרי');

    const allDates = getAllYear('תשפ״ו');
    const hebrewMonths = [...new Set(allDates.map(date => date['חודש_עברי']))]
    const monthDates = getMonthDates(selectedMonth, allDates);
    
    const getMonthDisplayName = (monthName) => {
        const hebrewToEnglish = {
            'תשרי': 'Tishrei',
            'חשוון': 'Cheshvan',
            'כסלו': 'Kislev',
            'טבת': 'Tevet',
            'שבט': 'Shevat',
            'אדר': 'Adar',
            'ניסן': 'Nisan',
            'אייר': 'Iyar',
            'סיוון': 'Sivan',
            'תמוז': 'Tammuz',
            'אב': 'Av',
            'אלול': 'Elul'
        };
        const englishName = hebrewToEnglish[monthName];
        return t(`hebrewMonths.${englishName}`);
    };
    
    const handleMonthChange = (direction) => {
        const currentIndex = hebrewMonths.indexOf(selectedMonth);
        const newIndex = currentIndex + direction;
        if (newIndex >= 0 && newIndex < hebrewMonths.length) {
            setSelectedMonth(hebrewMonths[newIndex]);
        }
    };
    return (
        <>
            <CalendarHeader monthName={getMonthDisplayName(selectedMonth)} onMonthChange={handleMonthChange} t={t} />
            <CalendarGrid name={name} monthDates={monthDates} selectedDate={selectedDate} setSelectedDate={setSelectedDate} onClose={onClose} t={t} />
        </>
    );
}
