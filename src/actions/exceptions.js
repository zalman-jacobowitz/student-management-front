import { queryOptions } from '@tanstack/react-query';

import { apiFetch } from 'src/utils/manager-fetch';

const defaultRange = {
  start: '1990-01-01 00:00',
  end: '2050-01-01 23:59'
}

export function apiExceptions(range=defaultRange) {
  const postData = { table_name: 'exceptions', mode: 'select', data: {range} };
  return queryOptions({
    queryKey: ['exceptions', { range }],
    queryFn: async () => {
      const res = await apiFetch('all', postData);
      console.log('apiExceptions', res);
      return res?.data ?? null;
    }
  });
}

export const exceptionsUpdate = ({queryClient}) => ({
  mutationKey: ['exceptions'],
  mutationFn: async ({data, mode='update'}) => {
    const res = await apiFetch('all', {
      table_name: 'exceptions',
      mode,
      data
    });
    return res?.data ?? null;
  },
  onSuccess: (data, _variables, _ctx) => {

    queryClient.cancelQueries({ queryKey: ['exceptions'] });
    queryClient.invalidateQueries({ queryKey: ['exceptions'] });
    queryClient.cancelQueries({ queryKey: ['data_students'] });
    queryClient.invalidateQueries({ queryKey: ['data_students'] });
    
  },
})