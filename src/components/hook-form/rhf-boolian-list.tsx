import { Controller, useFormContext } from "react-hook-form";

import { Button, ListItemIcon, ListItemText, Tooltip } from "@mui/material";
import { Iconify } from "../iconify";
import { Label } from "../label";

interface RHFBoolianListProps {
  name: string;
  primary: string;
  secondary: string;
  [key: string]: any;
}

export function RHFBoolianList({ name, primary, secondary, color=null, icon=null, tooltip=null, label=null, ...other }: RHFBoolianListProps) {
  const { control } = useFormContext();

  return (
    <Controller
      key={name}
      name={name}
            control={control}
            render={({ field }) => (
              <Button
              onClick={()=>{field.onChange(!field.value)}}
              color={field.value && !color ? 'primary' : 'inherit'}
              variant={field.value && !color ? "soft" as any : "outlined"}
            >
              {icon && label &&
              <ListItemIcon>
                <Tooltip title={tooltip}>
                  <Label color={color} >
                    <Iconify icon={icon} />
                    {label}
                  </Label>
                </Tooltip>
              </ListItemIcon>

            }
              <ListItemText
                
                primary={primary}
                secondary={secondary}
                primaryTypographyProps={{ typography: 'body2' }}
                secondaryTypographyProps={{
                  component: 'span',
                  color: 'text.disabled',
                }}
                
              />
            </Button>
            )}
          />
        )
}
