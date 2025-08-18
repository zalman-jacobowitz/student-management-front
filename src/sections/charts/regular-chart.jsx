import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { useTheme, alpha as hexAlpha } from '@mui/material/styles';

import { useGetTable } from 'src/actions/table';

import { Chart, useChart } from 'src/components/chart';




function useRegularChart(config) {
  
  const isMultiple = config.groupBy.length > 1

  const chartData = useGetTable('chart', {config})
  alert(JSON.stringify(chartData.data))
  const x = config.groupBy[0].table === 'info_students' ? 'value': config.groupBy[0].column

  const y = isMultiple?config.groupBy[1].column: config.groupBy[0].column;

  const example = chartData.data?[...new Set(chartData.data.map((key) => key[x]))]:[]

  const ids = chartData.data?[...new Set(chartData.data.map((key) => key[y]))]:[]

  const chart = isMultiple?{
      type: 'bar',
      categories: ids,
      series: example.map((key) => ({
        name: key,
        data: chartData.data?.filter((item) => item[x] === key).map(e=>e.avg_data) || [],
      }
    ))
    }:{
      type: 'donut',
      categories: example,
      series: chartData.data?.map(e=>e.avg_data) || [],
    }
  chart.series = isMultiple || config.type === 'pie'?chart.series:[{ data: chart.series }]
  
  return chart
}



export function RegularChart({ config, ...other }) {

    const theme = useTheme();

    const chart = useRegularChart(config);

    

    const chartColors = chart.colors ?? [
      hexAlpha(theme.palette.primary.dark, 0.8),
      hexAlpha(theme.palette.warning.main, 0.8),
      hexAlpha(theme.palette.info.main, 0.8),
      hexAlpha(theme.palette.error.main, 0.8),
      hexAlpha(theme.palette.success.main, 0.8),
      hexAlpha(theme.palette.primary.light, 0.8),
      hexAlpha(theme.palette.primary.lighter, 0.8)

    ];

    
    const chartOptions = useChart({
      colors: chartColors,
      stroke: {
        width: 2,
        colors: ['transparent'],
      },
      labels: chart.categories,
      xaxis: {
        categories: chart.categories,
      },
      legend: {
        show: true,
      },
      tooltip: {
        y: {
          formatter: (value) => `${value}`,
        },
      },
      ...chart.options,
    });
  
    return (
      <Card {...other}>
        <CardHeader
          title={config.title}
          subheader={config.subheader}
          sx={{ mb: 3 }}
        />
        <Chart
          type={chart.type}
          series={chart.series}
          options={chartOptions}
          height={364}
          sx={{ py: 2.5, pl: 1, pr: 2.5 }}
        />
      </Card>
    );
  }
  
