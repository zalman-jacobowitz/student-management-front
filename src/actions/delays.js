import { apiFetch } from "src/utils/manager-fetch";

export const delaysUpdate = ({queryClient, eventDetails})=>({
  mutationKey: ['delays', eventDetails],
  mutationFn: async ({data, mode='update'}) => {
    const res = await apiFetch('all', {
      table_name: 'delays',
      mode,
      data
      
    });
    return res?.data ?? null;
  },
  onSuccess: (data, _variables, _ctx) => {
    queryClient.invalidateQueries({ queryKey: ['delays'] });
    queryClient.cancelQueries({ queryKey: ['delays'] });
  },
})