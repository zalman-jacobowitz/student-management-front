import { queryOptions } from "@tanstack/react-query";

import { apiFetch } from "src/utils/manager-fetch";

export function apiSummary(formData) {
  const postData = { table_name: 'summary', mode: 'select', data: formData };
  return queryOptions({
    enabled: !formData.days,
    queryKey: ['summary', formData],
    queryFn: async () => {
      const res =  await apiFetch('all', postData);
      return res?.data ?? null;
    }
  });
}