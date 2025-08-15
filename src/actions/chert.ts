import { QueryClient } from "@tanstack/react-query";

import { apiFetch } from "src/utils/manager-fetch";

type summaryUpdateProps = {
  queryClient: QueryClient;
}

export const summaryUpdate = ({queryClient}: summaryUpdateProps) => ({
  mutationKey: ['summary'],
  mutationFn: async ({ data, mode='update'}) => {
    const res = await apiFetch('all', {
      table_name: 'summary',
      mode,
      data,
      });
      return res?.data ?? null;
    
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['summary'] });
  },
})


