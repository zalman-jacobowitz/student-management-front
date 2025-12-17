import { useMemo } from 'react';
import Chart from 'react-apexcharts';
import { Box, Card, CardHeader, Container, Stack } from '@mui/material';

export function ExpenseChart({ data = [] }) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        categories: [],
        series: []
      };
    }

    // Group expenses by description and sum amounts
    const groupedExpenses = data.reduce((acc, item) => {
      if (!item.Description || !item.Amount) return acc;

      const amount = Math.abs(parseFloat(item.Amount));
      
      // If amount is negative, it's an expense (payment out)
      if (parseFloat(item.Amount) < 0) {
        const description = item.Description.trim();
        
        if (acc[description]) {
          acc[description] += amount;
        } else {
          acc[description] = amount;
        }
      }
      
      return acc;
    }, {});

    // Convert to sorted array
    const sortedExpenses = Object.entries(groupedExpenses)
      .map(([description, amount]) => ({
        description,
        amount: parseFloat(amount.toFixed(2))
      }))
      .sort((a, b) => b.amount - a.amount);

    return {
      categories: sortedExpenses.map(e => e.description),
      amounts: sortedExpenses.map(e => e.amount)
    };
  }, [data]);

  const chartOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: true
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        dataLabels: {
          position: 'top'
        }
      }
    },
    dataLabels: {
      enabled: true,
      offsetX: -6,
      style: {
        fontSize: '12px',
        colors: ['#304758']
      }
    },
    stroke: {
      show: true,
      width: 1,
      colors: ['#fff']
    },
    tooltip: {
      shared: true,
      intersect: false
    },
    xaxis: {
      categories: chartData.categories,
      labels: {
        style: {
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      title: {
        text: 'סכום הוצאות ($)'
      }
    },
    colors: ['#1f77b4']
  };

  const chartSeries = [
    {
      name: 'סכום הוצאות',
      data: chartData.amounts
    }
  ];

  if (chartData.categories.length === 0) {
    return (
      <Card>
        <CardHeader title="תרשים הוצאות לפי קטגוריה" />
        <Box sx={{ p: 2 }}>
          אין נתונים להצגה
        </Box>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title="תרשים הוצאות לפי קטגוריה"
        subheader={`סה"כ קטגוריות: ${chartData.categories.length}`}
      />
      <Box sx={{ p: 2 }}>
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="bar"
          height={Math.max(400, chartData.categories.length * 20)}
        />
      </Box>
    </Card>
  );
}
