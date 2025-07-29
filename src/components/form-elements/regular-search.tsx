import { Stack, OutlinedInput, InputAdornment } from "@mui/material";

import { Iconify } from "src/components/iconify";

interface RegularSearchProps {
  onChange?: (value: string) => void;
}

export function RegularSearch({
    onChange = () => {},
}: RegularSearchProps) {
    return (
      <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
        <OutlinedInput
          fullWidth
          onChange={(e) => onChange(e.target.value)}
          placeholder="חיפוש..."
          startAdornment={
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          }
        />
      </Stack>
    );
  }