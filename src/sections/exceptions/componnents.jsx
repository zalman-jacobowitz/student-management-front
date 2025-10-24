import { apiInfoStudents } from "src/actions/info_students";
import { descriptionColumns, getDesc } from "../insert/functions";
import { apiInfoColumns } from "src/actions/info_columns";
import { Avatar, Box, Chip } from "@mui/material";
import { Iconify } from "src/components/iconify";
import { inHebrew } from "src/utils/hebrew/getter";
import { toast } from "sonner";


function MultiPeople({students}) {

  const studentView = students.map(student =>
    <Chip
      variant="soft"
      size="small"
      avatar={<Avatar />}
      color="success"
      label={student.primary}
    />
  )

  return <Box padding={.1} >{studentView}</Box>
}

function HebrewCallView({date, hour}) {
  
  return <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
    <Box sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{inHebrew(date, 'Dms')}</Box>
    <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{hour}</Box>
  </Box>
}

export function ExceptionsCall({ row, column, children }) {
  console.log('ExceptionsCall row, column, children: ', {row, column, children})
  switch (column) {
    case 'students':
      return <MultiPeople students={row.students} />
    case 'start':
      return <HebrewCallView date={row['from_day']} hour={row['from_hour']} />
    case 'end':
      return <HebrewCallView date={row['to_day']} hour={row['to_hour']} />
    default:
      return <>{children}</>
  }
}