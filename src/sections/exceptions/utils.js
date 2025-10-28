import { apiInfoStudents } from "src/actions/info_students";
import { descriptionColumns, getDesc } from "../insert/functions";
import { apiInfoColumns } from "src/actions/info_columns";
import { Avatar, Box, Chip } from "@mui/material";
import { Iconify } from "src/components/iconify";
import { inHebrew } from "src/utils/hebrew/getter";
import { toast } from "sonner";

export function exceptionsByReduce(exception) {
  console.log('exceptionR: ', exception)

  return Object.values(
    exception.reduce((acc, cur) => {
      const { exception_id, from_day, from_hour, to_day, to_hour, reason, student_id } = cur;
      if (!acc[exception_id]) {
        acc[exception_id] = { exception_id, from_day, from_hour, to_day, to_hour, reason, students: [] };
      }
      acc[exception_id].students.push({ student_id, primary: cur.primary, secondary: cur.secondary });
      return acc;
    }, {})
  );
}

export function mergeWithStudents(infoStudents, summaryData, infoColumns) {
  // Implement your merging logic here
  const { primary, secondary } = descriptionColumns(infoColumns);
  const mergedData = summaryData.map(summary => {
    const student = infoStudents.find(item => item.student_id === summary.student_id);
    return {
      primary: getDesc(student, primary),
      secondary: getDesc(student, secondary),
      ...summary
    }
  });
  return mergedData
}