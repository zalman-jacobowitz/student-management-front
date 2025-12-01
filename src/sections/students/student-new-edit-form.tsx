import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { LoadingButton } from "@mui/lab";
import { Box, Button, DialogActions, DialogContent } from "@mui/material";

import { InfoColumn, InfoStudent } from "src/serverTypes";
import { infoStudentsUpdate } from "src/actions/info_students";

import { Form } from "src/components/hook-form";
import { ConfirmDialog } from "src/components/custom-dialog";
import { FromElement } from "src/components/hook-form/dynamic-form/elements";
import { shortId } from "src/utils/uuidv4";




type StudentsNewEditFromProps = {
  columns: InfoColumn[]
}

export function StudentsNewEditFrom({ columns }: StudentsNewEditFromProps){

  const columnsWithoutDefaults = columns.filter(col => !['client', 'student_id'].includes(col.name));

  return (
    <Box
      rowGap={3}
      columnGap={2}
      display="grid"
      pt={2}
      gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
    >
      {columnsWithoutDefaults.map((col, index) =>
        <Box key={col.name || index} display="flex" flexDirection="column">
          <FromElement info={col} />
        </Box>
        )
      }
    </Box>
  )
}




type StudentsNewEditFormDialogContentProps = {
  columns: InfoColumn[],
  student: InfoStudent,
  onClose: () => void,
  existingStudents?: InfoStudent[]
}

function StudentsNewEditFormDialogContent({columns, student, onClose, existingStudents = [] }: StudentsNewEditFormDialogContentProps) {
  
  const queryClient = useQueryClient();

  const method = useForm({
    mode: 'all',
    defaultValues: student.student_id? student: columns.reduce((acc, col) => {
      acc[col.name] = '';
      return acc;
  }, {})})

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = method;
  

  const mutate = useMutation(infoStudentsUpdate({queryClient}))
  
  const onSubmit = handleSubmit(async (data) => {


    if (!student.student_id){
      data.student_id = shortId()
    }

    try {
      const promise = mutate.mutateAsync({data: [data], mode: 'update'})

      toast.promise(promise, {
        loading: 'מעדכן...',
        success: 'העדכון הצליח!',
        error: 'העידכון נכשל!',
      });

      await promise;

      onClose();

    } catch (error) {
      console.error('Submission error:', error);
      toast.error('שגיאה בשליחת הטופס');  
    }
  });

  
  return (
    <Form methods={method} onSubmit={onSubmit}>
    
      <DialogContent>
        <Box sx={{ overflow: 'auto' }}>
          <StudentsNewEditFrom columns={columns} />
        </Box>
      </DialogContent>

      <DialogActions>
        <LoadingButton 
          type="submit"
          variant="contained"
          loading={isSubmitting}
          className="student-form-submit"
        >
          עדכן
        </LoadingButton>
        
        <Button variant="outlined" color="inherit" onClick={onClose} className="student-form-cancel">
          ביטול
        </Button>
      </DialogActions>
    </Form>
  )
}

type StudentsNewEditFormDialogProps = {
  columns: InfoColumn[],
  student: InfoStudent,
  open: boolean,
  onClose: () => void,
  existingStudents?: InfoStudent[],
  isEditing: boolean,
  className?: string
}

export function StudentsNewEditFormDialog(
  {
    columns,
    student,
    open,
    onClose,
    existingStudents = [],
    isEditing,
    className
  }: StudentsNewEditFormDialogProps
) {

  const title = isEditing ? 'עריכת תלמיד' : 'הוספת תלמיד חדש';

  return (
    <ConfirmDialog
      mode="full"
      maxWidth="sm"
      open={open}
      title={title}
      className={className}
      content={
        <StudentsNewEditFormDialogContent 
          columns={columns} 
          student={student} 
          onClose={onClose}
          existingStudents={existingStudents}
        />
      }
      onClose={onClose}
      />
  )
}