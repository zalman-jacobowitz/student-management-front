import { z as zod } from 'zod';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSuspenseQuery } from '@tanstack/react-query';

import { Box, Button, Dialog, DialogTitle, DialogContent, MenuItem } from '@mui/material';
import { Field } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { apiInfoColumns } from 'src/actions/info_columns';
import { apiInfoStudents } from 'src/actions/info_students';

// -----------------------------------------------------------------------
// Schema for Permission Dialog Form

export const PermissionFormSchema = zod.object({
  selectedTable: zod.string().min(1, { message: 'יש לבחור טבלה' }),
  selectedColumn: zod.string().min(1, { message: 'יש לבחור עמודה' }),
  selectedValue: zod.array(zod.string()).min(1, { message: 'יש לבחור לפחות ערך אחד' }),
  values: zod.array(zod.string()).optional(),
  selectedColumns: zod.array(zod.string()).optional(),
  operator: zod.enum(['and', 'or']).default('and'),
  side: zod.enum(['server', 'client']).default('server'),
});

// -----------------------------------------------------------------------
// Constants

const tableOptions = [
  {
    value: "info_students",
    label: "תלמידים"
  },
  {
    value: "templates",
    label: "זמנים"
  }
];

// -----------------------------------------------------------------------
// Dialog Component

export const AddPermissionDialog = ({
  open,
  onClose,
  onAdd,
  existingFilters = [],
}) => {
  // Initialize dialog form with schema
  const initialDialogValues = {
    selectedTable: '',
    selectedColumn: '',
    selectedValue: [],
    values: [],
    selectedColumns: [],
    operator: 'and',
    side: 'server',
  };

  const dialogMethods = useForm({
    resolver: zodResolver(PermissionFormSchema),
    defaultValues: initialDialogValues,
    mode: 'onChange'
  });

  const { watch, handleSubmit, reset, formState: { errors, isValid } } = dialogMethods;
  const columns = useSuspenseQuery(apiInfoColumns()).data;
  const infoStudents = useSuspenseQuery(apiInfoStudents()).data;

  const selectedTable = watch('selectedTable');
  const selectedColumn = watch('selectedColumn');
  const selectedValue = watch('selectedValue');
  const values = watch('values');
  const selectedColumns = watch('selectedColumns');
  const operator = watch('operator');
  const side = watch('side');

  const canAdd = isValid && !existingFilters.some((f) => f.columnName === selectedColumn);

  const onDialogSubmit = (data) => {
    if (!canAdd) return;
    onAdd(data.selectedColumn, data.selectedValue, data.operator, data.side);
    reset();
    onClose();
  };

  const handleDialogClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      maxWidth="sm"
      fullWidth
      sx={{ '& .MuiDialog-paper': { borderRadius: 2 } }}
    >
      <DialogTitle>הוספת הגבלת הרשאה</DialogTitle>
      <FormProvider {...dialogMethods}>
        <form onSubmit={handleSubmit(onDialogSubmit)}>
          <DialogContent sx={{ pt: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Field.Select
                name="selectedTable"
                label="בחירת טבלה"
                variant="outlined"
                fullWidth
              >
                {tableOptions.map((t) => (
                  <MenuItem key={t.value} value={t.value}>
                    {t.label}
                  </MenuItem>
                ))}
              </Field.Select>

              <Field.Select
                name="selectedColumn"
                label="בחירת עמודה"
                variant="outlined"
                fullWidth
              >
                {columns && columns.map((c) => (
                  <MenuItem key={c.name} value={c.name}>
                    {c.label}
                  </MenuItem>
                ))}
              </Field.Select>

              <Field.MultiSelect
                name="selectedColumns"
                label="עמודות נוספות לפילטור מהיר (אופציונלי)"
                variant="outlined"
                checkbox
                chip
                fullWidth
                options={columns && columns.map((c) => ({
                  value: c.name,
                  label: c.label
                })) || []}
              />

              <Field.MultiSelect
                name="selectedValue"
                label="בחירת ערכים"
                variant="outlined"
                checkbox
                chip
                fullWidth
                options={selectedColumn && columns
                  ? [...new Set(infoStudents?.map(e => e[selectedColumn]) || [])].map((val) => ({
                      value: val,
                      label: val
                    }))
                  : []
                }
              />

              <Field.MultiSelect
                name="values"
                label="ערכים נוספים (אופציונלי)"
                variant="outlined"
                checkbox
                chip
                fullWidth
                options={selectedColumn && columns
                  ? [...new Set(infoStudents?.map(e => e[selectedColumn]) || [])].map((val) => ({
                      value: val,
                      label: val
                    }))
                  : []
                }
              />

              <Field.Select
                name="operator"
                label="סוג החיבור"
                variant="outlined"
                fullWidth
              >
                <MenuItem value="and">AND (וגם)</MenuItem>
                <MenuItem value="or">OR (או)</MenuItem>
              </Field.Select>

              <Field.Select
                name="side"
                label="צד ביצוע הפילטור"
                variant="outlined"
                fullWidth
              >
                <MenuItem value="server">שרת</MenuItem>
                <MenuItem value="client">לקוח</MenuItem>
              </Field.Select>
            </Box>
          </DialogContent>
          <Box sx={{ p: 3, pt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              type="button"
              onClick={handleDialogClose}
            >
              ביטול
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!canAdd}
              startIcon={<Iconify icon="solar:add-circle-bold" />}
            >
              הוסף
            </Button>
          </Box>
        </form>
      </FormProvider>
    </Dialog>
  );
};
