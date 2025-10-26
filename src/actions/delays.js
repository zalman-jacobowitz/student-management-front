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
    // מסמן את הקוורי כלא-עדכני
    queryClient.invalidateQueries({ queryKey: ['delays', eventDetails] });
    queryClient.cancelQueries({ queryKey: ['delays', eventDetails] });
    queryClient.refetchQueries({ queryKey: ['delays', eventDetails] }
      
    );
    // ואם אתה רוצה לראות מיד את הדאטה החדש בלי לחכות לפוקוס/רימאונט:
    queryClient.invalidateQueries({ queryKey: ['data_students', eventDetails] });
    queryClient.cancelQueries({ queryKey: ['data_students', eventDetails] });
    queryClient.refetchQueries({ queryKey: ['data_students', eventDetails] });
  },
})