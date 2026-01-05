import { z as zod } from 'zod';
import { toast } from 'sonner';
import { useState, useCallback, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Box, Button, Grid, Dialog, DialogTitle, DialogContent, MenuItem, Typography, Card, IconButton, alpha } from '@mui/material';

import { screenOptions } from 'src/layouts/config-nav-dashboard';

import { Field, Form } from 'src/components/hook-form';

import { StepsProvider } from 'src/components/steps-form/steps-provider';
import { MasterStep } from 'src/components/steps-form/dynamiv-component';
import { useFormContext } from 'react-hook-form';
import { Iconify } from 'src/components/iconify';
import { useInfoColumns } from 'src/actions/columns_with_select';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { usersUpdate } from 'src/actions/users';
import { signUp } from 'src/auth/context/supabase';
import { useUserDetails } from 'src/hooks/use-user-details';
import { apiInfoColumns } from 'src/actions/info_columns';
import { apiInfoStudents } from 'src/actions/info_students';



// -----------------------------------------------------------------------
// Schema Definitions

const UserDetailsSchema = zod.object({
  firstName: zod.string().min(1, { message: 'שם משתמש הוא שדה חובה!' }),
  lastName: zod.string().min(1, { message: 'שם מלא הוא שדה חובה!' }),
  country: zod.string().optional(),
  email: zod
    .string()
    .min(1, { message: 'דואר אלקטרוני הוא שדה חובה!' })
    .email({ message: 'כתובת דואר אלקטרוני לא תקינה!' }),
});

const FilterRestriction = zod.object({
  table: zod.string(),
  columnName: zod.string(),
  values: zod.array(zod.string()).min(1, { message: 'יש לבחור לפחות ערך אחד' }),
  label: zod.string().optional(),
  operator: zod.enum(['and', 'or']).default('and'),
  side: zod.enum(['server', 'client']).default('server')
});

const Permissions = zod.array(FilterRestriction).optional();

const PermissionsWizardSchema = zod.object({
  user: UserDetailsSchema,
  screens: zod.object(
    Object.keys(screenOptions).reduce((acc, key) => {
      acc[key] = zod.boolean().optional();
      return acc;
    }, {})
  ).optional(),
  permissions: Permissions
});
//-----------------------------------------------------------------------

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

// ----------------------------------------------------------------------
// UI helpers


const FilterItem = ({ filter, onRemove }) => {
  const tableLabel = tableOptions.find((t) => t.value === filter.table)?.label || filter.table;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        borderRadius: 1.5,
        bgcolor: 'background.paper',
        border: (t) => `1px solid ${t.palette.divider}`,
        boxShadow: (t) => t.customShadows.z1,
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" fontWeight="medium">
          {tableLabel} - {filter.label || filter.columnName}:{' '}
          {Array.isArray(filter.values) ? filter.values.join(', ') : filter.value}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
          <Typography variant="caption" color="text.secondary">
            טבלה: {tableLabel}
          </Typography>
          <Typography variant="caption" color="primary.main">
            {filter.operator}
          </Typography>
          <Typography variant="caption" color="secondary.main">
            {filter.side === 'server' ? 'שרת' : 'לקוח'}
          </Typography>
        </Box>
      </Box>
      <IconButton
        size="small"
        color="error"
        onClick={() => onRemove(filter.table, filter.columnName)}
        sx={{ '&:hover': { bgcolor: (t) => alpha(t.palette.error.main, 0.08) } }}
      >
        <Iconify icon="solar:trash-bin-trash-bold" />
      </IconButton>
    </Box>
  );
};
const FiltersCard = ({ filters = [], onRemove }) => (
  <Card sx={{ p: 3, mb: 3, bgcolor: 'background.neutral' }}>
    {filters.length ? (
      <>
        <Typography variant="subtitle2" mb={2}>
          הגבלות פעילות ({filters.length})
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {filters.map((f, i) => (
            <FilterItem
              key={`${f.table}-${f.columnName}-${i}`}
              filter={f}
              onRemove={onRemove}
            />
          ))}
        </Box>
        <Typography variant="caption" color="text.secondary" mt={2}>
          המשתמש יראה רק רשומות שמקיימות את ההגבלות
        </Typography>
      </>
    ) : (
      <Box textAlign="center">
        <Iconify
          icon="solar:shield-user-bold"
          sx={{ width: 48, height: 48, color: 'text.disabled', mb: 2 }}
        />
        <Typography variant="h6" color="text.secondary">
          לא הוגדרו הגבלות
        </Typography>
        <Typography variant="body2" color="text.disabled">
          המשתמש יוכל לראות את כל הרשומות
        </Typography>
      </Box>
    )}
  </Card>
);

const TableSelect = ({ value, onChange, options }) => (
  <Field.Select
    name="temp_table"
    label="בחירת טבלה"
    variant="outlined"
    value={value}
    onChange={onChange}
    fullWidth
  >
    {options.map(({ label, value: v }) => (
      <MenuItem key={v} value={v}>
        {label}
      </MenuItem>
    ))}
  </Field.Select>
);

const ColumnSelect = ({ value, onChange, columns }) => (
  <Field.Select
    name="temp_column"
    label="בחירת עמודה"
    variant="outlined"
    value={value}
    onChange={onChange}
    fullWidth
  >
    {columns.map((c) => (
      <MenuItem key={c.name} value={c.name}>
        {c.label}
      </MenuItem>
    ))}
  </Field.Select>
);

const OperatorSelect = ({ value, onChange }) => (
  <Field.Select
    name="temp_operator"
    label="סוג החיבור"
    variant="outlined"
    value={value}
    onChange={onChange}
    fullWidth
  >
    <MenuItem value="and">AND (וגם)</MenuItem>
    <MenuItem value="or">OR (או)</MenuItem>
  </Field.Select>
);

const SideSelect = ({ value, onChange }) => (
  <Field.Select
    name="temp_side"
    label="צד ביצוע הפילטור"
    variant="outlined"
    value={value}
    onChange={onChange}
    fullWidth
  >
    <MenuItem value="server">שרת</MenuItem>
    <MenuItem value="client">לקוח</MenuItem>
  </Field.Select>
);

const ValueInput = ({ column, value, onChange }) => {
  if (!column) return null;
  alert(JSON.stringify(value))
  return column.type === 'select' && column.options ? (
    <Field.MultiSelect
      chip
      checkbox
      options={[]}
    />
  ) : <></>
  /*
  (
    <Field.Text
      name="temp_value"
      label={`ערך ב${column.label}`}
      variant="outlined"
      value={value}
      onChange={onChange}
      placeholder="הכנס ערך..."
      fullWidth
    />
    
  );*/
};

export const AddPermissionDialog = ({
  open,
  onClose,
  onAdd,
  existingFilters = [],
}) => {
  const { watch } = useFormContext();
  const [state, setState] = useState({
    selectedColumn: '',
    selectedValue: [],
    operator: 'and',
    side: 'server',
  });

  const { selectedColumn, selectedValue, operator, side } = state;

  // filtering removed for brevity

  const columns = useSuspenseQuery(apiInfoColumns()).data;
  const infoStudents = useSuspenseQuery(apiInfoStudents()).data;


  const handleChange = (key) => (e) =>
    setState((s) => ({ ...s, [key]: e.target.value }));

  const canAdd =
    selectedColumn &&
    selectedValue.length > 0 &&
    !existingFilters.some(
      (f) => f.columnName === selectedColumn
    );

  const reset = () =>
    setState({
      selectedColumn: '',
      selectedValue: [],
      operator: 'and',
      side: 'server',
    });

  const handleAdd = () => {
    if (!canAdd) return;
    onAdd(selectedColumn, selectedValue, operator, side);
    reset();
    onClose();
  }
  console.log('columns: ', columns)
  const columnsSelect = [{
        component: Field.MultiSelect,
        name: "permissions",
        label: "בחירת עמודות לפילטרים נגישים (מוגבל ל-2)",
        variant: "filled",
        InputLabelProps: { shrink: true },
        helperText: "בחר עד 2 עמודות שישמשו לפילטור מהיר",
        options: [...new Set(infoStudents.map(e=>e[watch('p')]))].map((column) => ({
        value: column.name,
        label: column.label
      })) || [],
        checkbox: true,
        chip: true,
        step: 1
  }]
  console.log('watch(): ', watch())
  return (
    <Dialog
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      maxWidth="sm"
      fullWidth
      sx={{ '& .MuiDialog-paper': { borderRadius: 2 } }}
    >
      <DialogTitle>הוספת הגבלת הרשאה</DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <ColumnSelect
            value={selectedColumn}
            onChange={handleChange('selectedColumn')}
            columns={columns}
          />
          <OperatorSelect value={operator} onChange={handleChange('operator')} />
          <SideSelect value={side} onChange={handleChange('side')} />
          <MasterStep fields={columnsSelect} number={1} />
          </Box>
      </DialogContent>
      <Box sx={{ p: 3, pt: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          onClick={() => {
            reset();
            onClose();
          }}
        >
          ביטול
        </Button>
        <Button
          variant="contained"
          onClick={handleAdd}
          disabled={!canAdd}
          startIcon={<Iconify icon="solar:add-circle-bold" />}
        >
          הוסף
        </Button>
      </Box>
    </Dialog>
  );
};

export const PermissionsStep = () => {
  const { watch, setValue } = useFormContext();
  const filters = watch('permissions') || [];
  
  const [open, setOpen] = useState(false);

  const addFilter = (column, value, operator, side) => {
    const next = [...filters];
    const existing = next.find((f) => f.columnName === column);
    if (existing) {
      existing.values = Array.from(new Set([...(existing.values ?? []), value]));
      existing.operator = operator;
      existing.side = side;
    } else {
      next.push({
        columnName: column,
        values: value,
        label: column,
        operator,
        side,
      });
    }
    setValue('permissions', next);
  };

  const removeFilter = (column) => {
    setValue(
      'permissions',
      filters.filter((f) => f.columnName !== column)
    );
  };

  return (
    <>
      <Typography variant="subtitle1" mb={2}>
        הגדרת הרשאות גישה
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        בחר אילו רשומות יוצגו למשתמש
      </Typography>

      <FiltersCard
        filters={filters}
        onRemove={removeFilter}
      />

      <Button
        fullWidth
        size="large"
        variant="contained"
        startIcon={<Iconify icon="solar:add-circle-bold" />}
        onClick={() => setOpen(true)}
      >
        הוסף הגבלה
      </Button>

      <AddPermissionDialog
        open={open}
        onClose={() => setOpen(false)}
        onAdd={addFilter}
        existingFilters={filters}
      />
    </>
  );
};



function usePermissionsFormDefinition({ existingUser }) {
  const queryClient = useQueryClient();
  const mutate = useMutation(usersUpdate({ queryClient }));
  const { userDetails } = useUserDetails();

  const onSubmit = useCallback(async (dataFORM) => {
    try {
      console.log('Submitting user data:', dataFORM);
      console.log('userDetails: ', userDetails);

      const data = {
        ...dataFORM.user,
        password: '123456',
        client: userDetails.user_metadata.client,
        org: userDetails.user_metadata.client,
        data: dataFORM
      };
      console.log('Prepared user data for submission:', data);

      const promise = existingUser 
        ? mutate.mutateAsync(Array(dataFORM), 'update')
        : signUp(data, true);

      toast.promise(promise, {
        loading: 'מעדכן...',
        success: 'העדכון הצליח!',
        error: 'העידכון נכשל!',
      });

      await promise;
      queryClient.invalidateQueries();

    } catch (error) {
      console.error('Error during submission:', error);
      toast.error('שגיאה בשמירת נתוני המשתמש');
    }
  }, [mutate, userDetails, queryClient, existingUser]);

  return { onSubmit };
}



export function NewPermissionsForm({ existingUser = null, onComplete }) {
  // Data fetching
  const columnData = useSuspenseQuery(apiInfoColumns()).data || [];
  const studentsData = useSuspenseQuery(apiInfoStudents()).data || [];
  console.log('existingUserDetails: ', existingUser)

  const existingUserDetails = existingUser ? existingUser.user : null;
  // Initialize form data
  const initialValues = {
    user: {
      firstName: existingUserDetails.firstName || '',
      lastName: existingUserDetails.lastName || '',
      country: existingUserDetails.country || '',
      email: existingUserDetails.email || '',
    },
    screens: existingUser?.screens || Object.keys(screenOptions).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {}),
    permissions: existingUser?.permissions || []
  };

  // Setup form with schema and initial values
  const methods = useForm({
    resolver: zodResolver(PermissionsWizardSchema),
    defaultValues: initialValues
  });

  const { handleSubmit, watch, setValue } = methods;
  const { onSubmit: handleFormSubmit } = usePermissionsFormDefinition({ existingUser });

  // Build fields configuration
  const fields = [
    {
      step: 1,
      name: "user.firstName",
      label: "שם משתמש",
      variant: "filled",
      InputLabelProps: { shrink: true },
      type: "text",
      component: Field.Text
    },
    {
      step: 1,
      name: "user.lastName",
      label: "שם משפחה",
      variant: "filled",
      InputLabelProps: { shrink: true },
      type: "text",
      component: Field.Text
    },
    {
      step: 1,
      name: "user.country",
      label: "מדינה",
      variant: "filled",
      InputLabelProps: { shrink: true },
      type: "country",
      component: Field.Text
    },
    {
      step: 1,
      name: "user.email",
      label: "דואר אלקטרוני",
      variant: "filled",
      InputLabelProps: { shrink: true },
      type: "email",
      component: Field.Text
    },
    ...Object.entries(screenOptions).map(([key, screen]) => (
      {
        step: 2,
        name: `screens.${key}`,
        label: screen.title,
        icon: screen.regularIcon,
        component: Field.ToggleButtonSwitch,
      }
    )),
    {
      step: 3,
      name: 'permissions',
      label: 'הרשאות',
      icon: "mdi:shield-outline",
      component: PermissionsStep
    }
  ];

  const steps = [
    {
      label: 'פרטי משתמש',
      component: <MasterStep fields={fields} number={1} />,
      name: 'userDetails',
      icon: "mdi:account-outline"
    },
    {
      label: 'בחירת מסכים',
      component: <MasterStep fields={fields} number={2} Provider={Grid} container spacing={2} />,
      name: 'screens',
      icon: "mdi:monitor-outline",
    },
    {
      label: 'הרשאות מפורטות',
      component: <MasterStep fields={fields} number={3} />,
      name: 'permissions',
      icon: "mdi:shield-outline"
    },
    {
      name: 'complete',
      component: <></>
    }
  ];

  const onFormSubmit = async (data) => {
    console.log('Form submitted:', data);
    await handleFormSubmit(data);
    if (onComplete) {
      onComplete(data);
    }
  };

  return (
    <FormProvider {...methods}>
      <StepsProvider
        steps={steps}
        defaultValues={initialValues}
        WizardSchema={PermissionsWizardSchema}
        onSubmit={onFormSubmit}
      />
    </FormProvider>
  );
}


