import { Stack, Tooltip, TableCell, IconButton } from "@mui/material";

import { Iconify } from "src/components/iconify";

/**
 * A table cell component that renders an action button with an icon and tooltip
 * 
 * @param {CellActionProps} props - The component props
 * @param {string} props.icon - The icon name to display in the button
 * @param {() => void} props.onClick - Function to call when the button is clicked
 * @param {string} props.tooltip - Tooltip text to show on hover
 * @returns {JSX.Element} A table cell containing an action button with tooltip
 * 
 * @example
 * <CellAction
 *   icon="mdi:edit"
 *   onClick={() => handleEdit(row.id)}
 *   tooltip="Edit student"
 * />
 * 
*/

export function CellAction({icon, onClick, tooltip}) {
  
  return (
    <TableCell>
      <Stack direction="row" alignItems="center">
        <Tooltip title={tooltip} placement="top" arrow>
          <IconButton onClick={onClick}>
            <Iconify icon={icon} />
          </IconButton>
        </Tooltip>
      </Stack>
    </TableCell>
  )
}