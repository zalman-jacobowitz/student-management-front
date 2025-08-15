import { z } from "zod";
import { Suspense, useState } from "react";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import { Box, Container, MenuItem, Typography } from "@mui/material";

import { paths } from "src/routes/paths";

import { apiSummary } from "src/actions/summary";
import { apiTemplates } from "src/actions/templates";

import { Field } from "src/components/hook-form";
import { Iconify } from "src/components/iconify";
import { useSettingsContext } from "src/components/settings";
import { LoadingScreen } from "src/components/loading-screen";
import { StepsProvider } from "src/components/steps-form/steps-provider";
import { MasterStep } from "src/components/steps-form/dynamiv-component";
import { toast } from "src/components/snackbar";
import { apiInfoStudents, infoStudentsUpdate } from "src/actions/info_students";
import { summaryUpdate } from "src/actions/chert";
import { useBoolean } from "src/hooks/use-boolean";
import { TableMainView } from "./summary-list";

function SummaryStepsForm({templateOptions = [] }) {
  const initialValues = {
    numbers: '',
    start: '',
    end: '',
    option: 'סדר'
  };

  const WizardSchema = z.object({
    numbers: z.string().min(1, 'יש לבחור לפחות מספר אחד').optional(),
    start: z.string().min(1, 'תאריך התחלה נדרש').optional(),
    end: z.string().min(1, 'תאריך סיום נדרש').optional(),
    option: z.string().min(1, 'יש לבחור אפשרות').optional(),
  });

  const fields = [
        {
          step: 1,
          name: "numbers",
          label: "בחר תבנית",
          variant: "filled",
          InputLabelProps: { shrink: true },
          children: templateOptions.map(
            (template) => (
              <MenuItem key={template.event_id} value={template.event_id}>
                <Typography variant="body2">{template.event_name}</Typography>
              </MenuItem>
            )
          ),
          component: Field.Select
    },
    {
      step: 2,
      name: "start",
      label: "תחילת אישור",
      variant: "filled",
      InputLabelProps: { shrink: true },
      type: "date",
      component: Field.HebrewDatePicker
    },
    {
      step: 2,
      name: "end",
      label: "סיום אישור",
      variant: "filled",
      InputLabelProps: { shrink: true },
      type: "date",
      component: Field.HebrewDatePicker
    },
      {
          step: 3,
          name: "option",
          label: "בחר סוג סיכום",
          variant: "filled",
          InputLabelProps: { shrink: true },
          children: ['יום', 'סדר'].map(
            (option) => (
              <MenuItem key={option} value={option}>
                <Typography variant="body2">{option}</Typography>
              </MenuItem>
            )
          ),
          component: Field.Select
    },
  ];

  const steps = [
    {
      label: 'בחירת סדר',
      component: <MasterStep fields={fields} number={1} />,
      icon: "mdi:numeric",
      name: 'numbers'
    },
    {
      label: 'בחירת תאריכים',
      component: <MasterStep fields={fields} number={2} />,
      icon: "mdi:calendar",
      name: 'dates'
    },
    {
      label: 'בחירת אפשרות',
      component: <MasterStep fields={fields} number={3} />,
      icon: "mdi:check-circle",
      name: 'option'
    },
    {
      name: 'complete',
      // eslint-disable-next-line react/jsx-no-useless-fragment
      component: <>123</>
    }
  ];
  const [summaryData, setSummaryData] = useState(null);

  const queryClient = useQueryClient();
  const mutate = useMutation(summaryUpdate({queryClient}))
  const apiR = {
      type: 'pie',
      groupBy: [
        { 'table': 'data_students', 'column': 'student_id' },
        { 'table': 'data_students', 'column': 'event' }
      ],
      filters: [],
      xs: 5,
      md: 5
    };
  const isTable = useBoolean();

  const onSubmit = async (data) => {
    console.log('asdddd')
    try {

      const promise = mutate.mutateAsync({data: {config: apiR}, mode: 'select'})

      toast.promise(promise, {
        loading: 'מעדכן...',
        success: 'העדכון הצליח!',
        error: 'העידכון נכשל!',
      });

      const summaryDa = await promise;
      setSummaryData(summaryDa);
      isTable.onTrue()

    } catch (error) {
      console.error('Submission error:', error);
      toast.error('שגיאה בשליחת הטופס');
    }
  }
  const settings = useSettingsContext();
  if (isTable.value) {
    return <TableMainView summaryData={summaryData} />;
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : 'md'}>
    <StepsProvider
      steps={steps}
      defaultValues={initialValues}
      WizardSchema={WizardSchema}
      onSubmit={onSubmit}
    />
  </Container>
  );
}

function SummaryMainView() {

  const template = useSuspenseQuery(apiTemplates())

  console.log('Template data:', template.data);

  return (
    
      <SummaryStepsForm templateOptions={template.data || []} />

  );
}

export function SummaryViewWrapper() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <SummaryMainView />
    </Suspense>
  );
}