import {  queryOptions } from '@tanstack/react-query';

import { apiFetch } from 'src/utils/manager-fetch';



export function apiTemplates() {
  const postData = { table_name: 'templates', mode: 'select', data: [] };
  return queryOptions({
    queryKey: ['templates'],
    queryFn: async () => {
      const res =  await apiFetch('all', postData);
      console.log('apiTemplates', res);
      return res?.data ?? null;
    }
  });
}

export const templatesUpdate = ({queryClient})=>({
  mutationKey: ['templates'],
  mutationFn: async ({data, mode='update'}) => {
    const res = await apiFetch('all', {
      table_name: 'templates',
      mode,
      data
      
    });
    return res?.data ?? null;
  },
  onSuccess: (data, _variables, _ctx) => {
    queryClient.invalidateQueries({ queryKey: ['templates'] });
    queryClient.cancelQueries({ queryKey: ['templates'] });
  },
})