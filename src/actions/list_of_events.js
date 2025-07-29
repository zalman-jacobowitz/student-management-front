import { queryOptions } from "@tanstack/react-query";

import { apiFetch } from "src/utils/manager-fetch";

export function apiListEvents(students_ids) {
    const postData = { table_name: 'list_of_events', mode: 'select', data: students_ids };
    return queryOptions({
      queryKey: ['list_of_events'],
      queryFn: async () => {
        const res =  await apiFetch('all', postData);
        return res?.data ?? null;
      }
    });
  }

