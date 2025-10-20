import { MenuItem } from "@mui/material";

import { Field, RHFAddressAutocomplete } from "src/components/hook-form";


export function SelectElement({ info }) {
  console.log('data: ', info)
  return (
    <Field.Select 
      name={info.name} 
      label={info.label}
      
    >
      {info.options?.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Field.Select>
  );
}
function HebrewDat({info}){

  return <Field.HebrewDatePicker
            name={info.name}
            label={info.label}
          />
}

const Element = {
  select: SelectElement,
  Text: Field.Text,
  phone: Field.Phone,
  email: Field.Text,
  address: RHFAddressAutocomplete,
  country: Field.CountrySelect,
  checkbox: Field.Switch,
  date: HebrewDat,
  datetime: Field.HebrewDateTimePicker,
};

export function FromElement({ info }) {
  const MainElement = Element[info.type] || Field.Text;
  
  // הוספת helperText מהולידציה רק אם לא קיים

  const enhancedInfo = {
    ...info,
    helperText: info.helperText || ''
  };
  if (info.type === 'select' || info.type === 'date'){
    return <MainElement info={info} />
  }
  return <MainElement {...enhancedInfo} />;
}
