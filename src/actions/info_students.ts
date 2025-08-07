import {
  MutationOptions,
  QueryClient,
  queryOptions,
  QueryOptions,
} from '@tanstack/react-query';

import { apiFetch } from 'src/utils/manager-fetch';


export function apiInfoStudents() {
  const postData = { table_name: 'info_students', mode: 'select', data: [] };
  return queryOptions({
    queryKey: ['info_students'],
    queryFn: async () => {
      const res =  await apiFetch('all', postData);
      console.log('apiInfoStudents', res);
      return res?.data ?? null;
    },
  });
}

type InfoStudentsUpdateProps = {
  queryClient: QueryClient;
}

type MutationFnProps = {
  data: {
    student_id: string;
    [key: string]: string;
  }[];
  mode: 'update' | 'delete';
}

export const infoStudentsUpdate = ({queryClient}: InfoStudentsUpdateProps) => ({
  mutationKey: ['info_students'],
  mutationFn: async ({ data, mode='update'}) => {
    const newData = mode === 'delete' ? data : [] 
    if (mode === 'update') {
      data.forEach(item => {
        const {student_id} = item
        Object.keys(item).forEach(key => {
          if (key === 'student_id') return;
          newData.push({
            student_id,
            group_name: key,
            value: item[key]
          })
        })
      })
    }
    const res = await apiFetch('all', {
      table_name: 'info_students',
      mode,
      data: newData,
      });
      return res?.data ?? null;
    
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['info_students'] });
  },
})


