import { queryOptions } from "@tanstack/react-query";

import { apiFetch } from "src/utils/manager-fetch";

export function apiChart(config) {
  const postData = { table_name: 'chart', mode: 'select', data: { config } };
  return queryOptions({
    enabled: !!config.data,
    queryKey: ['chart', config],
    queryFn: async () => {
      const res =  await apiFetch('all', postData);
      console.log('res: ', res)
      return res?.data ?? null;
    }
  });
}