import * as React from 'react';
import { Suspense } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';

import { Box, Button, Card, Container, IconButton, LinearProgress, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridToolbar, GridToolbarExport } from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';

import { inHebrew } from 'src/utils/hebrew/getter';

import { apiSummary } from 'src/actions/summary';
import { apiTemplates } from 'src/actions/templates';
import { DashboardContent } from 'src/layouts/dashboard';
import { apiInfoColumns } from 'src/actions/info_columns';
import { apiInfoStudents } from 'src/actions/info_students';

import { LoadingScreen } from 'src/components/loading-screen';
import { PageLinksHeader } from 'src/components/layout/header-links';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Iconify } from 'src/components/iconify';

// Links for navigation
const LINKS = [
  { name: 'מסך-ראשי', href: paths.dashboard.root },
  { name: 'תבניות', href: paths.dashboard.templates },
  { name: 'סיכום' },
];

// Format summary data for DataGrid
function formatSummaryData(data, formData) {
  if (formData.type === 'details') {
    const newTable = data.map(e => {
      const heb = inHebrew(e.day);
      return {
        ...e,
        day_event: `${heb.יום_עברי} ${heb.חודש_עברי} | ${e.event_name}`
      };
    });

    // Create pivot table
    const columns = new Set(newTable.map(e => e.day_event));
    const index = [...new Set(data.map(e => e.student_id))];
    const pivoted = [];

    index.forEach(studentId => {
      const row = { id: studentId, student_id: studentId };
      
      columns.forEach(dayEvent => {
        const record = newTable.find(e => 
          e.day_event === dayEvent &&
          e.student_id === studentId
        );
        row[dayEvent] = record ? record.data : 0;
      });
      
      pivoted.push(row);
    });
    
    return pivoted;
  }
  return data.map((item, index) => ({ ...item, id: index }));
}

// Merge summary data with student info
function mergeSummaryData(infoStudents, summaryData, infoColumns, formData) {
  const primary = infoColumns.filter(e => e.group_name === 'primary').map(e => e.name);
  const secondary = infoColumns.filter(e => e.group_name === 'secondary').map(e => e.name);
  
  const getDesc = (student, desc) => desc.map(e => student ? student[e] : '').join(' ');
  
  const formattedData = formatSummaryData(summaryData, formData);
  
  const mergedData = formattedData.map(summary => {
    const student = infoStudents.find(item => item.student_id === summary.student_id);
    return {
      id: summary.id || summary.student_id,
      primary: getDesc(student, primary),
      secondary: getDesc(student, secondary),
      ...summary
    };
  });
  
  return mergedData;
}
export function RenderCell({ value }) {
  console.log({ value });
  const numValue = parseInt(Number(value));
  
  return (
    <Stack justifyContent="center" padding={2} sx={{ typography: 'caption', color: 'text.secondary' }}>
      <LinearProgress
        value={numValue}
        variant="determinate"
        color={
          (numValue < 50 && 'error') ||
          (numValue < 80 && 'warning') ||
          'success'
        }
        sx={{ mb: 1, width: 1, height: 6, maxWidth: 80 }}
      />
      {numValue}%
    </Stack>
  );
}

// Generate columns dynamically with grouping support
function generateColumns(data, formData): GridColDef[] {
  if (!data || data.length === 0) return [];
  
  const firstRow = data[0];
  const columns: GridColDef[] = [];
  
  // Add primary column
  columns.push({
    field: 'primary',
    headerName: 'תלמיד',
    width: 200,
    headerAlign: 'right' as const,
    align: 'right' as const,
  });
  
  // Add secondary column if exists
  if (firstRow.secondary) {
    columns.push({
      field: 'secondary',
      headerName: 'פרטים נוספים',
      width: 150,
      headerAlign: 'right' as const,
      align: 'right' as const,
    });
  }
  
  // Add data columns (skip id, student_id, primary, secondary)
  const skipFields = ['id', 'student_id', 'primary', 'secondary'];
  Object.keys(firstRow).forEach(key => {
    if (!skipFields.includes(key)) {
      console.log('Adding column:', key);
      const headerName = formData.group_by === 'day'? inHebrew(key, 'Dm') : key.split('|')[1];
      columns.push({
        field: key,
        headerName,
        width: 120,
        headerAlign: 'center' as const,
        align: 'center' as const,
        renderCell: (params) => {
          if (formData.type === 'details') {
            return params.value > 0 ? '✓' : '✗';
          }

          return <RenderCell value={params.value} />;
        },
      });
    }
  });
  
  return columns;
}

// Generate column grouping model for grouped display
function generateColumnGrouping(data, formData) {
  if (!data || data.length === 0) return [];
  
  const firstRow = data[0];
  const skipFields = ['id', 'student_id', 'primary', 'secondary'];
  const dataFields = Object.keys(firstRow).filter(key => !skipFields.includes(key));
  
  if (formData.type === 'details') {
    // Group by day (extract from day_event format)
    const dayGroups = {};
    
    dataFields.forEach(field => {
      // Extract day from "יום שני ב' ניסן | חסידות בוקר" format
      const parts = field.split(' | ');
      
      const dayName = parts.length > 0 ? parts[0] : 'ימים';
      if (!dayGroups[dayName]) {
        dayGroups[dayName] = [];
      }
      dayGroups[dayName].push({ field });
    });
    
    return Object.keys(dayGroups).map(dayName => ({
      groupId: dayName,
      children: dayGroups[dayName]
    }));
  }
  
  // For other types, group all data fields together
  return [{
    groupId: 'נתוני סיכום',
    children: dataFields.map(field => ({ field }))
  }];
}

export function SummaryDataGrid({ formData }) {
  const summaryData = useSuspenseQuery(apiSummary(formData));
  const infoStudents = useSuspenseQuery(apiInfoStudents());
  const infoColumns = useSuspenseQuery(apiInfoColumns());
  
  const mergedData = mergeSummaryData(
    infoStudents.data,
    summaryData.data,
    infoColumns.data,
    formData
  );
  
  const columns = generateColumns(mergedData, formData);
  const columnGroupingModel = generateColumnGrouping(mergedData, formData);


  const generatePDF = async () => {
  
    const element = document.getElementById('content');
    const canvas = await html2canvas(element, { scale: 2 });
  
  
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
  
  // גדלי דף A4 portrait
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 10;
  
  // שטח זמין
  const availableWidth = pageWidth - (margin * 2);
  const availableHeight = pageHeight - (margin * 2);
  
  // יחס התמונה המקורי
  const imgRatio = canvas.width / canvas.height;
  
  // רוחב קבוע לפי הדף
  const finalWidth = availableWidth;
  const finalHeight = availableWidth / imgRatio;
  
  // אם התמונה נכנסת בדף אחד
  if (finalHeight <= availableHeight) {
    pdf.addImage(imgData, 'PNG', margin, margin, finalWidth, finalHeight);
  } else {
    // חישוב גובה שורה (בהנחה שכל השורות באותו גובה)
    const tableRows = element.querySelectorAll('.MuiDataGrid-row');
    const firstRowHeight = tableRows[0]?.offsetHeight || 35;
    const headerHeight = element.querySelector('.MuiDataGrid-columnHeaders')?.offsetHeight || 35;
    
    // המרה ליחס הקנבס
    const canvasRowHeight = (firstRowHeight * canvas.height) / element.offsetHeight;
    const canvasHeaderHeight = (headerHeight * canvas.height) / element.offsetHeight;
    
    // חישוב כמה שורות נכנסות בדף
    const availableCanvasHeight = (availableHeight * canvas.height) / finalHeight;
    const rowsPerPage = Math.floor((availableCanvasHeight - canvasHeaderHeight) / canvasRowHeight);
    
    let currentY = 0;
    let pageNumber = 0;
    
    while (currentY < canvas.height) {
      if (pageNumber > 0) pdf.addPage();
      
      // יצירת קנבס זמני לדף
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      
      if (pageNumber === 0) {
        // דף ראשון - כולל כותרות + שורות
        const pageContentHeight = Math.min(
          canvasHeaderHeight + (rowsPerPage * canvasRowHeight),
          canvas.height - currentY
        );
        
        tempCanvas.width = canvas.width;
        tempCanvas.height = pageContentHeight;
        
        tempCtx.drawImage(
          canvas,
          0, currentY, canvas.width, pageContentHeight,
          0, 0, canvas.width, pageContentHeight
        );
        
        currentY += pageContentHeight;
      } else {
        // דפים נוספים - כותרות + שורות חדשות
        const rowsContentHeight = Math.min(
          rowsPerPage * canvasRowHeight,
          canvas.height - currentY
        );
        
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvasHeaderHeight + rowsContentHeight;
        
        // הוספת כותרות בחלק העליון
        tempCtx.drawImage(
          canvas,
          0, 0, canvas.width, canvasHeaderHeight,
          0, 0, canvas.width, canvasHeaderHeight
        );
        
        // הוספת השורות מתחת לכותרות
        tempCtx.drawImage(
          canvas,
          0, currentY, canvas.width, rowsContentHeight,
          0, canvasHeaderHeight, canvas.width, rowsContentHeight
        );
        
        currentY += rowsContentHeight;
      }
      
      const pageImgData = tempCanvas.toDataURL('image/png');
      const pageImgHeight = (tempCanvas.height * finalWidth) / canvas.width;
      
      pdf.addImage(pageImgData, 'PNG', margin, margin, finalWidth, pageImgHeight);
      pageNumber++;
    }
  }
  
  pdf.save('table.pdf');
};


  return (
    <DashboardContent>
      <PageLinksHeader links={LINKS} heading="סיכום נוכחות - DataGrid" />      
      <Card sx={{ p: 2 }}>
        <IconButton onClick={() => generatePDF()}>
          <Iconify icon="eva:download-outline" />
        </IconButton>
        <div id='content'>
        <Box>
          <DataGrid
            rows={mergedData}
            columns={columns}
            density='standard'
            columnGroupingModel={columnGroupingModel}
            experimentalFeatures={{ columnGrouping: true }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
                printOption: {
                  disableToolbarButton: false,
                  hideFooter: true,
                  hideToolbar: true
              }
            }
            }}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 32 },
              },
            }}
            pageSizeOptions={[10, 25, 32, 100]}
            hideFooter
            
            disableRowSelectionOnClick
            
          />
          </Box>
          </div>
      </Card>
    </DashboardContent>
  );
}

// Main component with the same form as the original
export function SummaryDataGridViewWrapper() {
  // For demo purposes, using sample form data
  // In real implementation, this would come from the form
  const sampleFormData = {
    events: ['event1', 'event2'],
    start: '2024-01-01',
    end: '2024-01-31',
    group_by: 'day',
    type: 'mean',
    days: ['2024-01-01', '2024-01-02', '2024-01-03']
  };

  return (
    <Container maxWidth={false}>
      <Suspense fallback={<LoadingScreen />}>
        <SummaryDataGrid formData={sampleFormData} />
      </Suspense>
    </Container>
  );
}

export default SummaryDataGridViewWrapper;