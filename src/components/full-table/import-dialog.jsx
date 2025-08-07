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
import { findDuplicates } from 'src/utils/pandas/find-duplicates';

import { generateUniqueIds } from 'src/utils/function-edit';

import { StepProvider } from 'src/components/steps-form/style';
import { InitStepper, StepperActions } from 'src/components/steps-form/header-steps';

import { StepsProvider } from 'src/components/steps-form/steps-provider';
import { columnsDetails } from 'src/utils/uinqe_usege/columnsValid';
import { InitImportFile, InitColumnNames, CompleteStep } from './import-stpes/steps';



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


const errorsCheck = (data) => {
  const errors = [];
  data.forEach((row) => {
    columnsDetails.forEach(column => {
      const error = column.onError(row);
      if (error) errors.push(error);
    });
  });
  return errors;
}

const duplicatesCheck = (data, oldData) => {
  if (!oldData.length) return [];
  const dup = findDuplicates({
    table1: oldData,
    table2: data,
    columns: columnsDetails.filter(e=>e.unique).map(e=>e.name)
  });
  return dup;
}

const processData = (withColumns) => withColumns.map(row => {
  const filtered = {};
  columnsDetails.forEach(col => { filtered[col.name] = row[col.name]; });
  return filtered;
});

function validateData(data, oldData, userEmail){
  const withColumns = columnsMap(data);      
  const errors = errorsCheck(withColumns);
  const dup = duplicatesCheck(withColumns, oldData);
  
  dup.forEach((row, index) => errors.push(`שגיאה ${index + 1}: ${row.שם} ${row.משפחה} כבר קיים במערכת`));

  if (errors.length > 0) {
    toast.error(`נמצאו ${errors.length} שגיאות בקובץ`);
    return null;
  }
  const processedData = processData(withColumns);
  const finalData = generateUniqueIds(processedData, userEmail);

  return finalData;
}

// ------------------------------------------------------------

function useImportData(oldData){
  const { userDetails } = useUserDetails();
  const userEmail = userDetails?.email || 'unknown';
  const queryClient = useQueryClient();
  const mutate = useMutation(infoStudentsUpdate({queryClient}));

  const onSubmit = async (data) => {
    try {

      const validData = validateData(data, oldData, userEmail);
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
    onSubmit
  }
}


export function FullTableImportDialog({ open, onClose, oldData=[] }) {

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

  const { onSubmit } = useImportData(oldData);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <StepsProvider
          steps={steps}
          defaultValues={defaultValues}
          WizardSchema={WizardSchema}
          onSubmit={onSubmit}
        /> 
    </Dialog>
  );
}
