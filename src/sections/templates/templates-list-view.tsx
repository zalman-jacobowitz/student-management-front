import { Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { paths } from "src/routes/paths";

import { apiTemplates } from "src/actions/templates";

import { LoadingScreen } from "src/components/loading-screen";
import { TableConfig } from "src/components/full-table/types";
import { FullTableWrapper } from "src/components/full-table/view";

import { TemplateDialog } from "./templates-edit-steps";
import { INFO_TEMPLATES } from "./columns";



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
      return acc;
    }, {})
  );
}

function TemplatesMainView() {
    const templates = useSuspenseQuery(apiTemplates());
    const events = eventsTemplatesByReduce(templates.data);
    console.log('events', events);
    const tableColumnsConfig: TableConfig = {
    headingLinks: LINKS,
    headingTitle: 'הגדרת תבניות',
    importButton: false,
    specialRow: ['checkbox', 'edit'],
    rowId: 'template_id',
    EditComponent: TemplateDialog,
    styleTable: 'default',
    pagination: true,
    addButton: true,
    tableData: events,
    tableColumns: INFO_TEMPLATES,
  }
  console.log('tableColumnsConfig', tableColumnsConfig);

  return (<FullTableWrapper config={tableColumnsConfig} /> )
}


export function TemplatesViewWrapper() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <TemplatesMainView/>
    </Suspense>
  );
}