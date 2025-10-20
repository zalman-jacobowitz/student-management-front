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

function HebrewCallView({date}) {
  const format = date.slice(0, 10)
  return <span>{inHebrew(format, 'Dms')}</span>
}

export function ExceptionsCall({ row, column, children }) {

  switch (column) {
    case 'students':
      return <MultiPeople students={row.students} />
    case 'start':
      return <HebrewCallView date={row[column]} />
    case 'end':
      return <HebrewCallView date={row[column]} />
    default:
      return <>{children}</>
  }
}