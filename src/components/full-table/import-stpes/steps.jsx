/*
 * TYPE SAFETY ISSUES / בעיות TYPE SAFETY:
 * 1. No TypeScript interfaces for file data structures / אין ממשקי TypeScript למבני נתוני קבצים
 * 2. Untyped props in component definitions / פרופס לא מוגדרים במרכיבים
 * 3. Missing type checking for XLSX data / אין בדיקת טיפוסים לנתוני XLSX
 * 4. File should be .tsx with proper interfaces / הקובץ צריך להיות .tsx עם ממשקים מתאימים
 */

/* eslint-disable react/no-unstable-nested-components */
import * as XLSX from 'xlsx';
/* eslint-disable react/jsx-no-bind */
import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Step from '@mui/material/Step';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Card, Alert, MenuItem } from '@mui/material';

import { SingleFilePreview, Upload } from 'src/components/upload';
import { Iconify } from 'src/components/iconify';
import { Field } from 'src/components/hook-form';
import { readFile } from 'src/utils/files/read-file';
import { downloadTemplate } from 'src/utils/files/download-tamplate';
import { toast } from 'sonner';
import { columnsDetails } from 'src/utils/uinqe_usege/columnsValid';


// ----------------------------------------------------------------------

function TamplateExample({typeFile}){
  return (
    <Card sx={{ p: 3, mb: 2 }}>
    <Typography variant="subtitle1" gutterBottom>
      תבנית קובץ {typeFile}
    </Typography>
    <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
      לפני העלאת קובץ, תוכל להוריד תבנית {typeFile} ריקה הכוללת את כל העמודות הנדרשות למערכת.
      מלא את התבנית בנתונים ולאחר מכן העלה אותה בטופס למטה.
    </Typography>
    <Button
      variant="outlined"
      color="primary"
      startIcon={<Iconify icon="mdi:file-download-outline" />}
      onClick={() => downloadTemplate(typeFile)}
    >
      הורד תבנית {typeFile} ריקה
    </Button>
  </Card>
  )
}


export function InitImportFile({oldData}) {
  const { setValue, watch } = useFormContext();

  const handleFileUpload = (acceptedFiles) => {
    const fileDetails = acceptedFiles[0];
    if (!fileDetails) return;

    const reader = new FileReader();

    reader.readAsArrayBuffer(fileDetails);
    reader.onload = (event) => {
      
      const data = readFile({
        fileDetils: fileDetails,
        types: ['excel', 'csv'], 
        fileData: event.target.result
      });

      if (data.status === 'success') {
        setValue('ImportFile', data.data);
      } else {
        toast.error(data.message);
      }
    }

  };

  return (
    <Stack spacing={2}>
      {watch('ImportFile.data') && (
        <Alert severity="success">
          העלאת קובץ מאקסל עם נתוני תלמידים בוצעה בהצלחה
        </Alert>
      )}
      {!oldData.length && <TamplateExample typeFile='excel'/>}
      <Upload
        multiple={false}
        accept={{
          'text/csv': ['.csv'],
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
          'application/vnd.ms-excel': ['.xls']
        }}
        maxSize={5000000} // 5MB
        onDrop={handleFileUpload}
      />
    </Stack>
  );
}

// ----------------------------------------------------------------------

export function InitColumnNames() {
    const { watch } = useFormContext();
    const values = watch('ImportFile');
    const columns = values?.columns || [];
    
    const columnsSelect = columnsDetails.map((column) => (
      <Field.Select
        name={`columnNames.${column.name}`}
        label={column.label}
        variant="filled"
        InputLabelProps={{ shrink: true }}
      >
      {columns.map((col) => (
        <MenuItem key={col} value={col}>
          {col}
        </MenuItem>
      ))
      }
      </Field.Select>
    ))
  
    return (
      <Stack spacing={2}>
        {columnsSelect}
      </Stack>
    );
}

export function CompleteStep({ onReset }) {
  return (
    <Box
      gap={5}
      display="flex"
      alignItems="center"
      flexDirection="column"
      justifyContent="center"
      sx={{ borderRadius: 'inherit', bgcolor: 'background.neutral', p: 5 }}
    >
      <Typography variant="h6">השלמת את כל השלבים - כעת המערכת מוכנה!</Typography>

      <Button
        sx={{ mt: 2 }}
        variant="outlined"
        onClick={onReset}
        startIcon={<Iconify icon="solar:restart-bold" />}
      >
        העלאה מחדש
      </Button>
    </Box>
  );
}