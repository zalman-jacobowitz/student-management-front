import { queryOptions } from "@tanstack/react-query";

import { apiFetch } from "src/utils/manager-fetch";

export function apiEventsToday(day) {
  
  const postData = { table_name: 'events_today', mode: 'select', data: { day } };
  return queryOptions({
    queryKey: ['events_today', day],
    queryFn: async () => {
      const res =  await apiFetch('all', postData);
      console.log('res: ', res)
      return res?.data ?? null;
    }
  });
}