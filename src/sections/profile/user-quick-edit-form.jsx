/*-
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useMemo, useCallback } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FormProvider } from 'react-hook-form';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { apiFetch } from 'src/utils/manager-fetch';
import { useInfoColumn } from 'src/utils/functions-times';

import { RHFSelect, RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------


export function FiledElement({ info }) {
  switch (info.type) {
    case 'select':
      return (<RHFSelect
        name={info.id}
        label={info.label}
      >
        {info.options.map((size) => (
          <MenuItem key={size} value={size}>
            {size}
          </MenuItem>
        ))}
      </RHFSelect>)
    default:
      return (<RHFTextField name={info.id} label={info.label} />)

  }
}
async function updateDataInfoServer(data) {
  const res = apiFetch('event', {
    "info_event":
    {
      "timing": "onclick",
      "event": "update_table",
      "table": "info_students"
    }, "data": data
  })

  return res
}
function getDaf(columns, infoUser) {
  const def = {}
  columns.map(col => {
    def[col.id] = infoUser[col.id] !== 'None' ? infoUser[col.id] : ''
    return null
  })
  return def
}

function getType(columns) {
  const def = {}
  columns.map(col => {
    def[col.id] = Yup.string().required(`חובה לכתוב ${col.label}!`)
    return null
  })
  return def
}


export function UserQuickEditForm({ currentUser, open, onClose }) {
  const { enqueueSnackbar } = useSnackbar();
  const students = []// useGetInfoStudents()
  const columnsInfo = useInfoColumn(students?.data || null)

  const NewUserSchema = Yup.object().shape(getType(columnsInfo));

  const defaultValues = useMemo(
    () => ({ ...getDaf(columnsInfo, currentUser) }),
    [currentUser, columnsInfo]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {

      const res = await updateDataInfoServer([data])
      if (res.status === 200) {
        if (res.data.response === "הנתונים עודכנו בהצלחה") {
          enqueueSnackbar('הנתונים עודכנו בהצלחה', "success")
        }
      }

    } catch (error) {
      alert('error')
      console.error(error);
    }
  });

  const handle = useCallback(async (e) => {

    // if (res.response === ){

  },
    []
  );

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>עידכון מהיר</DialogTitle>

        <DialogContent>
          <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
            עידכון נתונים על תלמיד. להוספה לחץ על הוספה בסרגל הצד.
          </Alert>

          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            {columnsInfo.filter(ele => ele.change).map(ele => <FiledElement info={ele} />)}

          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            יציאה
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            עדכן
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
-*/