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
    console.log('infoStudentsUpdate', data, mode);
    const res = await apiFetch('all', {
      table_name: 'info_students',
      mode,
      data,
      });
      return res?.data ?? null;
    
  },
  onSuccess: () => {
    queryClient.cancelQueries({ queryKey: ['info_students'] });
  },
})


