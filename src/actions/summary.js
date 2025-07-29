import { queryOptions } from '@tanstack/react-query';

import { apiFetch } from 'src/utils/manager-fetch';

export function apiSummary() {
  const postData = { table_name: 'summary', mode: 'select', data: [] };
  return queryOptions({
    queryKey: ['summary', 'all'],
    queryFn: async () => {
      const res = await apiFetch('summary', postData);
      return res?.data ?? null;
    },
  });
}