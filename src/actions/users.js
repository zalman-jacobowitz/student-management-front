import {  queryOptions } from '@tanstack/react-query';

import { apiFetch } from 'src/utils/manager-fetch';




export function apiUsers() {
  const postData = { table_name: 'users', mode: 'select', data: [] };
  return queryOptions({
    queryKey: ['users', 1],
    queryFn: async () => {
      const res =  await apiFetch('all', postData);
      console.log('resUsers:', res)
      return res?.data ?? null;
    
    },
    suspense: true,
  });
}


export const usersUpdate = ({queryClient})=>({
  mutationKey: ['users'],
  mutationFn: async ({data, mode='update'}) => {
    const res = await apiFetch('all', {
      table_name: 'users',
      mode,
      data
      
    });
    return res?.data ?? null;
  },
  onSuccess: (data, _variables, _ctx) => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
    queryClient.cancelQueries({ queryKey: ['users'] });
  },
})

export const createInitialUser = async ({ userId, email, firstName, lastName, country }) => {

  alert(JSON.stringify(adminUserBlank))
  /*
   * const res = await apiFetch('all', {
   *   table_name: 'users',
   *   mode: 'insert',
   *   data: [userData]
   * });
   * 
   * return res?.data ??
   */
  return null;
};