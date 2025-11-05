import { toast } from "sonner";
import { useCallback } from "react";
import { z } from "zod";

import { MenuItem, Typography } from "@mui/material";

import { useInfoColumns } from "src/actions/columns_with_select";
import { apiInfoColumns, infoColumnsUpdate } from "src/actions/info_columns";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Field } from "src/components/hook-form";
import { Iconify } from "src/components/iconify";
import { StepsProvider } from "src/components/steps-form/steps-provider";
import { MasterStep } from "src/components/steps-form/dynamiv-component";

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

// Hook for column selection submission logic
function useColumnSelection({ infoColumns }) {
  
  const queryClient = useQueryClient();
  const updateInfoColumns = useMutation(infoColumnsUpdate({ queryClient }));
  
  const onSubmit = useCallback(async (data) => {
    try {
      console.log('Column selection data:', data);
      console.log('Current infoColumns:', infoColumns);
      
      // Validate that all required fields are selected
      const { nameColumn, familyColumn, accessibleColumn, filterColumns, duplicateColumns, hiddenColumns } = data;

      if (!nameColumn || !familyColumn || !accessibleColumn || !hiddenColumns) {
        toast.error('יש למלא את כל השדות הנדרשים');
        return;
      }

      if (!filterColumns || filterColumns.length === 0) {
        toast.error('יש לבחור לפחות עמודה אחת לפילטרים');
        return;
      }

      if (filterColumns.length > 2) {
        toast.error('ניתן לבחור עד 2 עמודות לפילטרים נגישים');
        return;
      }

      if (!duplicateColumns || duplicateColumns.length === 0) {
        toast.error('יש לבחור לפחות עמודה אחת למציאת כפילויות');
        return;
      }
      
      // Create updated columns array based on user selections
      const updatedColumns = infoColumns.map(column => {
        const updatedColumn = { ...column };
        
        // Reset group_name and filters for all columns first
        updatedColumn.group_name = "";
        updatedColumn.filters = "";
        updatedColumn.hidden = hiddenColumns.includes(column.name) ? 1 : 0;
        
        // Apply updates based on user selections
        if (column.name === nameColumn || column.name === familyColumn) {
          // עמודות שם ומשפחה: עדכון group_name ל-"primary"
          updatedColumn.group_name = "primary";
        }
        
        if (column.name === accessibleColumn) {
          // עמודה נגישה: עדכון group_name ל-"secondary"
          updatedColumn.group_name = "secondary";
        }
        
        if (filterColumns.includes(column.name)) {
          // עמודות פילטר: עדכון filters ל-"extra"
          updatedColumn.filters = "extra";
        }
        

        if (duplicateColumns.includes(column.name)) {
          // עמודות ייחודיות: עדכון unique ל-1
          updatedColumn.unique = 1;
        }
        
        return updatedColumn;
      });
      
      console.table(updatedColumns);
      
      // Prepare data for batch update - send all columns together
      const columnsUpdateData = updatedColumns.map(column => ({
        client: column.client,
        filters: column.filters,
        group_name: column.group_name,
        hidden: column.hidden,
        label: column.label,
        name: column.name,
        required: column.required,
        sorting: String(column.sorting) || '0',
        table_name: column.table_name,
        type: column.type,
        unique: column.unique
      }));
      
      console.log('Sending batch update:', columnsUpdateData);
      
      // Execute batch update - send all columns at once
      const updatePromise = updateInfoColumns.mutateAsync({
        data: columnsUpdateData,
        mode: "update"
      });
      
      toast.promise(updatePromise, {
        loading: 'מעדכן הגדרות עמודות...',
        success: 'הגדרות העמודות עודכנו בהצלחה',
        error: 'שגיאה בעדכון הגדרות העמודות'
      });
      
      await updatePromise;
      
    } catch (error) {
      console.error('Error saving column selection:', error);
      toast.error('שגיאה בשמירת בחירת העמודות');
    }
  }, [infoColumns, updateInfoColumns]);

  return {
    onSubmit
  }
}


// Main form component similar to ColumnDefinitionStep
export function ColumnSelectionStep({ onComplete }) {
  
  // הנתונים על העמודות
  const infoColumns = useSuspenseQuery(apiInfoColumns()).data;

  console.table(infoColumns);

  const initialValues = {
    nameColumn: infoColumns.filter(col => col.group_name === 'primary')[0]?.name || "",
    familyColumn: infoColumns.filter(col => col.group_name === 'primary')[1]?.name || "",
    accessibleColumn: infoColumns.find(col => col.group_name === 'secondary')?.name || "",
    filterColumns: infoColumns.filter(col => col.filters === 'extra').map(col => col.name) || [],
    duplicateColumns: infoColumns.filter(col => col.unique).map(col => col.name) || [],
    hiddenColumns: infoColumns.filter(col => col.hidden).map(col => col.name) || []
  }
  // Validation schema
  const ColumnSelectionSchema = z.object({
    nameColumn: z.string().min(1, "יש לבחור עמודת שם"),
    familyColumn: z.string().min(1, "יש לבחור עמודת משפחה"),
    accessibleColumn: z.string().min(1, "יש לבחור עמודה נגישה"),
    filterColumns: z.array(z.string()).max(2, "ניתן לבחור עד 2 עמודות לפילטרים נגישים").min(1, "יש לבחור לפחות עמודה אחת"),
    duplicateColumns: z.array(z.string()).min(1, "יש לבחור לפחות עמודה אחת למציאת כפילויות"),
    hiddenColumns: z.array(z.string()).min(1, "יש לבחור לפחות עמודה אחת מוסתרת"),
  });

  // Fields array similar to column-edit-steps.jsx
  const fields = [
    {
      step: 1,
      name: "nameColumn",
      label: "בחר עמודת שם",
      variant: "filled",
      InputLabelProps: { shrink: true },
      type: "text",
      helperText: "בחר את העמודה המכילה שמות פרטיים",
      children: infoColumns.map((column) => (
        <MenuItem key={column.name} value={column.name}>
          <Iconify icon="solar:users-group-two-rounded-bold" width={20} sx={{ mr: 1 }} />
          <Typography variant="body2">{column.label}</Typography>
        </MenuItem>
      )),
      component: Field.Select
    },
    {
      step: 1,
      name: "familyColumn",
      label: "בחר עמודת משפחה",
      variant: "filled",
      InputLabelProps: { shrink: true },
      type: "text",
      helperText: "בחר את העמודה המכילה שמות משפחה",
      children: infoColumns.map((column) => (
        <MenuItem key={column.name} value={column.name}>
          <Iconify icon="solar:users-group-two-rounded-bold" width={20} sx={{ mr: 1 }} />
          <Typography variant="body2">{column.label}</Typography>
        </MenuItem>
      )),
      component: Field.Select
    },
    {
      step: 1,
      name: "accessibleColumn",
      label: "בחר עמודה נגישה",
      variant: "filled",
      InputLabelProps: { shrink: true },
      type: "text",
      helperText: "בחר עמודה שתהיה נגישה במהירות",
      children: infoColumns.map((column) => (
        <MenuItem key={column.name} value={column.name}>
          <Iconify icon="solar:users-group-two-rounded-bold" width={20} sx={{ mr: 1 }} />
          <Typography variant="body2">{column.label}</Typography>
        </MenuItem>
      )),
      component: Field.Select
    },
    {
      step: 2,
      name: "filterColumns",
      label: "בחירת עמודות לפילטרים נגישים (מוגבל ל-2)",
      variant: "filled",
      InputLabelProps: { shrink: true },
      type: "text",
      helperText: "בחר עד 2 עמודות שישמשו לפילטור מהיר",
      options: infoColumns.map((column) => ({
        value: column.name,
        label: column.label
      })) || [],
      checkbox: true,
      chip: true,
      component: Field.MultiSelect
    },
    {
      step: 2,
      name: "duplicateColumns",
      label: "בחירת עמודות למציאת כפילויות",
      variant: "filled",
      InputLabelProps: { shrink: true },
      type: "text",
      helperText: "בחר עמודות שישמשו לזיהוי רשומות כפולות",
      options: infoColumns.map((column) => ({
        value: column.name,
        label: column.label
      })) || [],
      checkbox: true,
      chip: true,
      component: Field.MultiSelect
    },
    {
      step: 3,
      name: "hiddenColumns",
      label: "בחירת עמודות מוסתרות",
      variant: "filled",
      InputLabelProps: { shrink: true },
      type: "text",
      helperText: "בחר עמודות שיישארו מוסתרות כברירת מחדל",
      options: infoColumns.map((column) => ({
        value: column.name,
        label: column.label
      })) || [],
      checkbox: true,
      chip: true,
      component: Field.MultiSwitch
    },
    
  ]

  // Steps configuration similar to column-edit-steps.jsx
  const steps = [
    {
      label: 'עמודות בסיסיות',
      component: <MasterStep fields={fields} number={1} />,
      icon: "solar:user-bold",
      name: 'basicColumns'
    },
    {
      label: 'פילטרים וכפילויות',
      component: <MasterStep fields={fields} number={2} />,
      icon: "solar:filter-bold",
      name: 'filtersAndDuplicates'
    },
    {
      label: 'עמודות מוסתרות',
      component: <MasterStep fields={fields} number={3} />,
      icon: "solar:eye-bold",
      name: 'hiddenColumns'
    },
    {
      name: 'complete',
      component: <></>
    }

  ]

  const { onSubmit } = useColumnSelection({ infoColumns: infoColumns });

  return (
    <StepsProvider
      steps={steps}
      defaultValues={initialValues}
      WizardSchema={ColumnSelectionSchema}
      onSubmit={onSubmit}
    />
  );
}

// Wrapper component - now uses hook internally
export function ColumnSelectionForm() {
  return (
    <ColumnSelectionStep />
  );
}