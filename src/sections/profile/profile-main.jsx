import Grid from '@mui/material/Unstable_Grid2';

import { ProfileAbout } from "./profile-about";
import useInsertStore from "../insert/insert-state.ts";
import { RegularChart } from "../charts/regular-chart";


export function ProfileDataMain({ studentInfo, dataStudents }) {

  const config = {
    title: 'נתונים לפי ימים',
    subheader: 'חלוקה לפי ימים ואירועים',
    type: 'multiple',
    groupBy: [
      {'table': 'data_students', 'column': 'day' },
      { 'table': 'data_students', 'column': 'event' }
    ],
    filters: [
      { table: 'data_students', column: 'student_id', value: studentInfo.student_id}
    ],
    xs: 12,
    md: 12
  }
  const line =  {
    type: 'pie',
    title: 'נתונים לפי מין',
    subheader: 'חלוקה לפי מין',
    groupBy: [
      { 'table': 'info_students', 'column': 'מין' },
    ],
    filters: [
      { table: 'info_students', column: 'user_id', value: 'zalmanjacob@gmail.com' }
    ],
    xs: 12,
    md: 12
  }
  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={4}>
        <ProfileAbout studentInfo={studentInfo} />
      </Grid>
      
      <Grid xs={12} md={8}>
        <RegularChart config={config} />
      </Grid>
      <Grid xs={12} md={8}>
        <RegularChart config={line} />
      </Grid>
      
    </Grid>
  );
}