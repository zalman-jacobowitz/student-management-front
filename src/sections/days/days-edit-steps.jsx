import { toast } from "sonner";
import { useState, useCallback } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import {Alert, Stack, Button, Dialog, Typography, IconButton, MenuItem} from "@mui/material";
import { Iconify } from "src/components/iconify";
import { Scrollbar } from "src/components/scrollbar";
import { Field } from "src/components/hook-form";

import { z } from "zod";

import { columnsTypes } from "src/utils/uinqe_usege/columnsTypes";
import { StepsProvider } from "src/components/steps-form/steps-provider";
import { MasterStep } from "src/components/steps-form/dynamiv-component";
import { daysUpdate } from "src/actions/days";
import { apiTemplates } from "src/actions/templates";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { uuidv4 } from "src/utils/uuidv4";


function useDayDefinition({ day }) {
  
  const queryClient = useQueryClient();

  const updateDay = useMutation(daysUpdate({queryClient}))

  const onSubmit = useCallback(async (data) => {
    try {

      const dayNewDetails = {
        "day": data.day,
        "template_id": data.template_id,
      }
      
      const withDefault = data.default ? [{...dayNewDetails, day: 'default'}, dayNewDetails] : [dayNewDetails];
      console.log('withDefault: ', withDefault)
      const promiseDay = updateDay.mutateAsync({data: withDefault, mode: "update"})
      toast.promise(promiseDay, {
        loading: 'שומר יום...',
        success: 'יום נשמר בהצלחה',
        error: 'שגיאה בשמירת היום'
      });
      console.log('withDefault: ', withDefault)
      console.log(dayNewDetails)
    } catch (error) {
      console.error('Error saving day:', error);
    }
  }, [updateDay]);

  return {
    onSubmit
  }
}

/*
[
    {
        "day": "ראשון",
        "template_id": "TEMP001"
    },
    {
        "day": "שני",
        "template_id": "TEMP002"
    }
]
*/
function eventsTemplatesByReduce(templates) {
  return Object.values(
    templates.reduce((acc, cur) => {
      const { template_id, template_name, client, ...event } = cur;
      if (!acc[template_id]) {
        acc[template_id] = { template_id, template_name, client, events: [] };
      }
      acc[template_id].events.push(event);
      return acc;
    }, {})
  );
}

export function DayDefinitionStep({ onComplete, day }) {
  console.log('DAYS: ', day)
  
  const templatesQuery = useQuery(apiTemplates());
  const templatesRaw = templatesQuery.data || [];
  
  // יצירת רשימת אפשרויות עם כל התבניות הקיימות
  const templateOptions = templatesRaw.map(template => ({
    value: template.template_id,
    label: template.template_name
  }));
  console.log('templateOptions', templateOptions)
  
  const initialValues = {
    day: day?.day || '',
    template_id: day?.template_id || '',
    default: day?.default,
  }
  console.log('initialValues', day?.day, initialValues)
  const WizardSchema = z.object({
    day: z.string().min(1, 'יום נדרש'),
    template_id: z.string().min(1, 'מזהה תבנית נדרש'),
    default: z.boolean().optional(),
  });

  const fileds = [
    {
      step: 1,
      name: "day",
      label: "יום",
      variant: "filled",
      InputLabelProps: { shrink: true },
      type : "text",
      component: Field.HebrewDatePicker
    },
    {
      step: 1,
      name: "template_id",
      label: "בחר תבנית",
      variant: "filled",
      InputLabelProps: { shrink: true },
      children: templateOptions.map(
        (template) => (
          <MenuItem key={template.type} value={template.value}>
            <Iconify icon={template.icon} width={20} />
            <Typography variant="body2">{template.label}</Typography>
            <Typography variant="caption" color="text.secondary">{template.value}</Typography>
          </MenuItem>
        )
      ),
      component: Field.Select
    },
    {
      step: 1,
      name: "default",
      variant: "outlined",
      type : "text",
      label: "הגדר כברירת מחדל",
      component: Field.Switch
    }
  ]

  const steps = [
    {
      label: 'פרטי יום בסיסיים',
      component: <MasterStep fields={fileds} number={1} />,
      icon: "mdi:calendar-today",
      name: 'basicDayDetails'
    },
    {
      name: 'complete',
      component: <></>
    }
  ]

  const { onSubmit } = useDayDefinition({ day });

  return (
    <StepsProvider
      steps={steps}
      defaultValues={initialValues}
      WizardSchema={WizardSchema}
      onSubmit={onSubmit}
    />
  );
}

// דיאלוג להצגת אשף הגדרת יום
export function DayDialog({ open, onClose, onComplete, column }) {
  
  const handleWizardComplete = (data) => {
    if (onComplete) {
      onComplete(data); // קריאה ל-callback שהועבר מהקומפוננטה המשתמשת
    }
    onClose(); // סגירת הדיאלוג לאחר השלמת האשף
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DayDefinitionStep
        day={column} // העברת היום הנוכחי לאשף
        onComplete={handleWizardComplete} // מטפל בסיום האשף
      />
    </Dialog>
  );
}