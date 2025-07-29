import { Avatar, Chip } from '@mui/material';

import { Field } from 'src/components/hook-form';

import { description } from '../functions';

export function SelectStudents({ infoStudents, infoColumns, ...other }) {
  const studentLabel = (student) => description(infoColumns, student).primary;

  return (
    <Field.Autocomplete
      multiple
      name="students"
      placeholder="הוסף תלמידים"
      disableCloseOnSelect
      options={infoStudents}
      getOptionLabel={(option) => studentLabel(option)}
      isOptionEqualToValue={(option, value) => option.student_id === value.student_id}
      renderOption={(props, student) => (
        <li {...props} key={student.student_id}>
          <Avatar
            key={student.student_id}
            alt={student.avatarUrl}
            src={student.avatarUrl}
            sx={{ mr: 1, width: 24, height: 24, flexShrink: 0 }}
          />
          {studentLabel(student)}
        </li>
      )}
      renderTags={(selected, getTagProps) =>
        selected.map((student, index) => (
          <Chip
            {...getTagProps({ index })}
            key={student.student_id}
            size="small"
            variant="soft"
            label={studentLabel(student)}
            avatar={<Avatar alt={student.name} src={student.avatarUrl} />}
          />
        ))
      }
      {...other}
    />
  );
}