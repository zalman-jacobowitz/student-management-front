import { Select, MenuItem, InputLabel, FormControl, OutlinedInput } from "@mui/material";

interface SelectOption {
  value: any;
  label: string;
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
        return option?.label || '';
      }}
      inputProps={{ id: 'user-filter-role-select-label' }}
      MenuProps={{ PaperProps: { sx: { maxHeight: 240 } } }}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>

  </FormControl>
)
}