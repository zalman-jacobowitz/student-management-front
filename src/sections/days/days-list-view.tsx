import { Suspense } from "react";
import { useSuspenseQueries } from "@tanstack/react-query";

import { paths } from "src/routes/paths";

import { apiDays } from "src/actions/days";
import { apiTemplates } from "src/actions/templates";

import { LoadingScreen } from "src/components/loading-screen";
import { TableConfig } from "src/components/full-table/types";
import { FullTableWrapper } from "src/components/full-table/view";
import { useWalktour, Walktour } from "src/components/walktour";

import { DayDialog } from "./days-edit-steps";
import { INFO_DAYS } from "./columns";



const LINKS = [
  { name: 'מסך-ראשי', href: paths.dashboard.root },
  { name: 'ימים', href: paths.dashboard.days },
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

function joinDaysWithTemplates(days, templates) {
  const templatesMap = templates.reduce((acc, template) => {
    acc[template.template_id] = template;
    return acc;
  }, {});

  return days.map(day => ({
    ...day,
    template_name: templatesMap[day.template_id]?.template_name || 'לא נמצא'
  }));
}

function DaysMainView() {
    const [daysQuery, templatesQuery] = useSuspenseQueries({
      queries: [
        apiDays(),
        apiTemplates()
      ]
    });
    
    const days = daysQuery.data;
    const templatesRaw = templatesQuery.data;
    const templates = eventsTemplatesByReduce(templatesRaw);
    const daysWithTemplates = joinDaysWithTemplates(days, templates);
    
    
    const tableColumnsConfig: TableConfig = {
    headingLinks: LINKS,
    headingTitle: 'הגדרת ימים',
    importButton: false,
    specialRow: ['checkbox', 'edit'],
    rowId: 'day',
    EditComponent: DayDialog,
    styleTable: 'default',
    pagination: true,
    addButton: true,
    tableData: daysWithTemplates,
    tableColumns: INFO_DAYS,
  }
  console.log('tableColumnsConfig', tableColumnsConfig);

  return (<FullTableWrapper config={tableColumnsConfig} /> )
}

const walktourSteps = [
  // TODO: Add walktour steps here
];

export function DaysViewWrapper() {
  const walktour = <Walktour {...useWalktour({steps: walktourSteps})} />
  return (
    <Suspense fallback={<LoadingScreen />}>
      <>
        <DaysMainView/>
        {walktour}
      </>
    </Suspense>
  );
}