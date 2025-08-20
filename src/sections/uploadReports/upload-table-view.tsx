
import React from 'react';
import { Box, Card, Checkbox, IconButton, TableCell, TextField } from '@mui/material';

import { useTable } from 'src/components/table';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { RegularTable } from 'src/components/regular-table/regular-table';
import { RegularRowProvider } from 'src/components/regular-table/regular-row-provider';
import { DataGrid, GridToolbar, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport } from '@mui/x-data-grid';
import { head } from 'lodash';
import { useSuspenseQuery } from '@tanstack/react-query';
import { apiTemplates } from 'src/actions/templates';
import { getElul } from 'src/utils/hebrew/getter';
import { info_columns, info_students } from 'src/actions/moks/mokes';
import { descriptionColumns, getDesc } from '../insert/functions';
import { generateScanId, uuidv4 } from 'src/utils/uuidv4';


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
const tableStructure = {
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


function getEventName(eventId) {

    const event = templatesMock.find(event => event.event_id === eventId);
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

export function UploadTableView() {
    const templates = useSuspenseQuery(apiTemplates())
    console.log({data: templates.data})

    const merged = mergeWithStudents(infoStudentsMock, mockData, infoColumnsMock)

    // בניית כל העמודות
    const allColumns = [
        ...tableStructure.basicColumns.map(col => ({
            field: col.field,
            headerName: col.headerName,

        })),
        ...tableStructure.groupedColumns.flatMap(group => 
            group.columns.map(col => ({
                field: col.field,
                headerName: `${getEventName(col.event)}`,

                editable: true,
                type: 'boolean',
                renderCell: (params) => <Checkbox checked={params.value} />
            }))
        )
    ];

    // בניית מודל קבוצות העמודות
    const columnGroupingModel = tableStructure.groupedColumns.map(group => ({
        groupId: group.groupName,
        children: group.columns.map(col => ({ field: col.field }))
    }));

    return (
        <DataGrid
            rows={merged}
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
                height: 'calc(100vh - 200px)', // גובה מלא פחות מקום לכותרות
                
            }}
            slots={{ toolbar: CustomToolbar }}
            pageSizeOptions={[5, 8, 10]}
            checkboxSelection
            disableRowSelectionOnClick
        />
    );
}