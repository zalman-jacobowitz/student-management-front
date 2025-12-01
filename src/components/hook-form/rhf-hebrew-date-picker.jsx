import { useState, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { Box, Popover, TextField, IconButton, InputAdornment } from "@mui/material";

import { inHebrew } from "src/utils/hebrew/getter";

import { Iconify } from "../iconify";
import { usePopover } from "../custom-popover";
import { HebrewDateCal } from "../hebrew-calendar/hebrew-date-picker";
import { RHFTextField } from "./rhf-text-field";

function defaultDateToday(defaultDate){
   const date = defaultDate? new Date(defaultDate) : new Date()
   return inHebrew(date.toISOString().split('T')[0])
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
    
    const values = watch();

    const defaultDate = defaultDateToday(values[name])
    const [selectedDate, setSelectedDate] = useState(defaultDate);

    useEffect(()=>{
      if (values.day){
       setSelectedDate(inHebrew(watch('day')))
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
                label={label}
                data-testid="hebrew-date-picker"
                value={`${selectedDate['יום_בשבוע']} ${selectedDate['יום_עברי']} ${selectedDate['חודש_עברי']} ${selectedDate['שנה_עברית']}`}
                fullWidth
                variant="outlined"
                onClick={popover.onOpen}
                error={error}
                helperText={helperText}
                disabled={disabled}
                required={required}
                sx={{ direction: 'rtl' }}
                inputProps={{
                dir: 'rtl',
                }}
                InputProps={{
                readOnly: true,
                endAdornment: (
                    <InputAdornment position="end">
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