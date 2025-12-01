import { useState, useMemo } from 'react';
import { useTheme, alpha as hexAlpha } from '@mui/material/styles';
import {
  Card,
  CardHeader,
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Stack,
} from '@mui/material';

import { Chart, useChart } from 'src/components/chart';
import { TRANSACTION_CATEGORIES, getCategoryColor } from 'src/actions/transaction-categories';
import { inHebrew } from 'src/utils/hebrew/getter.js';
import { Iconify } from 'src/components/iconify';

/**
 * Convert date to YYYY-MM-DD format for inHebrew function
 * @param {string|Date} dateInput - Date in various formats (ISO string, Date object, etc.)
 * @returns {string} - Date in YYYY-MM-DD format
 */
function formatDateToYYYYMMDD(dateInput) {
  if (!dateInput) return null;
  
  let date;
  
  if (typeof dateInput === 'string') {
    // If already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
      return dateInput;
    }
    // Parse various date formats
    date = new Date(dateInput);
  } else if (dateInput instanceof Date) {
    date = dateInput;
  } else {
    return null;
  }
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return null;
  }
  
  // Format to YYYY-MM-DD
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * Group transactions by week and day within a category
 * @param {Array} transactions - Array of transaction objects
 * @param {string} category - Category name to filter by
 * @returns {Object} - Grouped data by week and day
 */
function groupByWeekAndDay(transactions, category) {
  const filtered = transactions.filter(
    (tx) => tx.category === category && parseFloat(tx.Amount) < 0
  );

  const grouped = {};

  filtered.forEach((tx) => {
    const formattedDate = formatDateToYYYYMMDD(tx.Date);
    if (!formattedDate) return;
    
    const date = new Date(formattedDate);
    const year = date.getFullYear();
    const weekNumber = getWeekNumber(date);
    const dayOfWeek = date.toLocaleDateString('he-IL', { weekday: 'long' });
    const dayOfMonth = date.getDate();
    
    // Get Hebrew date info including Torah portion
    const hebrewInfo = inHebrew(formattedDate);
    const torahPortion = hebrewInfo?.פרשת_השבוע || `שבוע ${weekNumber}`;

    const weekKey = `${year}-W${String(weekNumber).padStart(2, '0')}`;

    if (!grouped[weekKey]) {
      grouped[weekKey] = {
        weekStart: getWeekStart(date),
        weekEnd: getWeekEnd(date),
        days: {},
        totalAmount: 0,
        torahPortion: torahPortion,
      };
    }

    if (!grouped[weekKey].days[formattedDate]) {
      grouped[weekKey].days[formattedDate] = {
        dayOfWeek,
        dayOfMonth,
        amount: 0,
        hebrewDate: inHebrew(formattedDate, 'Dm'),
      };
    }

    const amount = Math.abs(parseFloat(tx.Amount));
    grouped[weekKey].days[formattedDate].amount += amount;
    grouped[weekKey].totalAmount += amount;
  });

  return grouped;
}

/**
 * Get the week number for a given date
 * @param {Date} date - Date object
 * @returns {number} - Week number
 */
function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

/**
 * Get the start date of a week
 * @param {Date} date - Date object
 * @returns {Date} - Start date of the week (Sunday)
 */
function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
}

/**
 * Get the end date of a week
 * @param {Date} date - Date object
 * @returns {Date} - End date of the week (Saturday)
 */
function getWeekEnd(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + 6;
  return new Date(d.setDate(diff));
}

/**
 * Format date range for display
 * @param {Date} start - Start date
 * @param {Date} end - End date
 * @returns {string} - Formatted date range
 */
function formatDateRange(start, end) {
  const startStr = start.toLocaleDateString('he-IL');
  const endStr = end.toLocaleDateString('he-IL');
  return `${startStr} - ${endStr}`;
}

function WeeklyAccordionView({ groupedData, categoryColor }) {
  return (
    <Stack spacing={1} sx={{ mt: 2 }}>
      {Object.entries(groupedData)
        .sort()
        .map(([weekKey, weekData]) => {
          const dayCount = Object.keys(weekData.days).length;
          return (
            <Accordion key={weekKey}>
              <AccordionSummary expandIcon={<Iconify icon='solar:expand-more-bold' />}>
                <Stack direction="row" spacing={2} sx={{ width: '100%', alignItems: 'center' }}>
                  <Typography sx={{ fontWeight: 'bold', color: categoryColor, minWidth: 150 }}>
                    {weekData.torahPortion}
                  </Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0 }}>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: categoryColor }}>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>תאריך</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>יום בשבוע</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'right' }}>סכום</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(weekData.days)
                        .sort()
                        .map(([date, dayData]) => (
                          <TableRow key={date} hover>
                            <TableCell>{dayData.hebrewDate}</TableCell>
                            <TableCell>{dayData.dayOfWeek}</TableCell>
                            <TableCell sx={{ textAlign: 'right', fontWeight: 'bold' }}>
                              ${dayData.amount.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          );
        })}
    </Stack>
  );
}

function WeeklyChartView({ groupedData, categoryColor, categoryName }) {
  const theme = useTheme();
  const weekKeys = Object.keys(groupedData).sort();
  const weeklyAmounts = weekKeys.map((week) => groupedData[week].totalAmount);
  const torahPortions = weekKeys.map((week) => groupedData[week].torahPortion);

  const chartOptions = useChart({
    colors: [categoryColor],
    labels: torahPortions,
    legend: {
      show: true,
    },
    tooltip: {
      y: {
        formatter: (value) => `$${value.toFixed(2)}`,
      },
    },
  });

  return (
    <Card sx={{ mt: 3 }}>
      <CardHeader
        title={`תרשים הוצאות שבועי - ${categoryName}`}
        subheader="סכום הוצאות לשבוע לפי פרשת השבוע"
      />
      <Chart
        type="line"
        series={[{ data: weeklyAmounts }]}
        options={chartOptions}
        height={300}
        sx={{ py: 2.5, pl: 1, pr: 2.5 }}
      />
    </Card>
  );
}

export function CategoryDailyView({ data }) {
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] = useState(
    TRANSACTION_CATEGORIES.PUBLIC_TRANSPORTATION
  );

  // Get all unique categories from data
  const availableCategories = useMemo(() => {
    const categories = new Set(data.map((tx) => tx.category).filter(Boolean));
    return Array.from(categories);
  }, [data]);

  // Group data by week and day
  const groupedByWeek = useMemo(() => {
    return groupByWeekAndDay(data, selectedCategory);
  }, [data, selectedCategory]);

  const categoryColor = getCategoryColor(selectedCategory);
  const categoryLabel = selectedCategory;

  const hasData = Object.keys(groupedByWeek).length > 0;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title="ניתוח הוצאות לפי קטגוריה"
            subheader="בחר קטגוריה להצגת הוצאות יומיות וסיכום שבועי"
          />
          <Box sx={{ p: 2 }}>
            <FormControl fullWidth sx={{ maxWidth: 400 }}>
              <InputLabel>בחר קטגוריה</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="בחר קטגוריה"
              >
                {availableCategories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Card>
      </Grid>

      {hasData ? (
        <>
          {/* Weekly Accordion with Daily Details */}
          <Grid item xs={12}>
            <Card>
              <CardHeader
                title={`סיכום הוצאות - ${categoryLabel}`}
                subheader="לחץ על כל שבוע כדי להציג את הוצאות יומיות"
              />
              <Box sx={{ p: 2 }}>
                <WeeklyAccordionView groupedData={groupedByWeek} categoryColor={categoryColor} />
              </Box>
            </Card>
          </Grid>

          {/* Weekly Chart */}
          <Grid item xs={12}>
            <WeeklyChartView
              groupedData={groupedByWeek}
              categoryColor={categoryColor}
              categoryName={categoryLabel}
            />
          </Grid>
        </>
      ) : (
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="אין נתונים"
              subheader={`אין הוצאות להצגה בקטגוריה ${categoryLabel}`}
            />
          </Card>
        </Grid>
      )}
    </Grid>
  );
}

export default CategoryDailyView;
