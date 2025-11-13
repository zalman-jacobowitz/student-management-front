import { toast } from "sonner";
import { useCallback, useEffect, useState, useMemo } from "react";
import { useForm, FormProvider, useFormContext, useFieldArray } from "react-hook-form";

import { Alert, Stack, Dialog, Typography, Box, Button, MenuItem, Divider, Grid, IconButton, Card, alpha } from "@mui/material";
import { Field } from "src/components/hook-form";
import { Iconify } from "src/components/iconify";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { exceptionsUpdate } from "src/actions/exceptions";
import { apiInfoStudents } from "src/actions/info_students.ts";
import { apiInfoColumns } from "src/actions/info_columns.js";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { uuidv4 } from "src/utils/uuidv4";
import { SelectStudents } from "../insert/delays/select-students.jsx";
import { fCurrentTime, today } from "src/utils/format-time.js";
import { Scrollbar } from "src/components/scrollbar/scrollbar.tsx";
import useInsertStore from "../insert/insert-state";
import { inHebrew } from "src/utils/hebrew/getter.js";
import { StepsProvider } from "src/components/steps-form/steps-provider";
import { MasterStep } from "src/components/steps-form/dynamiv-component";
import { screenOptions } from "src/layouts/config-nav-dashboard.jsx";
import { useUserDetails } from "src/hooks/use-user-details.js";
import { usersUpdate } from "src/actions/users.js";



export function useNewForm({existingUser = null}) {

  const queryClient = useQueryClient();
  const mutate = useMutation(usersUpdate({ queryClient }));
  const {userDetails} = useUserDetails();

  const onSubmit = useCallback(async (dataFORM) => {
    try {
      console.log('Submitting user data:', dataFORM);
      console.log('userDetails: ', userDetails)
      
      const data = {
        ...dataFORM.user,
        password: '123456',
        client: userDetails.user_metadata.client,
        org: userDetails.user_metadata.client,
        data: dataFORM
      }
      console.log('Prepared user data for submission:', data);

      const promise = existingUser ? mutate.mutateAsync(Array(dataFORM), 'update'): signUp(data, true);

      toast.promise(promise, {
        loading: 'מעדכן...',
        success: 'העדכון הצליח!',
        error: 'העידכון נכשל!',
      });
      
      const result = await promise;

      queryClient.invalidateQueries();

    } catch (error) {
      console.error('Error during submission:', error);
    }
  }, [mutate, userDetails, queryClient]);

  return {
    onSubmit
  };
}

/*
מבנה הטופס:
    user: {
        
        email, - text
        country, - text
        lastName, - text
        firstName - text
    },
    screens: {
      "info": true, - checkbox
      "insert": true, - checkbox
    },
    permissions: [
      {
        // צד שרת או לקוח
        "side": "server", - select[{label: 'server', value: 'שרת'}, {label: 'client', value: 'לקוח'}]
        // שם העמודה
        "label": "מייל", - select - options from:  useSuspenseQuery(apiInfoColumns()).data - get unique labels
        // שם הטבלה
        "table": "info_students", - select[{label: 'info_students', value: 'info_students'}, {label: 'delays', value: 'delays'}]
        // הערכים לסינון
        "values": [
          "chabadbyronshire@gmail.com" - multi select - options from: useSuspenseQuery(apiInfoStudents()).data - get unique values for the selected column
        ],
        // אופרטור לסינון
        "operator": "and", - select[{label: 'and', value: 'and'}, {label: 'or', value: 'or'}]
        // שם העמודה במערכת - המזהה של העמודה
        "columnName": "user_id" - select - options from:  useSuspenseQuery(apiInfoColumns()).data - get unique columnNames
      }
    ]


מימוש הטופס יהיה כמו:
EXAMPLE:    
  const fileds = [
    {
      step: 1,
      name: "name", - field name
      label: "שם תבנית", - field label
      variant: "filled",
      InputLabelProps: { shrink: true },
      type: "text",
      component: Field.Text - field component from src/components/hook-form/field.jsx
    },
    {
      step: 2,
      name: "events", - field name
      label: "אירועים", - field label
      variant: "filled",
      InputLabelProps: { shrink: true },
      component: EventsSelectionStep - field component if complex
    }
  ]


  const steps = [
    {
      label: 'פרטי תבנית בסיסיים',
      component: <MasterStep fields={fileds} number={1} />,
      icon: "mdi:file-document-edit-outline",
    },
    {
      label: 'פרטי אירועים',
      component: <MasterStep fields={fileds} number={2} />,
      icon: "mdi:calendar-multiple",

    },
    {
      name: 'complete',
      component: <></>
    }
  ]


  return (
    <StepsProvider
      steps={steps}
      defaultValues={initialValues}
      WizardSchema={WizardSchema}
      onSubmit={(data) => onSubmit(data, "update")}
    />

  );

*/

export function NewDefinitionStep({ onComplete, existingUser, editMode = false }) {

   
    const initialValues = {
    user: existingUser.user || {
      email: '',
      country: '',
      lastName: '',
      firstName: ''
    },
    screens: existingUser.screens || screenOptions.reduce((acc, key) => {
            acc[key] = true;
            return acc;
        }, {}),
    limit: {
      column: existingUser.limit?.column || existingUser.column || '',
      values: existingUser.limit?.values || existingUser.values || []
    }
  };

  const WizardSchema = z.object({
    user: z.object({
      email: z.string().email('כתובת מייל לא תקינה'),
      country: z.string().min(1, 'יש לבחור מדינה'),
      lastName: z.string().min(1, 'שם משפחה נדרש'),
      firstName: z.string().min(1, 'שם פרטי נדרש')
    }),
    screens: z.record(z.string(), z.boolean()),  // ✅ כך זה נכון!
    limit: z.object({
      column: z.string().min(1, 'יש לבחור עמודה'),
      values: z.array(z.string()).min(1, 'יש לבחור לפחות ערך אחד')
    })
  });


  const { onSubmit } = useNewForm({ existingUser });
  

  const handleSubmit = async (data, mode = 'update') => {
    console.log('data submitted: ', data);
    await onSubmit(data, mode);
    if (onComplete) {
      onComplete(data);
    }
  };
  
  const [column, setColumn] = useState('');

  const watch = useCallback((e) => {
    console.log('watching', e.limit?.column);
    setColumn(e.limit?.column);
    return e;
    }, []);

 const infoColumns = useSuspenseQuery(apiInfoColumns()).data || [];
const infoStudents = useSuspenseQuery(apiInfoStudents()).data || [];



    const availableValues = useMemo(() => [...new Set(infoStudents.map(student => student[column]))], [infoStudents, column]);
    console.log('availableValues', availableValues);
    
  const fileds = [
    {
      step: 1,
      name: "user.email",
      label: "אימייל",
      variant: "filled",
      InputLabelProps: { shrink: true },
      type: "text",
      component: Field.Text 
    },
    {
        step: 1,
        name: "user.country",
        label: "מדינה",
        variant: "filled",
        InputLabelProps: { shrink: true },
        type: "text",
        component: Field.Text
        },
    {
        step: 1,
        name: "user.lastName",
        label: "שם משפחה",
        variant: "filled",
        InputLabelProps: { shrink: true },
        type: "text",
        component: Field.Text
        },
    {
        step: 1,
        name: "user.firstName",
        label: "שם פרטי",
        variant: "filled",
        InputLabelProps: { shrink: true },
        type: "text",
        component: Field.Text
    },
    ...Object.entries(screenOptions).map(([key, screen]) => (
      {
        step: 2,
        name: `screens.${key}`,
        label: screen.title,
        icon: screen.regularIcon,
        component: Field.ToggleButtonSwitch,
      }
    ))
    ,
    {
      component: Field.Select,
      name: "limit.column",
      label: "בחר עמודה",
      variant: "filled",
      InputLabelProps: { shrink: true },
      helperText: "בחר את העמודה לצורך הגבלת המשתמש",
      step: 3,
      id: 'first',
      children: infoColumns?.map((column) => (
        <MenuItem key={column.name} value={column.name}>
          <Typography variant="body2">{column.label}</Typography>
        </MenuItem>
      )) || []
    },
    {
      component: Field.MultiSelect,
      name: "limit.values",
      label: "בחר ערכים",
      variant: "filled",
      InputLabelProps: { shrink: true },
      helperText: "בחר את הערכים המתאימים",
      options: availableValues.map((column) => ({
        value: column,
        label: column
      })) || [],
      checkbox: true,
      chip: true,
      step: 3
    }

]


  const steps = [
    {
      label: 'פרטי תבנית בסיסיים',
      component: <MasterStep fields={fileds} number={1} />,
      icon: "mdi:file-document-edit-outline",
      name: 'user'
    },
        {
      label: 'מסכים',
      component: <MasterStep fields={fileds} number={2} />,
      icon: "mdi:filter",
      name: 'screens'
    },
    {
      label: 'עמודה וערכים',
      component: <MasterStep fields={fileds} number={3} />,
      icon: "mdi:filter",
    name: 'limit'
    },
    {
      name: 'complete',
      component: <></>
    }
  ]

  return (

        <StepsProvider
            steps={steps}
            defaultValues={initialValues}
            WizardSchema={WizardSchema}
            onSubmit={(data) => onSubmit(data, "update")}
            watch={watch}
            watchName="limit.column"
            />


  );
}

export function NewDialog({ open, onClose, onComplete, existingUser, editMode=false }) {
  const handleWizardComplete = (data) => {
    if (onComplete) {
      onComplete(data);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
      <NewDefinitionStep
        existingUser={existingUser?.details}
        onComplete={handleWizardComplete}
        editMode={editMode}
      />
    </Dialog>
  );
}