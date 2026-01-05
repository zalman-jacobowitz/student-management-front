import {
  MutationOptions,
  QueryClient,
  queryOptions,
  QueryOptions,
} from '@tanstack/react-query';

import { apiFetch } from 'src/utils/manager-fetch';


export function apiInfoStudents() {
  return queryOptions({
    queryKey: ['info_students'],
    queryFn: async () => {
      const res =  await apiFetch('info_students', {mode: 'select'});
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
    const res = await apiFetch('info_students', {
      mode,
      data,
      });
      return res?.data ?? null;
    
  },
    onSuccess: async () => {
    // מסמן את הקוורי כלא-עדכני
    await queryClient.invalidateQueries({ queryKey: ['info_students'] });
    // ואם אתה רוצה לראות מיד את הדאטה החדש בלי לחכות לפוקוס/רימאונט:
    await queryClient.refetchQueries({ queryKey: ['info_students'] });
  },
})


