import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "src/utils/manager-fetch";

import useEventStore from "./use-events";

async function updateManager(newData){
  
  const res = apiFetch('update_manager', {
    "event": "update_table", 
    "table": 'data_students', "data": newData})
  return res
}

function optimistic( oldData , newData , exept){
  const newd = oldData.map(
      student => {
      let newDS = null
      newData.forEach(new_stud => {
       if (student.student_id === new_stud.student_id){
         newDS = {...student, data: new_stud.data}
       }
      })
      return newDS || student
      }
    )
  
  return newd
}

export function useEventChange(){
    const { current } = useEventStore()
    const queryClient = useQueryClient();
    const thisEvent = { 'event': current.event, 'day': current.day }
    const { data, error, isLoading } = useQuery({
      queryKey: ['manager', thisEvent],
      queryFn: async () => {
        const response = await apiFetch('manager', thisEvent);

        return response.data;
      }
    
    });
    /*
    // Prefetch עבור חלקים 4 ו-6 ברקע
    useEffect(() => {
      const prefetchParts = [currentIndex + 1, currentIndex - 1];
      prefetchParts.forEach((partId) => {
        if (events.at(partId)) {
          // alert('have data')
          queryClient.prefetchQuery({
            queryKey: ['manager', partId],
            queryFn: async () => {
              const response = await apiFetch('manager',
                {
                  'event': events.at(partId).event,
                  'day': events.at(partId).day
                }
              )
  
              return response.data;
            },
            keepPreviousData: true
          })
        };
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentIndex, queryClient]);
    */
    const { mutate , mutateAsync} = useMutation({
      mutationFn: updateManager,
      
      onMutate: async (newData) => {
        // ביטול של שאילתות פעילות למניעת חפיפות
        await queryClient.cancelQueries(['manager', thisEvent]);
  
        // שמירת הנתונים הנוכחיים למקרה של שגיאה 
        const previousData = queryClient.getQueryData(['manager', thisEvent]);
  
        // עדכון אופטימי של הנתונים
        queryClient.setQueryData(['manager', thisEvent], (oldData) =>
           optimistic(oldData, newData, false)
        );
  
        // החזרת ערך לשימוש ב-onError
        return { previousData };
      },
      // אם הבקשה נכשלה, החזר את המצב לקדמותו
      onError: (err, ne, context) => {
        // alert(err.message)
        queryClient.setQueryData(['manager', thisEvent], context.previousData);
      },
  
      // לאחר הצלחה, רענן את הנתונים
      onSuccess: () => {
        queryClient.invalidateQueries(['manager', thisEvent]);
        // queryClient.invalidateQueries(['sometimes']);
       
      }
    })
    return {data,  error, isLoading, mutate, mutateAsync}
}