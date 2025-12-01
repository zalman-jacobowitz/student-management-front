import { Box } from '@mui/material';
import { useSuspenseQuery } from '@tanstack/react-query';
import { apiBank } from 'src/actions/data_students_event';
import { Chart } from 'src/components/chart';
import { RegularChart } from 'src/sections/charts/regular-chart';
import { ChartBar } from './chart-bar';
import { ChartColumnSingle } from './chart-column-single';

const convertKeys = {
    Mobile: 'מהטלפון',
    Shoping: 'קניות ועוד',
    Food: 'אוכל',
    Zelle: 'העברות',
    transportaion: 'נסיעות'
}

export function TemplatesViewer({ watchedFile }) {
    const bankData = useSuspenseQuery(apiBank({data: watchedFile}))
  
    const chartConfig = {
        type: 'bar', // או 'bar', 'donut', וכו'
        title: 'דוח תבניות',
        subheader: 'סיכום נתונים',
        data: bankData.data.group, // הנתונים שלך
        x: 'cate', // שם העמודה עבור ציר X
        y: 'Amount', // שם העמודה עבור ציר Y
    };
    console.table(bankData.data.group)

  return (
    <Box>
<ChartColumnSingle
 chart={{
          categories: bankData.data.group.map(e => convertKeys[e.cate] || e.cate),
          series: [{ data: bankData.data.group.map(e => Math.abs(parseFloat(e.Amount))) }],
        }}
      />
    </Box>
  );
}
