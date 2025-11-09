import { useState } from "react";

import { Fab, SvgIcon } from "@mui/material";
import { Iconify } from "../iconify";



type ButtonGreenProps = {
  value?: number;
  sx?: object;
  onClick?: () => void;
  [key: string]: any;
}

export function ButtonGreen({ number=0, value = 90,icon="solar:arrow-up-bold", sx, onClick, variant, text='', ...other }: ButtonGreenProps) {
  const [show, setShow] = useState(true);

  return (
    <Fab
      aria-label="Back to top"
      onClick={onClick}
      variant={variant || 'circular'}
      sx={{

        position: 'fixed',
        transform: 'scale(0)',
        right: { xs: 24, md: 32 + (60 * number)},
        bottom: { xs: 24, md: 32 },
        zIndex: (theme) => theme.zIndex.speedDial,
        transition: (theme) => theme.transitions.create(['transform']),
        ...(show && { transform: 'scale(1)' }),
        ...sx,
      }}
      {...other}
    >
      {text}
      <Iconify icon={icon} width={24} />
    </Fab>
  );
}

