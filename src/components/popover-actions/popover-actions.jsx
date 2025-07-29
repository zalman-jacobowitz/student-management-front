import { MenuItem, MenuList, IconButton } from "@mui/material";

import { Iconify } from "src/components/iconify";
import { usePopover, CustomPopover } from "src/components/custom-popover";

export function PopoverActions({
  listActions = [],
}) {
  
    const popover = usePopover();
  
  return (
    <>
    <IconButton data-testid="actions-menu" onClick={popover.onOpen}>
      <Iconify icon="eva:more-vertical-fill" />
    </IconButton>
    <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          {
            listActions.map((action, index) => (
              <MenuItem
                key={index}
                onClick={()=>[action.onClick(), popover.onClose()]}
              >
                <Iconify icon={action.icon} />
                {action.label}
              </MenuItem>
            ))
          }
        </MenuList>
      </CustomPopover>
    </>
  );
}