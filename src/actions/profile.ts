import { queryOptions } from "@tanstack/react-query";

import { apiFetch } from "src/utils/manager-fetch";


export function apiProfile(student_id: string) {
  const postData = { table_name: 'profile', mode: 'select', data: student_id };
  return queryOptions({
    queryKey: ['profile', student_id],
    queryFn: async () => {
      const res =  await apiFetch('all', postData);
      console.log('res: ', res)
      return res?.data ?? null;
    }
  });
}