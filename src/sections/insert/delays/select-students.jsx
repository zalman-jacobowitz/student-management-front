import { Avatar, Chip } from '@mui/material';

import { Field } from 'src/components/hook-form';

import { description } from '../functions.ts';
import { apiInfoStudents } from 'src/actions/info_students.ts';
import { useSuspenseQuery } from '@tanstack/react-query';
import { apiInfoColumns } from 'src/actions/info_columns.js';

export function SelectStudents({ ...other }) {
  const infoStudents = useSuspenseQuery(apiInfoStudents());
  const infoColumns = useSuspenseQuery(apiInfoColumns());

  
  const studentLabel = (student) => {
    const infoStudent = infoStudents.data.find(s => s.student_id === student);
    return description(infoColumns.data, infoStudent).primary;
  };

  return (
    <Field.Autocomplete
      multiple
      name="students"
      placeholder="הוסף תלמידים"
      disableCloseOnSelect
      options={infoStudents.data.map(student => student.student_id)}
      getOptionLabel={(option) => studentLabel(option)}
      isOptionEqualToValue={(option, value) => option === value}
      renderOption={(props, student_id) => (
        <li {...props} key={student_id}>
          <Avatar
            key={student_id}
            alt={student_id}
            src={student_id}
            sx={{ mr: 1, width: 24, height: 24, flexShrink: 0 }}
          />
          {studentLabel(student_id)}
        </li>
      )}
      renderTags={(selected, getTagProps) =>
        selected.map((student_id, index) => (
          <Chip
            {...getTagProps({ index })}
            key={student_id}
            size="small"
            variant="soft"
            label={studentLabel(student_id)}
            avatar={<Avatar alt={student_id} src={student_id} />}
          />
        ))
      }
      {...other}
    />
  );
}