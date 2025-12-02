import { Suspense, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { Alert, Box, Chip, Stack, Typography, Avatar, Autocomplete, TextField } from "@mui/material";

import { useGetTable } from "src/actions/table";
// eslint-disable-next-line import/extensions
import { apiInfoStudents } from "src/actions/info_students";

import { LoadingScreen } from "src/components/loading-screen";

import useInsertStore from "src/sections/insert/insert-state.ts";

import { ProfileViewScreen } from "../profile-screen";
import { SelectStudents } from "src/sections/insert/delays/select-students";

import { apiInfoColumns } from 'src/actions/info_columns.js';
import { description } from "src/sections/insert/functions";
import { DashboardContent } from "src/layouts/dashboard";

function StudentsSelectionStep({setStudentId}) {
  return (
    <Stack spacing={3}>
      <SelectStudentsSimple onStudentSelect={setStudentId} />
    </Stack>
  );
}

export function SelectStudentsSimple({ onStudentSelect }) {
  const infoStudents = useSuspenseQuery(apiInfoStudents());
  const infoColumns = useSuspenseQuery(apiInfoColumns());
  const [selectedStudent, setSelectedStudent] = useState(null);

  const studentLabel = (student) => {
    const infoStudent = infoStudents.data.find(s => s.student_id === student);
    return description(infoColumns.data, infoStudent).primary;
  };

  const handleChange = (event, newValue) => {
    setSelectedStudent(newValue);
    if (onStudentSelect) {
      onStudentSelect(newValue);
    }
  };

  return (
    <DashboardContent title="בחר תלמיד לצפייה בפרופיל" >
    <Autocomplete
      value={selectedStudent}
      onChange={handleChange}
      options={infoStudents.data.map(student => student.student_id)}
      getOptionLabel={(option) => studentLabel(option)}
      isOptionEqualToValue={(option, value) => option === value}
      renderOption={(props, student_id) => (
        <li {...props} key={student_id}>
          <Avatar
            alt={student_id}
            src={student_id}
            sx={{ mr: 1, width: 24, height: 24, flexShrink: 0 }}
          />
          {studentLabel(student_id)}
        </li>
      )}
      renderInput={(params) => (
        <TextField {...params} placeholder="בחר תלמיד" />
      )}
      sx={{ width: '100%' }}
    />
    </DashboardContent>
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