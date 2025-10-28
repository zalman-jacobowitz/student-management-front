import { queryOptions } from "@tanstack/react-query";

import { apiFetch } from "src/utils/manager-fetch";

export function apiListEvents() {
    const postData = { table_name: 'list_of_events', mode: 'select', data: [] };
    return queryOptions({
      queryKey: ['list_of_events'],
      queryFn: async () => {
        const res =  await apiFetch('all', postData);
        return res?.data ?? null;
      }
    });
  }

