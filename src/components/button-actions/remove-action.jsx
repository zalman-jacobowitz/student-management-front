import { Tooltip, IconButton } from "@mui/material";

import { Iconify } from "src/components/iconify";

const RemoveAction = ({onClick}) => (
    <Tooltip title="מחק">
      <IconButton color="primary" onClick={onClick} data-testid="remove-button-student">
        <Iconify icon="solar:trash-bin-trash-bold" />
      </IconButton>
    </Tooltip>
    )
export default RemoveAction;