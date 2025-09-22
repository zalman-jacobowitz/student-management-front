import { queryOptions } from '@tanstack/react-query';

import { apiFetch } from 'src/utils/manager-fetch';

export function apiExceptions({range=null, ids=[]}) {
  const postData = { table_name: 'exceptions', mode: 'select', data: {range, ids} };
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