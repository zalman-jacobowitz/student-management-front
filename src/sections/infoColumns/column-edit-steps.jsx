import { toast } from "sonner";
import { useState, useCallback } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import {Alert, Stack, Button, Dialog, Typography, IconButton, MenuItem} from "@mui/material";
import { Iconify } from "src/components/iconify";
import { Scrollbar } from "src/components/scrollbar";
import { Field } from "src/components/hook-form";

import { z } from "zod";

import { columnsTypes } from "src/utils/uinqe_usege/columnsTypes";
import { StepsProvider } from "src/components/steps-form/steps-provider";
import { MasterStep } from "src/components/steps-form/dynamiv-component";
import { infoColumnsUpdate } from "src/actions/info_columns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { selectOptionsUpdate } from "src/actions/select_options";
import { ColumnSelectionForm } from "./column-selection-form";



// שלב 3: אפשרויות בחירה (עבור סוג בחירה)
export function SelectOptionsStep() {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "options", // שונה
  });

  return (
    <Stack spacing={3}>
      <Alert severity="info">
        <Typography variant="body2">
          הוסף או הסר אפשרויות בחירה עבור עמודה זו.
        </Typography>
      </Alert>
      <Scrollbar sx={{ maxHeight: { xs: 100, sm: 200, md: 260 } }}>
        <Stack spacing={2}>
          {fields.map((item, index) => (
            <Stack key={item.id} direction="row" spacing={2} alignItems="center">
              <Field.Text
                name={`options[${index}].value`} // שונה
                placeholder="ערך האפשרות"
                fullWidth />
              <Field.Text
                name={`options[${index}].label`} // שונה
                placeholder="תווית האפשרות"
                fullWidth />
              <IconButton onClick={() => remove(index)} color="error">
                <Iconify icon="mdi:delete" />
              </IconButton>
            </Stack>
          ))}
        </Stack>
      </Scrollbar>
      <Button
        type="button"
        variant="outlined"
        startIcon={<Iconify icon="mdi:plus" />}
        onClick={() => append({ value: '', label: '' })}
      >
        הוסף אפשרות
      </Button>
    </Stack>
  );
}

function useColumnDefinition({ column, infoColumns, selectOptions, isInitializationMode = false, onComplete }) {
  
  const queryClient = useQueryClient();

  const updateInfoColumns = useMutation(infoColumnsUpdate({queryClient}))
  const updateSelectOptions = useMutation(selectOptionsUpdate({queryClient}))


  const onSubmit = useCallback(async (data) => {
    try {
      console.log('Column edit data: ', data)

      // שמירה על כל השדות הקיימים ועדכון רק השדות שנערכו
      const columnNewDetails = {
        "client": column.client,
        "filters": column.filters, // שמירה על הערך הקיים
        "group_name": column.group_name, // שמירה על הערך הקיים
        "hidden": data.hidden ? '1' : '', // עדכון לפי הטופס
        "label": column.label, // שמירה על הערך הקיים
        "name": data.name, // עדכון לפי הטופס
        "required": column.required, // שמירה על הערך הקיים
        "sorting": String(column.sorting),
        "table_name": "info_students",
        "type": data.type, // עדכון לפי הטופס
        "options": data.options || []
      }
      
      console.log('Updated column details: ', columnNewDetails)

      // עדכון אפשרויות בחירה רק אם הסוג הוא select
      if (data.type === 'select') {
        columnNewDetails.options = data.options.map(option => ({
          table_name: column.table_name,
          name: data.name, // שימוש בשם החדש אם השתנה
          client: column.client,
          value: option.value,
          label: option.label
        }));
      }

      // אם במצב איתחול - החזר את הנתונים ללא שמירה בשרת
      if (isInitializationMode) {
        console.log('Initialization mode - returning data to parent:', columnNewDetails)
        if (onComplete) {
          onComplete(columnNewDetails);
        }
        return;
      }

      // מצב רגיל - שמור בשרת
      // עדכון העמודה
      const promiseColumns = updateInfoColumns.mutateAsync({data: Array(columnNewDetails), mode: "update"})
      toast.promise(promiseColumns, {
        loading: 'שומר עמודה...',
        success: 'עמודה נשמרה בהצלחה',
        error: 'שגיאה בשמירת העמודה'
      });

      // עדכון אפשרויות בחירה אם נדרש
      if (data.type === 'select' && data.options && data.options.length > 0) {
        const optionPromise = updateSelectOptions.mutateAsync({data: columnNewDetails.options, mode: "update"})
        toast.promise(optionPromise, {
          loading: 'שומר אפשרויות בחירה...',
          success: 'אפשרויות בחירה נשמרו בהצלחה',
          error: 'שגיאה בשמירת אפשרויות הבחירה'
        });
      }

      console.log('Final column data:', columnNewDetails)
    } catch (error) {
      console.error('Error saving column settings:', error);
      toast.error('שגיאה בשמירת הגדרות העמודה');
    }
  }, [column, updateInfoColumns, updateSelectOptions, isInitializationMode, onComplete]);

  return {
    onSubmit
  }
}


export function ColumnDefinitionStep({ tableColumns = [], onComplete, column, infoColumns, selectOptions, isInitializationMode = false }) {

  const initialValues = {
    name: column.name,
    label: column.label,
    description: '',
    type: column.type,
    options: column.options,
    hidden: column.hidden === '',
    required: column.required === '',
    disabled: false,
    group: column.filters,
    priority: column.group_name,
    unique: false
  } 

  const WizardSchema = z.object({
    name: z.string().min(1, "שם עמודה נדרש"),
    type: z.string().min(1, "סוג נתונים נדרש"),
    options: z.array(z.object({
      value: z.string().min(1, "ערך האפשרות נדרש"),
      label: z.string().min(1, "תווית האפשרות נדרשת"),
    })).optional(),
    hidden: z.boolean().optional(),
  });

  const fileds = [
    {
      step: 1,
      name: "name",
      label: "שם עמודה",
      variant: "filled",
      InputLabelProps: { shrink: true },
      type : "text",
      component: Field.Text
    },
    {
      step: 1,
      name: "type",
      label: "סוג נתונים",
      variant: "filled",
      InputLabelProps: { shrink: true },
      type : "text",
      children: Object.values(columnsTypes).map(
        (type) => (
          <MenuItem key={type.type} value={type.type}>
            <Iconify icon={type.icon} width={20} />
            <Typography variant="body2">{type.label}</Typography>
            <Typography variant="caption" color="text.secondary">{type.description}</Typography>
          </MenuItem>
        )
      ),
      component: Field.Select
    },
    {
      step: 1,
      name: 'hidden',
      label: 'העמודה מוסתרת',
      icon: 'mdi:eye-off-outline',
      component: Field.Switch
    },
    {
      step: 2,
      name: "options",
      label: "אפשרויות בחירה",
      variant: "filled",
      InputLabelProps: { shrink: true },
      component: SelectOptionsStep
    }
  ]


  const stepsSelect = (select=false)=> [
    {
      label: 'פרטי עמודה',
      component: <MasterStep fields={fileds} number={1} />,
      icon: "mdi:form-textbox",
      name: 'columnDetails'
    },
    ...(select ? [{
      label: 'אפשרויות בחירה',
      component: <MasterStep fields={fileds} number={2} />,
      icon: "mdi:format-list-bulleted-type",
      name: 'selectOptions'
    }] : []),
    {
      name: 'complete',
      component: <></>
    }
  ]

  const [steps, setSteps] = useState(stepsSelect(false))

  const addSelectOptionsStep = useCallback((data) => {
    console.log('data: ', data)
    setSteps(stepsSelect(data.type === 'select'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { onSubmit } = useColumnDefinition({ column, infoColumns, selectOptions, isInitializationMode, onComplete });

  return (
    <StepsProvider
      steps={steps}
      defaultValues={initialValues}
      WizardSchema={WizardSchema}
      onSubmit={onSubmit}
      watch={addSelectOptionsStep}
      watchName='type'
    />
  );
}





// דיאלוג להצגת אשף הגדרת נראות עמודות
export function ColumnVisibilityDialog({ open, onClose, tableColumns = [], onComplete, column, infoColumns, selectOptions, isInitializationMode = false }) {
  const handleWizardComplete = (data) => {
    if (onComplete) {
      onComplete(data); // קריאה ל-callback שהועבר מהקומפוננטה המשתמשת
    }
    onClose(); // סגירת הדיאלוג לאחר השלמת האשף
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            {/*
      <ColumnSelectionForm />
      */}
      <ColumnDefinitionStep
        infoColumns={infoColumns}
        selectOptions={selectOptions}
        column={column} // העברת העמודה הנוכחית לאשף
        columns={tableColumns} // מעביר את העמודות הנוכחיות לאשף
        onComplete={handleWizardComplete} // מטפל בסיום האשף
        isInitializationMode={isInitializationMode} // העברת מצב האיתחול
      />

    </Dialog>
  );
}

// דיאלוג להצגת טופס הגדרות כלליות
export function ColumnGeneralSettingsDialog({ open, onClose, onComplete }) {
  const handleFormComplete = (data) => {
    if (onComplete) {
      onComplete(data);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <ColumnSelectionForm onComplete={handleFormComplete} />
    </Dialog>
  );
}