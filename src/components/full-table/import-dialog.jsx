/*
 * TYPE SAFETY ISSUES / בעיות TYPE SAFETY:
 * 1. No TypeScript interfaces for data structures / אין ממשקי TypeScript למבני נתונים
 * 2. 'any' types used in validation functions / שימוש בטיפוס 'any' בפונקציות ולידציה
 * 3. Untyped props in component definitions / פרופס לא מוגדרים במרכיבים
 * 4. Missing type annotations for function parameters / חסרות הערות טיפוס לפרמטרים של פונקציות
 * 5. No validation for external data sources / אין ולידציה לטיפוסים ממקורות נתונים חיצוניים
 */

import { toast } from 'sonner';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import React, { useState, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useUserDetails } from 'src/hooks/use-user-details';

import { infoStudentsUpdate } from 'src/actions/info_students.ts';

import { Form } from 'src/components/hook-form';

import { useSteps } from 'src/hooks/use-stepper';
import { transformKeys } from 'src/utils/pandas/trans-keys';
import { findDuplicates, findInternalDuplicates } from 'src/utils/pandas/find-duplicates';

import { generateUniqueIds } from 'src/utils/function-edit';

import { StepProvider } from 'src/components/steps-form/style';
import { InitStepper, StepperActions } from 'src/components/steps-form/header-steps';

import { StepsProvider } from 'src/components/steps-form/steps-provider';
import { columnsDetails } from 'src/utils/uinqe_usege/columnsValid';
import { InitImportFile, InitColumnNames, CompleteStep } from './import-stpes/steps';
import { useBoolean } from 'src/hooks/use-boolean';
import { ConfirmDialog } from '../custom-dialog';
import { uuidv4 } from 'src/utils/uuidv4';



// ----------------------------------------------------------------------

// every
const WizardSchema = zod.object({
  ImportFile: zod.object({
    columns: zod.array(zod.string()).min(1),
    data: zod.array(zod.record(zod.string(), zod.string())).min(1)
  }).optional(),
  columnNames: zod.object(columnsDetails.reduce((acc, column) => {
    acc[column.name] = zod.string().min(1);
    return acc;
  }, {}))
});


// every
const defaultValues = {
  ImportFile: { columns: [], data: [] },
  columnNames: columnsDetails.reduce((acc, column) => {
    acc[column.name] = column.name;
    return acc;
  }, {})
};

// ------------------------------------------------------------

const columnsMap = (data) => transformKeys({
  table: data.ImportFile.data,
  keyMapping: data.columnNames
});


const requiredCheck = (data, columns) => {
  const errors = [];
  data.forEach((row, index) => {
    columns.forEach(column => {
      const error = Number(column.required) && !row[column.name] ? `שדה חובה חסר: ${column.name} בשורה ${index + 1}` : null;
      if (error) errors.push(error);
    });
  });
  return errors;
}


const duplicatesCheck = (data, oldData, columns) => {
  const uniqueColumns = columns.filter(e => e.uniqe).map(e => e.name);

  const result = {
    internalDuplicates: [],
    betweenTables: []
  };
  
  // בדיקת כפילות פנימיות בטבלה החדשה
  result.internalDuplicates = findInternalDuplicates(data, uniqueColumns);
  
  // בדיקת כפילות בין הטבלאות
  if (oldData.length) {
    result.betweenTables = findDuplicates({
      table1: oldData,
      table2: data,
      columns: uniqueColumns
    });
  }
  
  return result;
}

const processData = (withColumns, infoColumns) => withColumns.map(row => {
  const filtered = {};
  infoColumns.forEach(col => { filtered[col.name] = row[col.name]; });
  return filtered;
});

function validateData(data, oldData, userEmail, infoColumns){
  // שינוי שמות העמודות בקובץ שיובא לשמות הנדרשים שתואמים את הטבלה הנוכחית
  const withColumns = columnsMap(data);
  // בדיקת שגיאות - כגון סוגי שדות והאם נדרש
  const errors = requiredCheck(withColumns, infoColumns);
  const dup = duplicatesCheck(withColumns, oldData, infoColumns);
  
  dup.betweenTables.forEach((row, index) => errors.push(`שגיאה ${index + 1}: ${row.שם} ${row.משפחה} כבר קיים במערכת`));
  errors.push(...dup.internalDuplicates);

  // מכיל רק את העמודות של המערכת
  const filteredData = processData(withColumns, infoColumns);
  
  // הוספת מזהים ייחודיים לכל שורה
  const validData = filteredData.map((record) => ({
      ...record,
      student_id: uuidv4()
  }));

  return {errors, validData};
}

// ------------------------------------------------------------

function useImportData(oldData, infoColumns){
  const [listErrors, setListErrors] = useState([]);

  const { userDetails } = useUserDetails();
  const errorsDialog = useBoolean();
  const userEmail = userDetails?.email || 'unknown';
  const queryClient = useQueryClient();
  const mutate = useMutation(infoStudentsUpdate({queryClient}));

  const onSubmit = async (data) => {
    try {

      const { errors, validData } = validateData(data, oldData, userEmail, infoColumns);
      console.log('errors:', errors)
      if (errors.length > 0){
        setListErrors(errors);
        errorsDialog.onTrue();
        console.log('listErrors:', errors)
        console.log('errorsDialog:', errorsDialog.value)
        return true
      }
      
      if (!validData) return false;
      const promise = mutate.mutateAsync({data: validData, mode : 'update'});
      
      toast.promise(promise, {
        loading: 'מעדכן...',
        success: 'העדכון הצליח!',
        error: 'העדכון נכשל!',
      });
      await promise;
      return true;
    } catch (error) {
      console.error(error);
      toast.error('שגיאה בעיבוד הנתונים');
      return false;
    }
  }

  return {
    onSubmit,
    errorsDialog,
    listErrors
  }
}


export function FullTableImportDialog({ open, onClose, oldData=[], infoColumns=[] }) {

  const steps = [
    {
      label: 'העלאת קובץ',
      component: <InitImportFile oldData={oldData}/>,
      icon: "mdi:file-upload-outline",
      name: 'ImportFile'
    },
    {
      label: 'התאמת עמודות',
      component: <InitColumnNames />,
      icon: "mdi:account-details-outline",
      name: 'columnNames',
      alertHelper: {
        text: 'הגדר את שמות העמודות התואמות את הקובץ שלך.',
        color: 'warning'
      }
    },
    {
      name: 'complete',
      component: <CompleteStep onReset={onClose} />
    }
  ]

  const { onSubmit, errorsDialog, listErrors } = useImportData(oldData, infoColumns);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <StepsProvider
          steps={steps}
          defaultValues={defaultValues}
          WizardSchema={WizardSchema}
          onSubmit={onSubmit}
        />  <ConfirmDialog
        open={errorsDialog.value}
        onClose={errorsDialog.onFalse}
        fullWidth
        maxWidth="sm"
        content={
          <>
          <h2>שגיאות!</h2>
          <ul>
            {listErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
          </>
        }
        />
    </Dialog>
   
  

  );
}

