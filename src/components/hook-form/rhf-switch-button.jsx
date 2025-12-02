import { Controller, useFormContext } from "react-hook-form";

import { Box, alpha, Typography, ToggleButton, Grid } from "@mui/material";

import { Iconify } from "src/components/iconify";

export function RHFSwitchButton({ name, label, icon,onClick= () => {}, ...other }) {
    const { setValue, watch } = useFormContext();
    const value = watch(name) || false;

    const handleChange = () => {
      console.log(name, icon);
      setValue(name, !value, { shouldValidate: true });
    };
    
    return (
      <Grid item xs={12} sm={6} md={4} key={name}>
      <ToggleButton
        value={name}
        selected={value}
        onClick={onClick}
        onChange={handleChange}
        sx={{
          py: 1.5,
          px: 2,
          width: '100%',
          justifyContent: 'flex-start',
          ...(value && {
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
            '&:hover': {
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
            },
          }),
        }}
        {...other}
      >
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <Iconify 
            icon={icon} 
            sx={{ 
              mb: 1, 
              width: 28, 
              height: 28,
              color: value ? 'primary.main' : 'text.secondary',
            }} 
          />
          <Typography 
            variant="body2" 
            sx={{ 
              color: value ? 'primary.main' : 'text.secondary',
              fontWeight: value ? 'bold' : 'regular',
            }}
          >
            {label}
          </Typography>
        </Box>
      </ToggleButton>
      </Grid>
    );
  }
  