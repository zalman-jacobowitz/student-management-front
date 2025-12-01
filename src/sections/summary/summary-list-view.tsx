import { z } from "zod";
import { Suspense, useState } from "react";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import { Box, Container, MenuItem, Typography } from "@mui/material";

import { paths } from "src/routes/paths";

import { useBoolean } from "src/hooks/use-boolean";

import { inHebrew } from "src/utils/hebrew/getter";

import { apiSummary } from "src/actions/summary";
import { summaryUpdate } from "src/actions/chart";
import { apiTemplates } from "src/actions/templates";
import { apiInfoStudents, infoStudentsUpdate } from "src/actions/info_students";

import { toast } from "src/components/snackbar";
import { Field, Form } from "src/components/hook-form";
import { Iconify } from "src/components/iconify";
import { useSettingsContext } from "src/components/settings";
import { LoadingScreen } from "src/components/loading-screen";
import { StepsProvider } from "src/components/steps-form/steps-provider";
import { MasterStep } from "src/components/steps-form/dynamiv-component";
import { useWalktour, Walktour } from "src/components/walktour";

import { TableMainView } from "./summary-list";
import { SummaryDataGrid } from "./summary-datagrid-view";
import { useForm } from "react-hook-form";


//-----------------------------------------------------------------------

const SUMMARY_OPTIONS = [
  { value: 'mean', label: 'ממוצע', icon: <Iconify icon="mdi:calculator" /> },
  { value: 'sum', label: 'סיכום' , icon:<Iconify icon="mdi:format-list-bulleted" /> },
  { value: 'details', label: 'מפורט', icon: <Iconify icon="mdi:format-list-bulleted" /> }
]

const GROUP_BY = [
  { value: 'day', label: 'יום', icon: <Iconify icon="mdi:calendar" /> },
  { value: 'event_name', label: 'סדר', icon: <Iconify icon="mdi:format-list-bulleted" /> }
]

//---------------------------------------------------------------------------

function rangeData(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const dates = [];
    
    const current = new Date(startDate);
    while (current <= endDate) {
        dates.push(current.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 1);
    }
    
    return dates;
}

function SummaryStepsForm({templateOptions = [], setFormData }) {
  const initialValues = {
    events: '',
    start: '',
    end: '',
    group_by: 'סדר',
    type: 'average'
  };

  const WizardSchema = z.object({
    events: z.array(z.string().min(1, 'יש לבחור לפחות סדר אחד')).optional(),
    start: z.string().min(1, 'תאריך התחלה נדרש').optional(),
    end: z.string().min(1, 'תאריך סיום נדרש').optional(),
    group_by: z.string().min(1, 'יש לבחור אפשרות').optional(),
    type: z.string().min(1, 'יש לבחור סוג סיכום').optional()
  });

  const fields = [
      {
        step: 1,
        name: "events",
        label: "בחר סדרים",
        variant: "filled",
        InputLabelProps: { shrink: true },
        type: 'text',
        options: templateOptions?.map((template) => ({
          value: template.event_id,
          label: template.event_name
      })) || [],
      checkbox: true,
      multiple: true,
      chip: true,
      component: Field.MultiCheckbox
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
          name: "group_by",
          label: "קיבוץ לפי",
          variant: "filled",
          InputLabelProps: { shrink: true },
          children: GROUP_BY.map(
            (option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.icon}
                <Typography variant="body2">{option.label}</Typography>
              </MenuItem>
            )
          ),
          component: Field.Select
    },
    {
          step: 3,
          name: "type",
          label: "בחר סוג סיכום",
          variant: "filled",
          InputLabelProps: { shrink: true },
          children: SUMMARY_OPTIONS.map(
            (option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.icon}
                <Typography variant="body2">{option.label}</Typography>
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
      name: 'events'
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

  const onSubmit = async (data) => {

    try {
      const dates = rangeData(data.start, data.end);
      setFormData({ ...data, days: dates });

    } catch (error) {
      console.error('Submission error:', error);
      toast.error('שגיאה בשליחת הטופס');
    }
  }
  const settings = useSettingsContext();

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


function formatSummary(data, formData){
 if (formData.type === 'details'){
   const newTable = data.map(e => {
    const heb = inHebrew(e.day)
    return { 
    ...e,
    day_event: `${heb.יום_עברי} ${heb.חודש_עברי} | ${e.event_name}`}
 });

    // יצירת טבלה חדשה עם צורה שונה: PIVOT
   // העמודות בטבלה החדשה
   const columns = new Set(newTable.map(e=>e.day_event))
   // index:
   const index = [...new Set(data.map(e=>e.student_id))]
   // המערך שיכיל את הנתונים החדשים
   const pivoted = []
   
   // עבור כל student_id
   index.forEach(studentId => {
     const row = { student_id: studentId };
     
     // עבור כל עמודה (day_event)
     columns.forEach(dayEvent => {
       // מצא את הרשומה המתאימה
       const record = newTable.find(e => 
         e.day_event === dayEvent &&
         e.student_id === studentId
       );
       // הוסף את הערך (או 0 אם לא נמצא)
       row[dayEvent] = record ? record.data : 0;
     });
     
     pivoted.push(row);
   });
   
   return pivoted;
 }
  return data
}


function SummaryTableView({ formData }){
  const data = useSuspenseQuery(apiSummary(formData));
  return <SummaryDataGrid summaryData={formatSummary(data.data, formData)} formData={formData} />;
}

function SummaryMainView() {


  const [formData, setFormData] = useState(null);

  const template = useSuspenseQuery(apiTemplates())

  if (formData){
    return <SummaryTableView formData={formData} />;
  }
  return (
      <SummaryStepsForm templateOptions={template.data || []} setFormData={setFormData} />
  );
}

function HebrewCalendar(){

  const methods = useForm()

  return (
  <Form methods={methods} onSubmit={() => {}}>
    <Field.HebrewDatePicker defaultValue="2025-01-01" time={true}/>
  </Form>
  )
}

const walktourSteps = [
  // TODO: Add walktour steps here
];

export function SummaryViewWrapper() {
  const walktour = <Walktour {...useWalktour({steps: walktourSteps})} />
  return (
    <Suspense fallback={<LoadingScreen />}>
      <>
        <HebrewCalendar />
        {walktour}
      </>
    </Suspense>
  );
}