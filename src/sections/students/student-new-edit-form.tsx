import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { LoadingButton } from "@mui/lab";
import { Box, Button, DialogActions, DialogContent } from "@mui/material";

import { infoStudentsUpdate } from "src/actions/info_students";

import { Form } from "src/components/hook-form";
import { ConfirmDialog } from "src/components/custom-dialog";

import { FromElement } from "src/components/hook-form/dynamic-form/elements";

function coustomizeDisable(columns) {
  return columns.map(col => {
    if (col.name === 'student_id' || col.name === 'user_id' || col.name === 'client') {
      return { ...col, disabled: true };
    }
    return col;
  });
}

export function StudentsNewEditFrom({getColumns}){
  const columns = coustomizeDisable(getColumns || []);

  console.log('columns: ', columns)
  return (
    <Box
      rowGap={3}
      columnGap={2}
      display="grid"
      pt={2}
      gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
    >
      {columns.map((col, index) =>
        <Box key={col.name || index} display="flex" flexDirection="column">
          <FromElement info={col} />
        </Box>)
      }
    </Box>
  )
}

function StudentsNewEditFormDialogContent({getColumns, student, onClose, existingStudents = [] }) {
  const queryClient = useQueryClient();

  const method = useForm({
    mode: 'all',
    defaultValues: student,
  });
  
  const {
    handleSubmit,
    formState: { isSubmitting },
    setError
  } = method;
  

  const mutate = useMutation(infoStudentsUpdate({queryClient}))
  
  const onSubmit = handleSubmit(async (data) => {
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
        {/* הצגת שגיאות רק בעת שליחה */}

        <Box sx={{ overflow: 'auto' }}>
          <StudentsNewEditFrom getColumns={getColumns} />
        </Box>

      </DialogContent>
      <DialogActions>
        <LoadingButton 
          type="submit" 
          variant="contained" 
          loading={isSubmitting}
        >
          עדכן
        </LoadingButton>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          ביטול
        </Button>
      </DialogActions>
      </Form>
  )
}


export function StudentsNewEditFormDialog({getColumns, student, open, onClose, existingStudents = [], isEditing }) {
  const title = isEditing ? 'עריכת תלמיד' : 'הוספת תלמיד חדש';

  return (
    <ConfirmDialog
      mode="full"
      maxWidth="sm"
      open={open}
      title={title}
      content={
        <StudentsNewEditFormDialogContent 
          getColumns={getColumns} 
          student={student} 
          onClose={onClose}
          existingStudents={existingStudents}
        />
      }
      onClose={onClose}
      />
  )
}