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

import { Suspense, useEffect, useState } from "react";

import { useGetTable } from "src/actions/table";

import { LoadingScreen } from "src/components/loading-screen";

import useInsertStore from "src/sections/insert/insert-state.ts";

import { ProfileViewScreen } from "../profile-screen";
import { apiInfoStudents } from "src/actions/info_students";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Alert, Box, Chip, Stack, Typography } from "@mui/material";



function StudentsSelectionStep({setStudentId}) {
  const studentsData = useSuspenseQuery(apiInfoStudents());
  
  const students = studentsData.data || [];
  const [selectedStudents, setSelectedStudents] = useState([]);

  return (
    <Stack spacing={3}>
      <Alert severity="info">
        <Typography variant="body2">
          בחר את התלמידים להם יחול האישור.
        </Typography>
      </Alert>
      
      <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
        <Stack spacing={2}>
          {students.map((student) => (
            <Chip
              key={student.student_id}
              label={`${student.שם} ${student.משפחה}`}
              onClick={() => setStudentId(student.student_id)}
              color={selectedStudents.includes(student.student_id) ? 'primary' : 'default'}
              variant={selectedStudents.includes(student.student_id) ? 'filled' : 'outlined'}
              sx={{ justifyContent: 'flex-start' }}
            />
          ))}
        </Stack>
      </Box>
    </Stack>
  );
}


export function ProfileViewWrapper({ student_id }) {
  const [studentId, setStudentId] = useState(student_id);

  if (studentId) {
    return <ProfileViewScreen studentId={studentId} />
  }
  return <StudentsSelectionStep setStudentId={setStudentId} />;

}
export function ProfileView({studentId}) {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <ProfileViewWrapper studentId={studentId} />
    </Suspense>
  );
}