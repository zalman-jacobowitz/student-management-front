import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';

import { fNumber, fShortenNumber } from 'src/utils/format-number';

import { Chart, useChart, ChartSelect, ChartLegends } from 'src/components/chart';

// ----------------------------------------------------------------------

export function AppAreaInstalled({ title, subheader, chart, data, ...other }) {
  
  const theme = useTheme();

  const {
    chartData: providedChartData,
    currentSeries: providedCurrentSeries,
    handleChangeSeries = () => {},
    legendLabels: providedLegendLabels,
    selectedSeries: providedSelectedSeries,
    uniqueColumns: providedUniqueColumns,
  } = data ?? {};

  const chartData = providedChartData ?? chart ?? { categories: [], series: [] };

  const selectedSeries = providedSelectedSeries ?? chartData.series?.[0]?.name ?? '';

  const currentSeries = providedCurrentSeries ?? chartData.series?.find((item) => item.name === selectedSeries);

  const uniqueColumns = providedUniqueColumns?.length
    ? providedUniqueColumns
    : selectedSeries
      ? [selectedSeries]
      : [];

  const legendLabels = providedLegendLabels ?? chartData.series?.[0]?.data?.map((item) => item.name) ?? [];

  const chartColors = chartData.colors ?? [
    theme.palette.primary.dark,
    theme.palette.warning.main,
    theme.palette.info.main,
    theme.palette.error.main,
    theme.palette.success.main,
    theme.palette.primary.light,
    theme.palette.primary.lighter
  ];

  const chartOptions = useChart({
    chart: { stacked: true },
    colors: chartColors,
    stroke: { width: 0 },
    xaxis: { categories: chartData.categories },
    tooltip: { y: { formatter: (value) => fNumber(value) } },
    plotOptions: { bar: { columnWidth: '40%' } },
    ...(chartData.options ?? {}),
  });
  
  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          <ChartSelect
            options={uniqueColumns}
            value={selectedSeries}
            onChange={handleChangeSeries}
            disabled={!data}
          />
        }
        sx={{ mb: 3 }}
      />

      <ChartLegends
        colors={chartOptions?.colors}
        labels={legendLabels}
        values={[fShortenNumber(1234), fShortenNumber(6789), fShortenNumber(1012)]}
        sx={{
          px: 3,
          gap: 3,
        }}
      />

      <Chart
        key={selectedSeries}
        type="bar"
        series={currentSeries?.data}
        options={chartOptions}
        height={320}
        sx={{ py: 2.5, pl: 1, pr: 2.5 }}
      />
    </Card>
  );
}
