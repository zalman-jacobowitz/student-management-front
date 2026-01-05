
import jsPDF from 'jspdf';
import { head, template } from 'lodash';
import html2canvas from 'html2canvas';
import React, { Suspense } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';

import { DataGrid, GridToolbar, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport } from '@mui/x-data-grid';
import { Box, Button, Card, CardActions, CardContent, CardHeader, Checkbox, Grid, IconButton, TableCell, TextField, Typography } from '@mui/material';

import { getElul } from 'src/utils/hebrew/getter';

import { apiTemplates } from 'src/actions/templates';
import { apiInfoColumns } from 'src/actions/info_columns';
import { apiInfoStudents } from 'src/actions/info_students';
import { info_columns, info_students } from 'src/actions/moks/mokes';

import { useTable } from 'src/components/table';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { LoadingScreen } from 'src/components/loading-screen';
import { useWalktour, Walktour } from "src/components/walktour";
import { RegularTable } from 'src/components/regular-table/regular-table';
import { RegularRowProvider } from 'src/components/regular-table/regular-row-provider';

import { descriptionColumns, getDesc } from '../insert/functions';
import { InfoColumn, InfoStudent, Template } from 'src/serverTypes';


const templatesMock = [
    {
        "client": "zalmanjacob@gmail.com",
        "event_end": "08:30",
        "event_id": "1",
        "event_name": "חסידות בוקר",
        "event_start": "07:00",
        "template_id": "31ac234a-01a8-4794-acf3-431a4763f7da",
        "template_name": "רגיל"
    },
    {
        "client": "zalmanjacob@gmail.com",
        "event_end": "10:30",
        "event_id": "2",
        "event_name": "תפילה",
        "event_start": "09:00",
        "template_id": "31ac234a-01a8-4794-acf3-431a4763f7da",
        "template_name": "רגיל"
    },
    {
        "client": "zalmanjacob@gmail.com",
        "event_end": "14:00",
        "event_id": "3",
        "event_name": "נגלה בוקר",
        "event_start": "12:00",
        "template_id": "31ac234a-01a8-4794-acf3-431a4763f7da",
        "template_name": "רגיל"
    },
    {
        "client": "zalmanjacob@gmail.com",
        "event_end": "17:30",
        "event_id": "4",
        "event_name": "נגלה צהריים",
        "event_start": "16:00",
        "template_id": "31ac234a-01a8-4794-acf3-431a4763f7da",
        "template_name": "רגיל"
    },
    {
        "client": "zalmanjacob@gmail.com",
        "event_end": "20:00",
        "event_id": "5",
        "event_name": "הלכה",
        "event_start": "18:30",
        "template_id": "31ac234a-01a8-4794-acf3-431a4763f7da",
        "template_name": "רגיל"
    }
]

const infoStudentsMock = info_students.slice(0, 10)
const infoColumnsMock = info_columns


function mergeWithStudents(infoStudents, summaryData, infoColumns) {
    // Implement your merging logic here
    const { primary, secondary } = descriptionColumns(infoColumns);
    const mergedData = summaryData.map(summary => {
        const student = infoStudents.find(item => item.student_id === summary.id);
        return {
            'primary': getDesc(student, primary),
            ...summary
        }
    });
    return mergedData
}


const mockData = Array.from({ length: 10 }, (_, i) => ({
    id: (String(i + 1)).toString(),
    '1-1': true,
    '1-2': true,
    '1-3': true,
    '2-1': true,
    '2-2': true,
    '2-3': true,
    '3-1': true,
    '3-2': true,
    '3-3': true
    }))



export function DownTableView() {
    const templates: Template[] = useSuspenseQuery(apiTemplates()).data 
    const infoStudents: InfoStudent[] = useSuspenseQuery(apiInfoStudents()).data;
    const infoColumns: InfoColumn[] = useSuspenseQuery(apiInfoColumns()).data;

    // מכפיל את התוכן במערך mockData בחמישה
    const extendedMockData = infoStudents.map((item, index) => ({
        id: item.student_id,
        '1-1': true,
        '1-2': true,
        '1-3': true,
        '2-1': true,
        '2-2': true,
        '2-3': true,
        '3-1': true,
        '3-2': true,
        '3-3': true
    }))
    const merged = mergeWithStudents(infoStudents, extendedMockData, infoColumns)

    console.log({ merged })
    // בניית כל העמודות
    const allColumns = [
        { field: 'id', headerName: 'id', width: 70},
        { field: 'primary', headerName: 'תלמיד' , width: 120},
        ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((_, group) => ({
            field: `group-${group}`,
            headerName: '',
            width: '10',
            editable: true,
            type: 'boolean',
            renderCell: (params) => Number(params.row.id)? <Checkbox checked={params.value} /> : <> </>
        }))
    ];

    console.log({ allColumns })


  const generatePDF = async () => {
  
    const element = document.getElementById('content');
    const canvas = await html2canvas(element, { scale: 2 });
  
  
    const imgData = canvas.toDataURL('image/png');
    // eslint-disable-next-line new-cap
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
      // eslint-disable-next-line no-plusplus
      pageNumber++;
    }
  }
  
  pdf.save('table.pdf');
};
    // קבלת רשימת תבניות ייחודיות - כולל שם התבנית ומזהה: template_id, template_name
    const uniqueTemplates = Array.from(new Set(templates.map(t => t.template_id)));
    

    return (
        <>

            <Button onClick={() => generatePDF()}>הורד תבנית</Button>
            <div id='content'>
                <Card>
                    <CardContent>
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                          {uniqueTemplates.map((templateId) => {

                            const oneTemplates = templates.filter(t => t.template_id === templateId);
                            
                            return (
                            <Grid key={templateId} item xs={12} sm={6} md={4} lg={3} >
                              <Typography variant="body2">{templates.find(t => t.template_id === templateId)?.template_name}</Typography>
                            {oneTemplates.map((template) => (
                              <>
                                <Typography variant="h6"> {template.event_id} - סדר {template.event_name} </Typography>
                                
                              </>
                            ))
                          }
                            </Grid>
                            )})}
                        </Grid>
                      
                    <DataGrid
                        
                        density='compact'
                        rows={[{
                            "primary": " ",
                            "id": " ",
                            "1-1": false,
                            "1-2": false,
                            "1-3": false,
                            "2-1": false,
                            "2-2": false,
                            "2-3": false,
                            "3-1": false,
                            "3-2": false,
                            "3-3": false
                        }, ...merged]}
                    columns={allColumns}
                    getRowId={(row) => row.id}
    
                    autoHeight
                    sx={{
                        width: '100%',
                        '& .MuiDataGrid-cell:not(:empty)': {
                            border: '1px solid black',
                            fontWeight: 'bold',
                            direction: 'rtl'
                        },
                        '& .MuiDataGrid-cell:empty': {
                            border: 'none',
                        },
                        '& .MuiDataGrid-columnHeader': {
                            border: '1px solid black',
                        },
                        '& .MuiDataGrid-row': {
                            border: 'none',
                        }
                    }}
                    hideFooter
                    initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 55,
                                },
                            },
                        }}
                    pageSizeOptions={[55]}
                    disableRowSelectionOnClick
                />
                </CardContent>
                <CardActions>
                    <Typography variant="body2" > כללי שימוש: </Typography>
                </CardActions>
            </Card>
            </div>
        </>
    );
}

const walktourSteps = [
  // TODO: Add walktour steps here
];

export function DownloadViewWrapper() {
  const walktour = <Walktour {...useWalktour({steps: walktourSteps})} />
  return (
    <Suspense fallback={<LoadingScreen />}>
      <>
        <DownTableView />
        {walktour}
      </>
    </Suspense>
  );
}