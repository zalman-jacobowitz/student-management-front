import Grid from '@mui/material/Unstable_Grid2';

import { ProfileAbout } from "./profile-about";
import useInsertStore from "../insert/insert-state.ts";
import { RegularChart } from "../charts/regular-chart";
import { inHebrew } from 'src/utils/hebrew/getter.js';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';



function groupBy(data, groupByColumns, aggregateColumn = null, aggregateFunction = 'mean') {
  if (!data || data.length === 0) return [];

  // המרת groupByColumns למערך אם הוא מחרוזת יחידה
  const columns = Array.isArray(groupByColumns) ? groupByColumns : [groupByColumns];
  
  const groups = {};
  
  // קיבוץ הנתונים על פי כמה עמודות
  data.forEach(item => {
    const key = columns.map(col => item[col]).join('|'); // שילוב העמודות למפתח אחד
    if (!groups[key]) {
      groups[key] = {
        items: [],
        groupValues: {}
      };
      // שמירת ערכי הקיבוץ
      columns.forEach(col => {
        groups[key].groupValues[col] = item[col];
      });
    }
    groups[key].items.push(item);
  });

  // אם לא צוין עמודה לאגרגציה, מחזיר מערך עם פרטי הקבוצות
  if (!aggregateColumn) {
    return Object.keys(groups).map(key => ({
      ...groups[key].groupValues,
      count: groups[key].items.length,
      items: groups[key].items
    }));
  }

  // אגרגציה של הנתונים
  const result = [];
  Object.keys(groups).forEach(key => {
    const group = groups[key];
    const values = group.items.map(item => item[aggregateColumn])
                              .filter(val => val !== null && val !== undefined && !isNaN(val));
    
    let aggregateValue = 0;
    
    if (values.length > 0) {
      switch (aggregateFunction) {
        case 'mean':
        case 'average':
          aggregateValue = values.reduce((sum, val) => sum + val, 0) / values.length;
          break;
        case 'sum':
          aggregateValue = values.reduce((sum, val) => sum + val, 0);
          break;
        case 'count':
          aggregateValue = values.length;
          break;
        case 'min':
          aggregateValue = Math.min(...values);
          break;
        case 'max':
          aggregateValue = Math.max(...values);
          break;
        default:
          aggregateValue = values.reduce((sum, val) => sum + val, 0) / values.length;
      }
    }

    // יצירת אובייקט התוצאה
    const resultItem = {
      ...group.groupValues,
      [aggregateColumn + '_' + aggregateFunction]: aggregateValue,
      count: group.items.length
    };
    
    result.push(resultItem);
  });

  return result;
}

function ProfileCard({ data }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5">{data.name}</Typography>
        <Typography variant="body2">{data.email}</Typography>
      </CardContent>
    </Card>
  );
}

function ProfileCards({ data }) {
  const cardsData = groupBy(data.map(e => ({ ...e, data: Number(e.data) * 100 })), 'data', 'data');
  const isHere = cardsData.find(e => e.data === 100)?.count || 0;
  const isNotHere = cardsData.find(e => e.data === 0)?.count || 0;
  const all = isHere + isNotHere;
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
      <Card>
        <CardHeader title='מספר פעמים נוכח'/>
        <CardContent>
          <Typography variant="h5">{isHere}</Typography>
        </CardContent>
      </Card>
      </Grid>
      <Grid item xs={12} md={12}>
      <Card>
        <CardHeader title='מספר חיסורים'/>
        <CardContent>
          <Typography variant="h5">{isNotHere}</Typography>
        </CardContent>
      </Card>
    </Grid>
    <Grid item xs={12} md={12}>
      <Card>
        <CardHeader title='מספר סדרים'/>
        <CardContent>
          <Typography variant="h5">{all}</Typography>
        </CardContent>
      </Card>
    </Grid>
    </Grid>
  );
}

export function ProfileDataMain({ studentInfo, dataStudents }) {

  const withHebrew = dataStudents.sort((a, b) => a.day.localeCompare(b.day)).map(e => ({
    ...e,
    hebrew: inHebrew(e.day, true)
  }));

  const config = {
    title: 'נתונים לפי סדרים',
    subheader: 'חלוקה לפי ימים ואירועים',
    type: 'bar',
    data: groupBy(dataStudents.map(e=>({...e, data: Number(e.data)*100})), 'event_name', 'data'),
    x: 'event_name',
    y: '',
    xs: 12,
    md: 12
  }
  const line = {
    title: 'נתונים לפי ימים',
      subheader: 'חלוקה לפי ימים',
      type: 'area',
      data: groupBy(withHebrew.map(e=>({...e, data: Number(e.data)*100})), 'hebrew', 'data'),
      x: 'hebrew',
      y: '',
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
      <Grid xs={12} md={4}>
        <ProfileCards data={dataStudents} />
      </Grid>
    </Grid>
  );
}