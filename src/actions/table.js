import { isArray } from "lodash";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "src/utils/manager-fetch";



function editData(newData, table, mode = "update"){
  
  const newValue = []
  if (mode === 'delete'){
    if (table === 'users'){
      return newData.map(item => ({uuid: item.id, user_id: item.email}))
    }
    if (table === 'info_students'){
      return newData.map(item => ({student_id: item.student_id}))     
    }
    return isArray(newData)? newData: [newData]
  }
  if (table === 'info_students'){
    const students = isArray(newData)? newData: [newData]
    
    students.forEach(student => {
      
      Object.keys(student).forEach(one => {

        if (one !== 'student_id'){
          newValue.push({student_id: student.student_id, group_name: one, value: student[one] || ''})
      }
    })
    })
    return newValue
  }
  
  return isArray(newData)? newData: [newData]
}

async function updateData({ data, mode = "update" }, table){

  const res = apiFetch(`all`,
    {
      "data": editData(data, table, mode),
      "mode": mode,
      "table_name": table
    })
  
  return res
}

export function useGetTable(table, more = {}) {

    const queryClient = useQueryClient();
    const { data, error, isLoading } = useQuery({
      queryKey: [table, more],
      queryFn: async () => {
        const response = await apiFetch('all', {'table_name': table, "mode": "select", "data": more})
        if (response.data){
          return response.data
        }
        return 0;
      },
      keepPreviousData: true
    });

      
    const { mutate, mutateAsync: originalMutateAsync } = useMutation({
      mutationFn: (params) => updateData(params, table),
      
      onMutate: async (newData) => {
        await queryClient.cancelQueries([table]);
        const previousData = queryClient.getQueryData([table]);
        return { previousData };
      },

      onError: (err, ne, context) => {
        alert(err.message)
        queryClient.setQueryData([table], context.previousData);
      },
  
      onSuccess: () => {
        queryClient.invalidateQueries([table]);
      }
    });
    
    const mutateAsync = (newData, mode = "update") => originalMutateAsync({ data: newData, mode });
    
    return {data, error, isLoading, mutate, mutateAsync}
}