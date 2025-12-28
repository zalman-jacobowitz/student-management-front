import { Suspense, useCallback, useState } from "react";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import { Box, Button,  Card,  CardActions, CardContent, CardHeader, Grid, ListItemText, Typography } from "@mui/material";

import { paths } from "src/routes/paths";

import { apiTemplates, templatesUpdate } from "src/actions/templates";

import { LoadingScreen } from "src/components/loading-screen";
import { TableConfig } from "src/components/full-table/types";
import { FullTableWrapper } from "src/components/full-table/view";
import { useWalktour, Walktour } from "src/components/walktour";

import { INFO_TEMPLATES } from "./columns";
import { TemplateDialog } from "./templates-edit-steps";
import { useBoolean } from "src/hooks/use-boolean";
import { ButtonGreen } from "src/components/button-green";
import { uuidv4 } from "src/utils/uuidv4";
import { toast } from "sonner";
import { apiDays } from "src/actions/days";



const LINKS = [
  { name: 'מסך-ראשי', href: paths.dashboard.root },
  { name: 'תבניות', href: paths.dashboard.templates },
  { name: 'רשימה' },
]

function eventsTemplatesByReduce(templates) {
  return Object.values(
    templates.reduce((acc, cur) => {
      const { template_id, template_name, client, ...event } = cur;
      if (!acc[template_id]) {
        acc[template_id] = { template_id, template_name, client, events: [] };
      }
      acc[template_id].events.push(event);
      acc[template_id].events.sort((a, b) => a.event_start.localeCompare(b.event_start));
      return acc;
    }, {})
  );
}

function TemplateView({ row, onEdit, onSubmit }) {
  const { template_id, template_name, client, events } = row;
  const dialog = useBoolean();
  
  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader title={template_name} />
      <CardContent>
      {events.map((event, index) => (
        <ListItemText
          key={index}
          primary={event.event_name}
          secondary={`${event.event_start} - ${event.event_end}`}
        />
      ))}
      </CardContent>
      <CardActions>
      
        <Button variant="outlined" sx={{ }} onClick={(data)=>onSubmit(template_id, 'delete')}>מחק</Button>
        <Button variant="outlined" onClick={onEdit}>ערוך</Button>
      
      </CardActions>
    </Card>
  );
}

// note: צריך לקבל גם את טבלת הסדרים כדי לדעת אם יש מספר גבוה שנמחק
function getNewShortId(templates) {
  // קבלת כל ה-IDs הקיימים של התבניות ובדיקה מי הגבוהה ביותר והוספת 1
  const existingIds = templates.map(t => parseInt(t.event_id, 10))

  const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
  return maxId
}

function templateDataServerFromat(templates, data, templateId=null) {
  const template_id = templateId || uuidv4()
  const { events, template_name } = data

  const listEvents = []
  data.events.map((event, index) => listEvents.push({
    template_id,
    template_name,
    event_name: event.event_name,
    event_id: event.event_id || getNewShortId(templates) + index + 1,
    event_start: event.event_start,
    event_end: event.event_end
  }))

  return listEvents
}

function useTemplateDefinition({ template, dialog, template_id_default, templates }) {

  const queryClient = useQueryClient();

  // הגדרת המוטציה לעדכון התבנית
  const updateTemplate = useMutation(templatesUpdate({ queryClient }))
  

  const onSubmit = useCallback(async (data, mode="update") => {
    try {
      if (template_id_default === data && mode === "delete") {
        toast.error('לא ניתן למחוק את התבנית המוגדרת כברירת מחדל');
        return
      }
      
      const templateData = mode === "update" ? templateDataServerFromat(templates, data, template?.template_id) : templates

      const promiseTemplate = updateTemplate.mutateAsync({ data: templateData, mode:  mode })

      toast.promise(promiseTemplate, {
        loading: 'שומר תבנית...',
        success: 'תבנית נשמרה בהצלחה',
        error: 'שגיאה בשמירת התבנית'
      });
      dialog.onFalse();
    } catch (error) {
      console.error('Error saving template:', error);
    }
  }, [updateTemplate]);

  return {
    onSubmit
  }
}

function TemplatesMainView() {
    // קריאה לרשימת התבניות הרלוונטיות
    const templates = useSuspenseQuery(apiTemplates());
    const days = useSuspenseQuery(apiDays()).data;
    const template_id_default = days?.find(d => d.day === 'default')?.template_id || null;
    
    // קיבוץ הסדרים תחת התבניות שלהם
    const events = eventsTemplatesByReduce(templates.data);
    console.log('events:', events);

    // טופס הוספה ועריכה של תבנית
    const dialog = useBoolean();
    
    // בחירה בשורה מסויימת לעריכה
    const [selectedRow, setSelectedRow] = useState(null);
    const { onSubmit } = useTemplateDefinition({
        template: selectedRow,
        dialog ,
        template_id_default,
        templates: templates.data
      });

    return (
  
      <Box sx={{ p: 3 }}>
      <Grid container spacing={2} sx={{ p: 3 }}>
        {events.map((template) => (
          <Grid item xs={12} sm={6} md={4} key={template.template_id}>
            <TemplateView onSubmit={onSubmit} row={template} onEdit={() => { setSelectedRow(template); dialog.onTrue(); }} />
          </Grid>
        ))}
      </Grid>
      <TemplateDialog
          onSubmit={onSubmit}
          onComplete={dialog.onFalse}
          column={selectedRow}
          open={dialog.value}
          onClose={dialog.onFalse}
      />
      <ButtonGreen
        data-testid="btn-green"
        onClick={
        () => {
          setSelectedRow(null);
          dialog.onTrue();
        }
      } />
    </Box>
  );
}

const walktourSteps = [
  // TODO: Add walktour steps here
];

export function TemplatesViewWrapper() {
  const walktour = <Walktour {...useWalktour({steps: walktourSteps})} />
  return (
    <Suspense fallback={<LoadingScreen />}>
      <>
        <TemplatesMainView/>
        {walktour}
      </>
    </Suspense>
  );
}