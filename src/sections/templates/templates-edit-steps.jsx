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
                  disabled={!item.new}
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


function templateDataServerFromat(data) {
  const template_id = uuidv4()
  const { events, template_name } = data

  const listEvents = []

  data.events.map(event => listEvents.push({
    template_id,
    template_name,
    event_name: event.event_name,
    event_id: event.event_id || uuidv4(),
    event_start: event.event_start,
    event_end: event.event_end
  }))

  return listEvents
}
function compareVersions(oldData, newData) {
    const result = [];
    const oldIds = new Set(oldData.map(item => item.event_id));
    const newIds = new Set(newData.map(item => item.event_id));
    
    // נמחקו
    oldData.forEach(oldItem => {
        if (!newIds.has(oldItem.event_id)) {
            result.push({
                ...oldItem,
                status: 'נמחק'
            });
        }
    });
    
    // עודכנו או נותרו
    
    newData.forEach(newItem => {
        if (oldIds.has(newItem.event_id)) {
            const oldItem = oldData.find(item => item.event_id === newItem.event_id);
            const isChanged = oldItem.event_start !== newItem.event_start || oldItem.event_end !== newItem.event_end;
             if (isChanged) {
                // הרשומה החדשה - עודכן
                result.push({
                    ...newItem,
                    event_id: shortId(), // שמירת אותו מזהה
                    active: 1
                });
            } else {
                // לא השתנה
                result.push({
                    ...newItem,
                    active: 2
                });
            }
        } else {
            // נוסף
            result.push({
                ...newItem,
                event_id: shortId(), // מזהה חדש
                active: 1
            });
        }
    });
    
    return result;
}

function useTemplateDefinition({ template }) {

  const queryClient = useQueryClient();

  const updateTemplate = useMutation(templatesUpdate({ queryClient }))

  const onSubmit = useCallback(async (data) => {
    try {
      console.log('template data: ', data)

      const templateData = templateDataServerFromat(data)

      const compareData = compareVersions(template?.events || [], data.events || [])
      const withTemplateId = compareData.map(item => ({
        ...item,
        template_id: template?.template_id || item.template_id || uuidv4(),
        template_name: data.template_name
      }))

      
      const promiseTemplate = updateTemplate.mutateAsync({ data: withTemplateId, mode:  "update" })

      toast.promise(promiseTemplate, {
        loading: 'שומר תבנית...',
        success: 'תבנית נשמרה בהצלחה',
        error: 'שגיאה בשמירת התבנית'
      });
      
    } catch (error) {
      console.error('Error saving template:', error);
    }
  }, [updateTemplate]);

  return {
    onSubmit
  }
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
export function TemplateDefinitionStep({ onComplete, template }) {
  console.log('TEMPLATES: ', template)

  const initialValues = {

    template_id: template?.template_id || '',
    template_name: template?.template_name || '',
    events: template?.events?.filter(e => Number(e.active)) || [],
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

  const { onSubmit } = useTemplateDefinition({ template });

  return (
    <StepsProvider
      steps={steps}
      defaultValues={initialValues}
      WizardSchema={WizardSchema}
      onSubmit={onSubmit}
    />
  );
}





// דיאלוג להצגת אשף הגדרת תבנית
export function TemplateDialog({ open, onClose, onComplete, column }) {
  const handleWizardComplete = (data) => {
    if (onComplete) {
      onComplete(data); // קריאה ל-callback שהועבר מהקומפוננטה המשתמשת
    }
    onClose(); // סגירת הדיאלוג לאחר השלמת האשף
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth="sm" maxWidth="sm">
      <TemplateDefinitionStep
        template={column} // העברת התבנית הנוכחית לאשף
        onComplete={handleWizardComplete} // מטפל בסיום האשף
      />
    </Dialog>
  );
}