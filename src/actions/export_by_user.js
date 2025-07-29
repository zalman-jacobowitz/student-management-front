import {
    queryOptions,
  } from '@tanstack/react-query';
  
  import { apiFetch } from 'src/utils/manager-fetch';
  
  export function apiExportByUser({columns, enabled}) {

    const postData = { table_name: 'export_by_user', mode: 'select', data: {columns} };
    return queryOptions({
      enabled,
      queryKey: ['export_by_user', columns],
      queryFn: async () => {
        const res =  await apiFetch('all', postData);

        return res?.data ?? null;
      },
      suspense: true,
      
    });
  }

