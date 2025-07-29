import { Button } from "@mui/material"

import { Iconify } from "../iconify"

export const ImportButton = ({ onClick }) => (
    <Button variant="outlined" sx={{ ml: 1 }} onClick={onClick}>
      <Iconify icon="solar:import-bold" width={20} height={20} sx={{ mr: 1 }} />
      ייבא נתונים
    </Button>
  )
  