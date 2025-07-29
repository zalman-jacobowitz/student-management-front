/*-
import { useGetTable } from 'src/actions/table';

import { EmptyContent } from 'src/components/empty-content';


import { ProfileViewScreen } from '../profile-screen';
import { SkeletonProfile } from '../profile-loadding';



// ----------------------------------------------------------------------

export function ProfileView({ student_id }) {

    const table = useGetTable('info_students');
    const data = useGetTable('data_students', [{'student_id': student_id}]);

    
    if (data.error || table.error) {
        return <>ישנה בעיה</>
    }

    if (data.isLoading || table.isLoading) {
        return <SkeletonProfile />
    }
    
    if (!student_id) {
        return <EmptyContent
            title='אין נתונים על תלמיד זה'
            description='אין עדיין נתונים להציג במסך זה. כדי להתחיל פתח את מסך הרישום.'
        />
    }
    const studentInfo = table.data.find(e=>e.student_id === student_id)

    return <ProfileViewScreen
                studentData={data.data}
                studentInfo={studentInfo}
                studentsInfo={table.data}
                mutateAsync={data.mutateAsync}
            />
}

-*/

import { useEffect } from "react";

import { useGetTable } from "src/actions/table";

import { LoadingScreen } from "src/components/loading-screen";

import useInsertStore from "src/sections/insert/insert-state.ts";

import { ProfileViewScreen } from "../profile-screen";



export function useApiProfileDetails(student_id) {
    const table = useGetTable("data_students", [{ student_id }]);
    return table.data
}

export function ProfileView({ student_id }) {

  const { saveApiDataById, saveInfoById, studentInfo } = useInsertStore()
  
  const apiDataExists = useApiProfileDetails(student_id);

  useEffect(() => {
    if (apiDataExists ) {
      saveApiDataById(apiDataExists);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveApiDataById]);


  if (apiDataExists) {
    if (!studentInfo.student_id){
      saveInfoById(student_id);
    }
    return <ProfileViewScreen />
  }

  return <LoadingScreen message="טוען נתונים" />;
}