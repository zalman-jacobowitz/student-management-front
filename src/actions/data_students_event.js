import { queryOptions } from '@tanstack/react-query';

import { apiFetch } from "src/utils/manager-fetch";

export function apiDataStudentsEvent(tamplateData, cache={}) {
    const postData = { table_name: 'data_students', mode: 'select', data: tamplateData };
    return queryOptions({
      enabled: !!tamplateData.length,
      queryKey: ['data_students', tamplateData],
      queryFn: async () => {
        const res =  await apiFetch('all', postData);
        console.log('res: ', res)
        const data = res?.data?.map(e=> ({...e, data: Number(e.data)})) ?? null;
        return data;
      }
    });
  }

  export const dataStudentsEventUpdate = ({queryClient})=>({
    mutationKey: ['data_students'],
  
    // Same signature as above
    mutationFn: async ({data, mode='update'}) => {
      const res = await apiFetch('all', {
        table_name: 'data_students',
        mode,
        data
        
      });
      return res?.data ?? null;
    },
  
    // Have access to queryClient via 4th arg
    onSuccess: (data, _variables, _ctx) => {
      queryClient.invalidateQueries({ queryKey: ['data_students'] });
      queryClient.cancelQueries({ queryKey: ['list_of_events'] });
    },
  })