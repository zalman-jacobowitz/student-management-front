import { Suspense, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { Box, Button,  Card,  CardActions, CardContent, CardHeader, Grid, ListItemText, Typography } from "@mui/material";

import { paths } from "src/routes/paths";

import { apiTemplates } from "src/actions/templates";

import { LoadingScreen } from "src/components/loading-screen";
import { TableConfig } from "src/components/full-table/types";
import { FullTableWrapper } from "src/components/full-table/view";

import { INFO_TEMPLATES } from "./columns";
import { TemplateDialog } from "./templates-edit-steps";
import { useBoolean } from "src/hooks/use-boolean";
import { ButtonGreen } from "src/components/button-green";



const LINKS = [
  { name: 'מסך-ראשי', href: paths.dashboard.root },
  { name: 'תבניות', href: paths.dashboard.templates },
  { name: 'רשימה' },
]

function eventsTemplatesByReduce(templates) {
  console.log('templates::', templates);
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

function TemplateView({ row, onEdit }) {
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
      
        <Button variant="outlined" sx={{ }} onClick={dialog.onTrue}>מחק</Button>
        <Button variant="outlined" onClick={onEdit}>ערוך</Button>
      
      </CardActions>
    </Card>
  );
}


function TemplatesMainView() {
    // קריאה לרשימת התבניות הרלוונטיות
    const templates = useSuspenseQuery(apiTemplates());
    // 
    const events = eventsTemplatesByReduce(templates.data);

    const dialog = useBoolean();
    const [selectedRow, setSelectedRow] = useState(null);

    return (
  
      <Box sx={{ p: 3 }}>
      <Grid container spacing={2} sx={{ p: 3 }}>
        {events.map((template) => (
          <Grid item xs={12} sm={6} md={4} key={template.template_id}>
            <TemplateView row={template} onEdit={() => { setSelectedRow(template); dialog.onTrue(); }} />
          </Grid>
        ))}
      </Grid>
      <TemplateDialog
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


export function TemplatesViewWrapper() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <TemplatesMainView/>
    </Suspense>
  );
}