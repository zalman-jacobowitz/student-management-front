import { toast } from "sonner";
import { useState, useCallback } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { Alert, Stack, Button, Dialog, Typography, IconButton, MenuItem } from "@mui/material";
import { Iconify } from "src/components/iconify";
import { Scrollbar } from "src/components/scrollbar";
import { Field } from "src/components/hook-form";

import { z } from "zod";

import { columnsTypes } from "src/utils/uinqe_usege/columnsTypes";
import { StepsProvider } from "src/components/steps-form/steps-provider";
import { MasterStep } from "src/components/steps-form/dynamiv-component";
import { templatesUpdate } from "src/actions/templates";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { shortId, uuidv4 } from "src/utils/uuidv4";



// שלב 3: בחירת אירועים
export function EventsSelectionStep() {
  const { control } = useFormContext();
  
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "events",
  });

  const [shortId, setShortId] = useState(String(fields.length + 1));

  return (
    <Stack spacing={3}>
      <Scrollbar sx={{ maxHeight: { xs: 100, sm: 200, md: 260 } }}>
        <Stack spacing={2}>
          {fields.map((item, index) => (
            <Stack key={item.id} spacing={2}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Field.Text
                  name={`events[${index}].event_name`}
                  placeholder="שם האירוע"
                  fullWidth />
                <IconButton onClick={() => remove(index)} color="error">
                  <Iconify icon="mdi:delete" />
                </IconButton>
              </Stack>
              <Stack direction="row" spacing={2} alignItems="center">
                <Field.Text
                  name={`events[${index}].event_start`}
                  placeholder="תאריך התחלה"
                  type="time"
                  fullWidth />
                <Field.Text
                  name={`events[${index}].event_end`}
                  placeholder="תאריך סיום"
                  type="time"
                  fullWidth />
              </Stack>
            </Stack>
          ))}
        </Stack>
      </Scrollbar>
      <Button
        type="button"
        variant="outlined"
        startIcon={<Iconify icon="mdi:plus" />}
        onClick={() => append({ event_name: '', event_id: shortId, event_start: '', event_end: '' , new: true})}
      >
        הוסף אירוע
      </Button>
    </Stack>
  );
}



/*
[
    {
        "template_id": "TEMP001",
        "template_name": "Daily Schedule",
        "client": "client1",
        "events": [
            {
                "event_end": "12:00:00",
                "event_id": "EV001",
                "event_name": "Morning Session",
                "event_start": "08:00:00"
            },
            {
                "event_end": "17:00:00",
                "event_id": "EV002",
                "event_name": "Afternoon Session",
                "event_start": "13:00:00"
            }
        ]
    },
    {
        "template_id": "TEMP002",
        "template_name": "Half Day",
        "client": "client1",
        "events": [
            {
                "event_end": "12:00:00",
                "event_id": "EV003",
                "event_name": "Morning Only",
                "event_start": "08:00:00"
            }
        ]
    },
    {
        "template_id": "TEMP003",
        "template_name": "Extended Day",
        "client": "client1",
        "events": [
            {
                "event_end": "18:00:00",
                "event_id": "EV004",
                "event_name": "Full Day",
                "event_start": "08:00:00"
            }
        ]
    }
]
*/
export function TemplateDefinitionStep({onSubmit, onComplete, template }) {

  // ערכים בהתאם לנתונים קיימים או חדשים
  const initialValues = {

    template_id: template?.template_id || '',
    template_name: template?.template_name || '',
    events: template?.events || [],
  }

  const WizardSchema = z.object({
    template_id: z.string().optional(),
    template_name: z.string().min(1, 'שם תבנית נדרש'),
    events: z.array(z.object({
      event_name: z.string().min(1, 'שם אירוע נדרש'),
      event_start: z.string(),
      event_end: z.string(),
      event_id: z.string().optional(),
    })).optional(),
  });



  const fileds = [
    {
      step: 1,
      name: "template_name",
      label: "שם תבנית",
      variant: "filled",
      InputLabelProps: { shrink: true },
      type: "text",
      component: Field.Text
    },
    {
      step: 2,
      name: "events",
      label: "אירועים",
      variant: "filled",
      InputLabelProps: { shrink: true },
      component: EventsSelectionStep
    }
  ]


  const steps = [
    {
      label: 'פרטי תבנית בסיסיים',
      component: <MasterStep fields={fileds} number={1} />,
      icon: "mdi:file-document-edit-outline",
      name: 'basicTemplateDetails'
    },
    {
      label: 'פרטי אירועים',
      component: <MasterStep fields={fileds} number={2} />,
      icon: "mdi:calendar-multiple",
      name: 'eventsSelection'
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
}





// דיאלוג להצגת אשף הגדרת תבנית
export function TemplateDialog({ onSubmit, open, onClose, onComplete, column }) {
  const handleWizardComplete = (data) => {
    if (onComplete) {
      onComplete(data); // קריאה ל-callback שהועבר מהקומפוננטה המשתמשת
    }
    onClose(); // סגירת הדיאלוג לאחר השלמת האשף
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth="sm" maxWidth="sm">
      <TemplateDefinitionStep
        onSubmit={onSubmit}
        template={column} // העברת התבנית הנוכחית לאשף
        onComplete={handleWizardComplete} // מטפל בסיום האשף
      />
    </Dialog>
  );
}