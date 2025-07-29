
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z as zod } from 'zod';

import { useUserDetails } from 'src/hooks/use-user-details';

import { infoStudentsUpdate } from 'src/actions/info_students.ts';
import { apiExportByUser } from 'src/actions/export_by_user';

import { Field } from 'src/components/hook-form';
import { StepsProvider } from 'src/components/steps-form/steps-provider';

import { CompleteStep, ExportDetails } from './export-steps'




// ------------------------------------------------------------

function useExportData() {
  const { userDetails } = useUserDetails();
  const userEmail = userDetails?.email || 'unknown';
  const queryClient = useQueryClient();
  const [columns, setColumns] = useState({
    index: '',
    column1: '',
    column2: '',
    splitBy: ''
  })
  const { data } = useQuery(apiExportByUser({columns, enabled: columns.index !== ''}))
  const onSubmit = async (dataForm) => {
    try {
      setColumns(dataForm)
      const promise = dataForm
      /*
      toast.promise(promise, {
        loading: 'מעדכן...',
        success: 'העדכון הצליח!',
        error: 'העדכון נכשל!',
      });

      await promise;
      */
      return !true;
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


export function ExportScreen({ columnsList = [] }) {
  // every
  // index is select from columnsList

  const WizardSchema = zod.object({
    index: zod.string(),
    column1: zod.string(),
    column2: zod.string(),
    splitBy: zod.string()
  });


  // every
  const defaultValues = {
    index: '',
    column1: '',
    column2: '',
    splitBy: ''
  };



  const fileds = [
    {
      name: "index",
      label: "אינדקס",
      variant: "filled",
      InputLabelProps: { shrink: true },
      type : "text",
      component: Field.Select,
    },
    {
      name: "splitBy",
      label: "עמודת פיצול לטבלאות",
      variant: "filled",
      InputLabelProps: { shrink: true },
      type : "email",
      component: Field.Select,
    },
    {
      name: "column1",
      label: "עמודה 1",
      variant: "filled",
      InputLabelProps: { shrink: true },
      type : "text",
      component: Field.Select,

    },
    {
      name: "column2",
      label: "עמודה 2",
      variant: "filled",
      InputLabelProps: { shrink: true },
      type : "country",
      component: Field.Select,
    },
  ]

  
  const steps = [
    {
      label: 'הגדרת עמודות',
      component: <ExportDetails columnsList={columnsList} fields={fileds.slice(0, 2)} />,
      icon: "mdi:table-eye-outline",
      name: 'ExportDetails'
    },
    {
      label: 'הגדרת אינדקס',
      component: <ExportDetails columnsList={columnsList} fields={fileds.slice(2, 4)} />,
      icon: "mdi:file-export-outline",
      name: 'ExportDetailsIndex'
    },

    {
      name: 'complete',
      component: <CompleteStep />
    }
  ]

  const { onSubmit } = useExportData();

  return (
    <StepsProvider
      steps={steps}
      defaultValues={defaultValues}
      WizardSchema={WizardSchema}
      onSubmit={onSubmit}
    />
  );
}
