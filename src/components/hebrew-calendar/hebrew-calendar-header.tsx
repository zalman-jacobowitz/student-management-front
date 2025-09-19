// תצוגה של הכותרת עם החודש שנבחר עם כפתורים לשינוי

import { Box, Button, CardActions, Typography } from "@mui/material";

type HeaderType = {
    selectedYear: string,
    monthName: string,
    onMonthChange: (number: number) => void
}

export function CalendarHeader({
    selectedYear,
    monthName,
    onMonthChange
} : HeaderType) {
    return (
        <CardActions
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{ padding: 2 }}
        >
            <Button variant="outlined" onClick={() => onMonthChange(-1)}>
                {'<'} הקודם
            </Button>
            <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
               חודש {monthName} {selectedYear}
            </Typography>
            <Button variant="outlined" onClick={() => onMonthChange(1)}>
                הבא {'>'}
            </Button>
        </CardActions>
    );
}