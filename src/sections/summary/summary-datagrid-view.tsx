import * as React from 'react';
import { Suspense } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { DataGrid, GridColDef, GridToolbar, GridToolbarExport } from '@mui/x-data-grid';
import { Box, Card, Container, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { apiTemplates } from 'src/actions/templates';
import { apiInfoStudents } from 'src/actions/info_students';
import { apiInfoColumns } from 'src/actions/info_columns';
import { apiSummary } from 'src/actions/summary';
import { LoadingScreen } from 'src/components/loading-screen';
import { DashboardContent } from 'src/layouts/dashboard';
import { PageLinksHeader } from 'src/components/layout/header-links';
import { inHebrew } from 'src/utils/hebrew/getter';

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

// Generate columns dynamically
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
      columns.push({
        field: key,
        headerName: key,
        width: 120,
        headerAlign: 'center' as const,
        align: 'center' as const,
        renderCell: (params) => {
          if (formData.type === 'details') {
            return params.value > 0 ? '✓' : '✗';
          }
          return `${params.value}%`;
        },
      });
    }
  });
  
  return columns;
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
  
  return (
    <DashboardContent>
      <PageLinksHeader links={LINKS} heading="סיכום נוכחות - DataGrid" />
      
      <Card sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ textAlign: 'right' }}>
          סוג סיכום: {formData.type === 'details' ? 'מפורט' : formData.type === 'mean' ? 'ממוצע' : 'סיכום'}
        </Typography>
        
        <Box sx={{ height: 600, width: '100%' }}>
          <GridToolbarExport
            printOptions={{
              hideFooter: true,
              hideToolbar: true,
            }}
          >
          <DataGrid
            rows={mergedData}
            columns={columns}
            slots={{ toolbar: GridToolbar }}

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
                paginationModel: { page: 0, pageSize: 25 },
              },
            }}
            pageSizeOptions={[10, 25, 50, 100]}
            checkboxSelection
            disableRowSelectionOnClick
            sx={{
              '& .MuiDataGrid-toolbarContainer': {
                padding: 2,
                borderBottom: '1px solid rgba(224, 224, 224, 1)',
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: 'background.neutral',
                borderBottom: '2px solid rgba(224, 224, 224, 1)',
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 600,
          
            },
            '@media print': {
                'body': {
                  margin: 0,
                  padding: 0,
                  color: 'rgba(0, 0, 0, 0.87)',
                  direction: 'rtl',
                },


                '.MuiDataGrid-root': { color: 'rgba(0, 0, 0, 0.87)', direction: 'rtl' },
                '.MuiDataGrid-main': { color: 'rgba(0, 0, 0, 0.87)', direction: 'rtl' },
                
              }
            }}
          />
          </GridToolbarExport>
          </Box>
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