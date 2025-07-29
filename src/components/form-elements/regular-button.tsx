import React from "react";

import { Button } from "@mui/material";

import { Iconify } from "src/components/iconify";

interface RegularButtonProps {
  onClick?: () => void;
  icon?: string;
  children: React.ReactNode;
}

export function RegularButton({onClick, icon, children}: RegularButtonProps){
    return (
      <Button onClick={onClick}>
          {children}
        {icon && <Iconify icon={icon as any} sx={{ ml: 1 }} />}
      </Button>
    );
  }