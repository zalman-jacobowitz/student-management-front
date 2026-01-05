import { useState, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { Box, Popover, TextField, IconButton, InputAdornment } from "@mui/material";

import { inHebrew } from "src/utils/hebrew/getter";
import { useTranslate } from "src/locales/use-locales";

import { Iconify } from "../iconify";
import { usePopover } from "../custom-popover";
import { HebrewDateCal } from "../hebrew-calendar/hebrew-date-picker";
import { RHFTextField } from "./rhf-text-field";
import { useSettingsContext } from "../settings";

function defaultDateToday(defaultDate){
   const date = defaultDate? new Date(defaultDate) : new Date()
   return inHebrew(date.toISOString().split('T')[0])
}
const days = {
    'ראשון': 'sunday',
    'שני': 'monday',
    'שלישי': 'tuesday',
    'רביעי': 'wednesday',
    'חמישי': 'thursday',
    'שישי': 'friday',
    'שבת': 'saturday',
}
const months = {
    'תשרי': 'Tishrei',
    'חשוון': 'Cheshvan',
    'כסלו': 'Kislev',
    'טבת': 'Tevet',
    'שבט': 'Shevat',
    'אדר': 'Adar',
    'ניסן': 'Nisan',
    'אייר':'Iyar',
    'סיון': 'Sivan',
    'תמוז': 'Tamuz',
    'אב': 'Av',
    'אלול': 'Elul',
}
const years = {
    'תשפ״ד': '5784',
    'תשפ״ה': '5785',
    'תשפ״ו': '5786',
    'תשפ״ז': '5787',
    'תשפ״ח': '5788',
}

const daysHebrew = {
  'א׳': 1,
  'ב׳': 2,
  'ג׳': 3,
  'ד׳': 4,
  'ה׳': 5,
  'ו׳': 6,
  'ז׳': 7,
  'ח׳': 8,
  'ט׳': 9,
  'י׳': 10,
  'י״א': 11,
  'י״ב': 12,
  'י״ג': 13,
  'י״ד': 14,
  'ט״ו': 15,
  'ט״ז': 16,
  'י״ז': 17,
  'י״ח': 18,
  'י״ט': 19,
  'כ׳': 20,
  'כ״א': 21,
  'כ״ב': 22,
  'כ״ג': 23,
  'כ״ד': 24,
  'כ״ה': 25,
  'כ״ו': 26,
  'כ״ז': 27,
  'כ״ח': 28,
  'כ״ט': 29,
  'ל׳': 30,
}

export function RHFHebrewDatePicker({
    name='hebrewDatePicker',
    defaultValue='',
    time='',
    label = 'תאריך עברי',
    error = false,
    helperText = '',
    disabled = false,
    required = false,
    inputProps = {},
    ...other
}) {
    // day format: 01-01-2024

    const { control, watch } = useFormContext();
    const { t } = useTranslate();
    
    const values = watch();

    const defaultDate = defaultDateToday(values[name])
    const [selectedDate, setSelectedDate] = useState(defaultDate);

    const getDisplayValue = () => {

        return `${t(`calendar.${days[selectedDate['יום_בשבוע']]}`)} ${daysHebrew[selectedDate['יום_עברי']]} ${months[selectedDate['חודש_עברי']]} ${years[selectedDate['שנה_עברית']]}`;
    };
    const settings = useSettingsContext()
    useEffect(()=>{
      if (values.day){
       setSelectedDate(inHebrew(watch('day'), false, false, t))
      }
    }, [values.day, watch])

    const popover = usePopover();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
            <Box>
            <TextField
                {...field}
                {...other}
                label={t('calendar.month')}
                data-testid="hebrew-date-picker"
                value={getDisplayValue()}
                fullWidth
                variant="outlined"
                onClick={popover.onOpen}
                error={error}
                helperText={helperText}
                disabled={disabled}
                required={required}
                
                InputProps={{
                readOnly: true,
                endAdornment: (
                    <InputAdornment position="start">
                    <IconButton onClick={popover.onOpen} edge="end" disabled={disabled}>
                        <Iconify icon="eva:calendar-outline" />
                    </IconButton>
                    </InputAdornment>
                ),
                ...inputProps,
                }}
            />
            
    
          <Popover
            id={name}
            open={popover.open}
            anchorEl={popover.anchorEl}
            onClose={popover.onClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            slotProps={{
              paper: {
                sx: { mt: 1 },
              },
            }}
          >
            <Box sx={{ p: 2, minWidth: 300 }}>
                <HebrewDateCal selectedDate={selectedDate} setSelectedDate={setSelectedDate} onClose={popover.onClose} name={name} />
            </Box>
          </Popover>
            { 
                time && <RHFTextField type='time'/>
            }
        </Box>
            )}
        />
    );
}