import {
  queryOptions,
} from '@tanstack/react-query';

import { apiFetch } from 'src/utils/manager-fetch';


export function apiInfoColumns() {
  const postData = { table_name: 'info_columns', mode: 'select', data: [] };
  return queryOptions({
    queryKey: ['info_columns'],
    queryFn: async () => {
      const res = await apiFetch('all', postData);
      return res?.data ?? null;
    },
    suspense: true,
  });
}


export const infoColumnsUpdate = ({queryClient})=>({
  mutationKey: ['info_columns'],
  mutationFn: async ({data, mode='update'}) => {
    const res = await apiFetch('all', {
      table_name: 'info_columns',
      mode,
      data
      
    });
    return res?.data ?? null;
  },
  onSuccess: (data, _variables, _ctx) => {
    queryClient.invalidateQueries({ queryKey: ['info_columns'] });
    queryClient.cancelQueries({ queryKey: ['info_columns'] });
  },
})