import { QueryClient } from "@tanstack/react-query";

import { apiFetch } from "src/utils/manager-fetch";

type initUpdateProps = {
  queryClient: QueryClient;
}

export const initUpdate = ({queryClient}: initUpdateProps) => ({
  mutationKey: ['init'],
  mutationFn: async ({ data, mode='update'}) => {
    const res = await apiFetch('all', {
      table_name: 'init',
      mode,
      data,
      });
      return res?.data ?? null;
    
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['init'] });
  },
})


