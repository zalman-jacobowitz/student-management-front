import { Select, MenuItem, InputLabel, FormControl, OutlinedInput, Box, Stack } from "@mui/material";
import { Iconify } from "src/components/iconify";

interface SelectOption {
  value: any;
  label: string;
  icon?: string;
  color?: 'success' | 'error' | 'warning' | 'info' | 'default';
}

interface RegularSelectProps {
  label?: string;
  onChange?: (value: any) => void;
  defaultValue?: any;
  options?: SelectOption[];
}

export function RegularSelect({
  label='',
  onChange=()=>{},
  defaultValue=null,
  options=[],
}: RegularSelectProps) {

  
  return (
  <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
    <InputLabel htmlFor="user-filter-role-select-label">{label}</InputLabel>
    
    <Select
      defaultValue={options.length?options[0].value:''}
      onChange={(event) => onChange(event.target.value)}
      input={<OutlinedInput label={label} />}
      renderValue={(selected) => {
        const option = options.find(opt => opt.value === selected);
        return (
          <Stack direction="row" alignItems="center" spacing={1}>
            {option?.icon && <Iconify icon={option.icon} width={20} sx={{ color: `${option.color}.main` }} />}
            <span>{option?.label || ''}</span>
          </Stack>
        );
      }}
      inputProps={{ id: 'user-filter-role-select-label' }}
      MenuProps={{ PaperProps: { sx: { maxHeight: 240 } } }}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          <Stack direction="row" alignItems="center" spacing={1}>
            {option.icon && <Iconify icon={option.icon} width={20} sx={{ color: `${option.color}.main` }} />}
            <span>{option.label}</span>
          </Stack>
        </MenuItem>
      ))}
    </Select>

  </FormControl>
)
}