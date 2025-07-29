import {  queryOptions } from '@tanstack/react-query';

import { apiFetch } from 'src/utils/manager-fetch';



export function apiSelectOptions() {
  const postData = { table_name: 'select_options', mode: 'select', data: [] };
  return queryOptions({
    queryKey: ['select_options'],
    queryFn: async () => {
      const res =  await apiFetch('all', postData);
      return res?.data ?? null;
    },
    suspense: true,
  });
}


export const selectOptionsUpdate = ({queryClient})=>({
  mutationKey: ['select_options'],
  mutationFn: async ({data, mode='update'}) => {
    const res = await apiFetch('all', {
      table_name: 'select_options',
      mode,
      data
      
    });
    return res?.data ?? null;
  },
  onSuccess: (data, _variables, _ctx) => {
    queryClient.invalidateQueries({ queryKey: ['select_options'] });
    queryClient.cancelQueries({ queryKey: ['select_options'] });
  },
})