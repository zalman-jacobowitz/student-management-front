
import React, { useCallback, useEffect, useState } from 'react';
import { Box, Button, Card, Checkbox, IconButton, TableCell, TextField } from '@mui/material';

import { useTable } from 'src/components/table';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { RegularTable } from 'src/components/regular-table/regular-table';
import { RegularRowProvider } from 'src/components/regular-table/regular-row-provider';
import { DataGrid, GridToolbar, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport } from '@mui/x-data-grid';
import { head } from 'lodash';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { apiTemplates } from 'src/actions/templates';
import { getElul } from 'src/utils/hebrew/getter';
import { info_columns, info_students } from 'src/actions/moks/mokes';
import { descriptionColumns } from '../insert/functions';


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
const infoColumnsMock =  info_columns


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


// דרך 1: מבנה נפרד לקבוצות עמודות
const tableStructurea = {
    basicColumns: [
        { field: 'id', headerName: 'מזהה' },
        { field: 'primary', headerName: 'שם תלמיד' }
    ],
    groupedColumns: [
        {
            groupName: getElul(1),
            columns: [
                { field: '1-1', event: '1'},
                { field: '1-2', event: '2'},
                { field: '1-3', event: '3'}
            ]
        },
        {
            groupName: getElul(2),
            columns: [
                { field: '2-1' , event: "1"},
                { field: '2-2',  event: "2" },
                { field: '2-3', event: "3"}
            ]
        },
        {
            groupName: getElul(3),
            columns: [
                { field: '3-1', event: "1"},
                { field: '3-2', event: "2" },
                { field: '3-3', event: "3"}
            ]
        }
    ]
}

const mockData = [
    {
        id: "1",
        '1-1': true,
        '1-2': true,
        '1-3': true,
        '2-1': true,
        '2-2': false,
        '2-3': true,
        '3-1': true,
        '3-2': false,
        '3-3': true
    },
    {
        id: "2",
        '1-1': true,
        '1-2': true,
        '1-3': false,
        '2-1': true,
        '2-2': true,
        '2-3': true,
        '3-1': true,
        '3-2': false,
        '3-3': true
    },
    {
        id: "3",
        '1-1': true,
        '1-2': false,
        '1-3': true,
        '2-1': true,
        '2-2': true,
        '2-3': false,
        '3-1': true,
        '3-2': false,
        '3-3': true
    },
    {
        id: "4",
        '1-1': true,
        '1-2': true,
        '1-3': true,
        '2-1': false,
        '2-2': false,
        '2-3': true,
        '3-1': true,
        '3-2': false,
        '3-3': false
    },
    {
        id: "5",
        '1-1': true,
        '1-2': true,
        '1-3': true,
        '2-1': false,
        '2-2': true,
        '2-3': false,
        '3-1': true,
        '3-2': false,
        '3-3': false
    },
    {
        id: "6",
        '1-1': false,
        '1-2': true,
        '1-3': false,
        '2-1': false,
        '2-2': false,
        '2-3': false,
        '3-1': true,
        '3-2': false,
        '3-3': true
    },
    {
        id: "7",
        '1-1': true,
        '1-2': false,
        '1-3': false,
        '2-1': false,
        '2-2': false,
        '2-3': true,
        '3-1': false,
        '3-2': false,
        '3-3': false
    },
    {
        id: "8",
        '1-1': true,
        '1-2': true,
        '1-3': true,
        '2-1': false,
        '2-2': false,
        '2-3': false,
        '3-1': true,
        '3-2': true,
        '3-3': true
    }
];


function getEventName(eventId, templates) {

    const event = templates.find(event => event.event_id === eventId);
    return event ? event.event_name : 'לא ידוע';
}
function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport
        printOptions={{
          pageStyle: `
          @page {
            size: A4 portrait;
            margin: 1cm;
          }
          .MuiDataGrid-root {
            direction: rtl;
            width: 100% !important;
            max-width: 100% !important;
          }
          .MuiDataGrid-main {
            direction: rtl;
            color: #af1818ff;
            width: 100% !important;
          }
          .MuiDataGrid-virtualScroller {
            width: 100% !important;
          }
          .MuiDataGrid-columnHeaders {
            width: 100% !important;
          }
          .MuiDataGrid-row {
            width: 100% !important;
          }
          .MuiDataGrid-cell {
          
            flex: .6 !important;
            min-width: 0 !important;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .MuiDataGrid-columnHeader {
            color: #af1818ff !important;
            font-weight: bold;
            flex: .6 !important;
            min-width: 0 !important;
          }
          .MuiDataGrid-columnGroupHeader {
            color: #af1818ff !important;
            font-weight: bold;
            flex: .6 !important;
          }
          .MuiDataGrid-columnHeaderTitle {
            color: #af1818ff !important;
            font-size: 10px;
          }`,
          hideFooter: true,
        hideToolbar: true
        }}
      />
      <GridToolbarDensitySelector/>
    </GridToolbarContainer>
  );
}
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { apiInfoStudents } from 'src/actions/info_students';
import { InfoStudent } from 'src/components/full-table/types';
import { dataStudentsEventUpdate } from 'src/actions/data_students_event';
import { updateData } from 'src/hooks/use-update';
import { DashboardContent } from 'src/layouts/dashboard';

const mockDataJson = {
    "fileName": "סריקה 3.png",
    "json": {
        "document_text": "1. חסידות בוקר 2. תפילה 3. עיונא א 4. עיונא ב 5. הלכה מזהה שם תלמיד",
        "tables": [
            {
                "headers": [
                    "4/2",
                    "4/1",
                    "3/5",
                    "3/2",
                    "3/1",
                    "2/4",
                    "2/3",
                    "2/2",
                    "1/1",
                    "1/3",
                    "1/2",
                    "1/1",
                    "שם תלמיד",
                    "id"
                ],
                "rows": [
                    [
                        "",
                        "",
                        "V",
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                        "V",
                        "farchy Emma",
                        "T-1015"
                    ],
                    [
                        "",
                        "",
                        "",
                        "V",
                        "",
                        "V",
                        "",
                        "V",
                        "",
                        "",
                        "V",
                        "",
                        "Ben David Yoav",
                        "C-1037"
                    ],
                    [
                        "",
                        "V",
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                        "V",
                        "",
                        "",
                        "Minkovsky Ron",
                        "V-1078"
                    ],
                    [
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                        "Eitan Ella",
                        "G-1113"
                    ]
                ],
                "table_id": 1
            }
        ]
    }
}
function convertTableDataToObjects(tableData) {
   const { headers, rows } = tableData;
   
   // מציאת אינדקסים של עמודות חשובות
   const idIndex = headers.findIndex(h => h === 'id');
   const nameIndex = headers.findIndex(h => h === 'שם תלמיד');
   
   return rows.map(row => {
       const obj = {
           id: row[idIndex],
           student_id: row[idIndex], // משתמשים באותו מזהה
       };
       
       // המרת עמודות הנוכחות לפורמט הנדרש
       headers.forEach((header, index) => {
           if (header !== 'id' && header !== 'שם תלמיד') {
               // המרת פורמט התאריכים מ-"1/1" ל-"1-1"
               const fieldName = header.replace('/', '-');
               // המרת "V" ל-true, ריק ל-false
               obj[fieldName] = !!row[index]
           }
       });
       
       return obj;
   });
}


function generateTableStructure(fields) {
  const basicColumns = [
      { field: 'id', headerName: 'מזהה' },
      { field: 'primary', headerName: 'שם תלמיד' }
  ];
  
  // סינון עמודות שמתחילות במספר ולאחר מכן תו לא-מספרי ואז מספר נוסף
  const eventFields = fields.filter(field => /^\d+[^\d]+\d+$/.test(field));
  console.log({fields})
  
  // קיבוץ לפי המספר הראשון (יום)
  const groupedByDay = {};
  const allFields = {};

  eventFields.forEach(field => {
      // חיפוש התו המפריד והפיצול לפיו
      const match = field.match(/^(\d+)([^\d]+)(\d+)$/);
      if (match) {
          const [, day, separator, event] = match;
          
          if (!groupedByDay[day]) {
              groupedByDay[day] = [];
          }
          allFields[field] = {
              day: getElul(parseInt(day)).day,
              event
          };

          groupedByDay[day].push({
              field,
              event
          });
      }
  });
  
  // המרה למבנה הנדרש
  const groupedColumns = Object.keys(groupedByDay)
      .sort((a, b) => parseInt(a) - parseInt(b))
      .map(day => ({
          groupName: getElul(parseInt(day)).full,
          groupId: getElul(parseInt(day)).day,
          columns: groupedByDay[day].sort((a, b) => parseInt(a.event) - parseInt(b.event))
      }));
  
  return {
      basicColumns,
      groupedColumns,
      allFields
  };
}


const getDesc = (student: InfoStudent, desc: string[]): string => desc.map(e => student? student[e] : ' ').join(' ')





export function UploadTableView({dataJson}) {
    console.log({dataJson})
    // השתמשו בנתונים המקומיים במקום קריאות API שלא ניתנות להרצה
    const templates = useSuspenseQuery(apiTemplates());
    const infoStudents = useSuspenseQuery(apiInfoStudents());
    const convertedData = convertTableDataToObjects(dataJson[0].json.tables[0]);
    const tableStructure = generateTableStructure(Object.keys(convertedData[0]));
    
    const merged = mergeWithStudents(infoStudents.data, convertedData, infoColumnsMock);

    const queryClient = useQueryClient();
      
    const { mutateAsync } = useMutation(dataStudentsEventUpdate({queryClient}))  
    
    const [rows, setRows] = useState(merged);
    
    const allColumns = [
        ...tableStructure.basicColumns.map(col => ({
            field: col.field,
            headerName: col.headerName,
            editable: col.field !== 'primary' && col.field !== 'id',
        })),
        ...tableStructure.groupedColumns.flatMap(group => 
            group.columns.map(col => ({
                field: col.field,
                headerName: `${getEventName(col.event, templates.data)}`,
                editable: true,
                width: 75,
                type: 'boolean',
                renderCell: (params) => <Checkbox checked={params.value} />,
            }))
        )
    ];

    const columnGroupingModel = tableStructure.groupedColumns.map(group => ({
        groupId: group.groupName,
        children: group.columns.map(col => ({ field: col.field }))
    }));
    


    const generatePDF = async () => {
        const element = document.getElementById('content');
        const canvas = await html2canvas(element, { scale: 2 });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        const pageWidth = 210;
        const pageHeight = 297;
        const margin = 10;
        
        const availableWidth = pageWidth - (margin * 2);
        const availableHeight = pageHeight - (margin * 2);
        
        const imgRatio = canvas.width / canvas.height;
        const pageRatio = availableWidth / availableHeight;
        
        let finalWidth; let finalHeight;
        
        if (imgRatio > pageRatio) {
            finalWidth = availableWidth;
            finalHeight = availableWidth / imgRatio;
        } else {
            finalHeight = availableHeight;
            finalWidth = availableHeight * imgRatio;
        }
        
        const x = margin;
        const y = margin;
        
        pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
        pdf.save('table.pdf');
    };

    const handleRowUpdate = (newRow) => {
        console.log('שורה מעודכנת:', newRow); 
        setRows(prevRows => prevRows.map(row => (row.id === newRow.id ? newRow : row)));
        return newRow;
    };

    const handleUpdate = useCallback(async (data: any, mode = 'update')=>{
        await updateData({
          data,
          mode,
          mutateAsync
        })
      }, [mutateAsync])
    
    const handleTableAction = async (action, students) => {
        const allData = []
        students.forEach(student => {
            Object.keys(student).forEach(item => {
                const KEY = tableStructure.allFields[item]
                if (!KEY) return;
                allData.push({...KEY, student_id: student.id, data: Number(student[item]) });
            })
            
        })
        handleUpdate(allData)
        console.table(allData);
    }

    return (
        <Card sx={{ p: 2, mb: 2 }}>
            <Button onClick={() => handleTableAction('update', rows)}>עידכון</Button>
            <div id='content'>
                <DataGrid
                    rows={rows} 
                    columns={allColumns}
                    getRowId={(row) => row.id}
                    columnGroupingModel={columnGroupingModel}
                    experimentalFeatures={{ columnGrouping: true }}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 5,
                            },
                        },
                    }}
                    sx={{
                        height: 'calc(100vh - 200px)',
                    }}
                    slots={{ toolbar: CustomToolbar }}
                    pageSizeOptions={[5, 8, 10]}
                    checkboxSelection
                    disableRowSelectionOnClick
                    processRowUpdate={handleRowUpdate}
                />
            </div>
        </Card>
    );
}

