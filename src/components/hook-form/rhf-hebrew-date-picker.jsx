import { useState, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { Box, Popover, TextField, IconButton, InputAdornment } from "@mui/material";

import { inHebrew } from "src/utils/hebrew/getter";

import { Iconify } from "../iconify";
import { usePopover } from "../custom-popover";
import { HebrewDateCal } from "../hebrew-calendar/hebrew-date-picker";

export function RHFHebrewDateTimePicker({
    name = 'hebrewDateTimePicker',
    label = 'תאריך ושעה עברי',
    error = false,
    helperText = '',
    disabled = false,
    required = false,
    inputProps = {},
}) {
    // day format: 01-01-2024
    const defaultDate = inHebrew(new Date().toISOString().split('T')[0]);
    const defaultTime = new Date().toISOString().split('T')[1].slice(0, 5); // HH:MM

    const [selectedDate, setSelectedDate] = useState(defaultDate);
    const [selectedTime, setSelectedTime] = useState(defaultTime);

    const { control, watch, setValue } = useFormContext();

    const values = watch();

    useEffect(() => {
        if (values.day) {
            setSelectedDate(inHebrew(watch('day')));
        }
    }, [values.day, watch]);

    useEffect(() => {
        if (values.time) {
            setSelectedTime(values.time);
        }
    }, [values.time, watch]);

    const popover = usePopover();

    const handleTimeChange = (e) => {
        const time = e.target.value;
        setSelectedTime(time);
        setValue('time', time);
    };

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <Box>
                    <TextField
                        {...field}
                        label={label}
                        data-testid="hebrew-date-time-picker"
                        value={`${selectedDate['יום_בשבוע']} ${selectedDate['יום_עברי']} ${selectedDate['חודש_עברי']} ${selectedDate['שנה_עברית']} - ${selectedTime}`}
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
                            <HebrewDateCal 
                                selectedDate={selectedDate} 
                                setSelectedDate={setSelectedDate} 
                                onClose={popover.onClose} 
                                name={name} 
                            />
                            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <TextField
                                    type="time"
                                    value={selectedTime}
                                    onChange={handleTimeChange}
                                    inputProps={{ step: 60 }}
                                    size="small"
                                    data-testid="hebrew-date-time-picker-time"
                                />
                            </Box>
                        </Box>
                    </Popover>
                </Box>
            )}
        />
    );
}


export function RHFHebrewDatePicker({
    name='hebrewDatePicker',
    label = 'תאריך עברי',
    error = false,
    helperText = '',
    disabled = false,
    required = false,
    inputProps = {},
}) {
    // day format: 01-01-2024
    const defaultDate = inHebrew(new Date().toISOString().split('T')[0])

    const [selectedDate, setSelectedDate] = useState(defaultDate);

    const { control, watch } = useFormContext();

    const values = watch();

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
        </Box>
            )}
        />
    );
}