import { useMemo } from 'react';
import { Box, Grid } from '@mui/material';
import { ChartBar } from 'src/sections/overview/chart-view/chart-bar';
import { groupTransactionsByCategory, getCategoryColor } from 'src/actions/transaction-categories';
import { ChartColumnSingle } from './chart-column-single';
import Zelle from './zelle';
import CategoryDailyView from './category-daily-view';

export function TemplatesViewer({ watchedFile }) {

    // Group transactions by category
    console.log('watchedFile', watchedFile);
    const {group: categorizedData, enrichedTransactions} = groupTransactionsByCategory(watchedFile, 'Description', 'Amount')
    
    console.log('categorizedData', categorizedData);
    // Filter only negative amounts
    const negativeData = categorizedData.filter(item => parseFloat(item.Amount) < 0);
    
    // Prepare chart configuration
    const chartConfig = {
        categories: negativeData.map(item => item.cate),
        series: [{data: negativeData.map(item => Math.abs(parseFloat(item.Amount)))}],
            tooltip: {
      y: {
        formatter: (value) => `${parseInt(value, 10)}$ `,
        title: { formatter: () => '' },
      },
    },
        // colors: negativeData.map(item => getCategoryColor(item.cate)),
        yaxis: { 
            labels: {
                formatter: (value) => `${value}`,
        },
      // auto: עיגול כלפי המאה הבאה
      },
    };
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
                <ChartColumnSingle chart={chartConfig} />
            </Grid>
            <Zelle data={enrichedTransactions} />
            <Grid item xs={12}>
                <CategoryDailyView data={enrichedTransactions} />
            </Grid>
        </Grid>
    );
}
