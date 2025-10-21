import { queryOptions } from '@tanstack/react-query';
import useInsertStore from 'src/sections/insert/insert-state';

import { apiFetch } from "src/utils/manager-fetch";

export function apiDataStudentsEvent(tamplateData, above={}) {
  console.log('tamplateData: ', tamplateData)
    const cache =  useInsertStore.getState().selectedEvent;
    
    console.log({cache})
    const postData = { table_name: 'data_students', mode: 'select', data: cache };
    return queryOptions({
      enabled: !!tamplateData.length,
      queryKey: ['data_students', {day: cache.day, event: cache.event}],
      queryFn: async () => {
        const res =  await apiFetch('all', postData);
        console.log('res: ', res)
        const data = res?.data?.map(e=> ({...e, data: Number(e.data)})) ?? null;
        return data;
      }
    });
  }

  export const dataStudentsEventUpdate = ({queryClient, tamplateData})=>{
    const cache = useInsertStore.getState().selectedEvent;
    console.log({cache})
    return ({
    mutationKey: ['data_students', {day: cache.day, event: cache.event}],

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
    onSuccess: async () => {
    // מסמן את הקוורי כלא-עדכניs
    await queryClient.invalidateQueries({ queryKey: ['data_students', {day: cache.day, event: cache.event}] });
    // ואם אתה רוצה לראות מיד את הדאטה החדש בלי לחכות לפוקוס/רימאונט:
    await queryClient.refetchQueries({ queryKey: ['data_students', {day: cache.day, event: cache.event}] });
  },
  })
}