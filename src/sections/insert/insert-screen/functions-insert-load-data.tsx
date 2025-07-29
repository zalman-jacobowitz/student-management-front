import { useEffect } from "react";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import { apiDataStudentsEvent } from "src/actions/data_students_event";

import { formValues } from "../functions";
import useInsertStore from "../insert-state";
import { apiExceptions } from "src/actions/exceptions";

interface UseLoadCurrentDataProps {
  tamplateData?: any[];
  reset: (values: any) => void;
}

function toServer(data){
  return data.map((student)=>({
    student_id: student.student_id,
    event: student.event,
    day: student.day

  }))
}


export function useLoadCurrentData(reset: (values: any) => void, tamplateData: any[] = []) {
    
    const range = {start: '2025-07-18'}

    const setCurrentData = useInsertStore(state => state.setCurrentData);
    const queryClient = useQueryClient();
    const crnt = useSuspenseQuery(apiDataStudentsEvent(toServer(tamplateData), queryClient))
    const exc = useSuspenseQuery(apiExceptions(range))


    useEffect(() => {
      
      if (crnt.data && tamplateData.length) {

                  console.log(crnt.data)
        if (crnt.data.length) {

          const newData = tamplateData.map((item) => {
            const updatedItem = crnt.data.find((i: any) => i.student_id === item.student_id);
            const exceptionItem = exc.data.find((i: any) => i.student_id === item.student_id);
            console.log('exceptionItem', exceptionItem)
            return { ...item, ...updatedItem , ...exceptionItem};
            
          })
          console.table(newData)
          reset(formValues(newData));
          setCurrentData(newData);
          } else {
          reset(formValues(tamplateData));
          setCurrentData(tamplateData);
        }
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [crnt.data, setCurrentData]);
    
  
    return null
}
