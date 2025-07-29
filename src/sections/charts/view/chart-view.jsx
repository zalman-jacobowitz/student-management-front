import Grid from '@mui/material/Unstable_Grid2';

import { DashboardContent } from 'src/layouts/dashboard';

import { RegularChart } from 'src/sections/charts/regular-chart';

const demo_config = [
  {
    type: 'pie',
    groupBy: [
      { 'table': 'info_students', 'column': 'מין' }
    ],
    filters: [{ table: 'info_students', column: 'user_id', value: 'zalmanjacob@gmail.com' }],
    xs: 5,
    md: 5
  },
  {
    type: 'multiple',
    groupBy: [
      { 'table': 'info_students', 'column': 'ארץ_לידה' },
      { 'table': 'data_students', 'column': 'event' },
    ],
    filters: [
      { table: 'info_students', column: 'user_id', value: 'zalmanjacob@gmail.com' }
    ],
    xs: 7,
    md: 7
  },
  {
    type: 'multiple',
    groupBy: [
      { 'table': 'info_students', 'column': 'מין' },
      { 'table': 'data_students', 'column': 'event' },
    ],
    filters: [
      { table: 'info_students', column: 'user_id', value: 'zalmanjacob@gmail.com' }
    ],
    xs: 12,
    md: 12
  }
];

export function ChartView() {
  // here should be a hook to get the data from the supabase.

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        {demo_config.map((config, index) => (
          <Grid key={index} xs={config.xs} md={config.md}>
            <RegularChart config={config} />
          </Grid>
        ))}
      </Grid>
    </DashboardContent>
  );
}