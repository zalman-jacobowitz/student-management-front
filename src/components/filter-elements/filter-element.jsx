import { MenuItem } from '@mui/material';

import { Field } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
/*

example for multiple select:




 */
export function FilterElement({ name, info, isFilter }) {
  const type = info.type
  switch (type) {

    case 'select':
      
    return (
          <Field.MultiSelect
            chip
            multiple
            checkbox
            name={name}
            label={info.label}
            options={info.options}
        />
      );
    case 'select':
    console.log('info in select filter', info);  
    return (
        <Field.Select name={name} label={info.label}>
          {info.options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Field.Select>
      );

    case 'phone':
      return <Field.Phone name={name} label={info.label} />;

    case 'email':
      return (
        <Field.Text
          name={name}
          label={info.label}
          type="email"
          InputProps={{
            startAdornment: (
              <Iconify icon="mdi:email" sx={{ color: 'text.disabled', mr: 1 }} />
            ),
          }}
        />
      );

    case 'date':
      return (
        <Field.DatePicker
          name={name}
          label={info.label}
        />
      );

    default:
      return (
        <Field.Text
          name={name}
          label={info.label}
          type={info.type}
        />
      );
  }
}