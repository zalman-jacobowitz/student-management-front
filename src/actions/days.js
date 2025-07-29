import {  queryOptions } from '@tanstack/react-query';

import { apiFetch } from 'src/utils/manager-fetch';



export function apiDays() {
  const postData = { table_name: 'days', mode: 'select', data: [] };
  return queryOptions({
    queryKey: ['days'],
    queryFn: async () => {
      const res =  await apiFetch('all', postData);
      console.log('apiDays', res);
      return res?.data ?? null;
    }
  });
}

export const daysUpdate = ({queryClient})=>({
  mutationKey: ['days'],
  mutationFn: async ({data, mode='update'}) => {
    const res = await apiFetch('all', {
      table_name: 'days',
      mode,
      data
      
    });
    return res?.data ?? null;
  },
  onSuccess: (data, _variables, _ctx) => {
    queryClient.invalidateQueries({ queryKey: ['days'] });
    queryClient.cancelQueries({ queryKey: ['days'] });
  },
})