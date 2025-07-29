import { useState } from "react";

import { Fab, SvgIcon } from "@mui/material";



type ButtonGreenProps = {
  value?: number;
  sx?: object;
  onClick?: () => void;
  [key: string]: any;
}

export function ButtonGreen({ value = 90, sx, onClick, ...other }: ButtonGreenProps) {
  const [show, setShow] = useState(true);

  return (
    <Fab
      aria-label="Back to top"
      onClick={onClick}
      sx={{
        width: 48,
        height: 48,
        position: 'fixed',
        transform: 'scale(0)',
        right: { xs: 24, md: 32 },
        bottom: { xs: 24, md: 32 },
        zIndex: (theme) => theme.zIndex.speedDial,
        transition: (theme) => theme.transitions.create(['transform']),
        ...(show && { transform: 'scale(1)' }),
        ...sx,
      }}
      {...other}
    >
      <SvgIcon>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><path fill="currentColor" fillOpacity={0} strokeDasharray={20} strokeDashoffset={20} d="M12 15h2v-6h2.5l-4.5 -4.5M12 15h-2v-6h-2.5l4.5 -4.5"><animate attributeName="d" begin="0.5s" dur="1.5s" repeatCount="indefinite" values="M12 15h2v-6h2.5l-4.5 -4.5M12 15h-2v-6h-2.5l4.5 -4.5;M12 15h2v-3h2.5l-4.5 -4.5M12 15h-2v-3h-2.5l4.5 -4.5;M12 15h2v-6h2.5l-4.5 -4.5M12 15h-2v-6h-2.5l4.5 -4.5"/><animate fill="freeze" attributeName="fill-opacity" begin="0.7s" dur="0.15s" values="0;0.3"/><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="20;0"/></path><path strokeDasharray={14} strokeDashoffset={14} d="M6 19h12"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.2s" values="14;0" /></path></g>
      </SvgIcon>
    </Fab>
  );
}

