/* eslint-disable react/no-unstable-nested-components */
import * as XLSX from 'xlsx';
/* eslint-disable react/jsx-no-bind */
import { useState, useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Step from '@mui/material/Step';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Card, Alert, MenuItem } from '@mui/material';

import { SingleFilePreview, Upload } from 'src/components/upload';
import { Iconify } from 'src/components/iconify';
import { Field } from 'src/components/hook-form';
import { readFile } from 'src/utils/files/read-file';
import { toast } from 'sonner';



// ----------------------------------------------------------------------




export function ExportDetails({ columnsList = [], fields = [] }) {

  
  
  return (
    <Stack spacing={2}>
      {fields.map((field, index) => {
        const Component = field.component;
        return (
          <Component
            key={index}
            name={field.name}
            label={field.label}
            variant={field.variant}
            InputLabelProps={field.InputLabelProps}
            type={field.type}
          >
            {columnsList.map((column) => <MenuItem key={column.name} value={column.name}>{column.label}</MenuItem>)}
          </Component>
        );
      })}
    </Stack>
  );
}

export function CompleteStep({ onReset }) {
  return (
    <Box
      gap={5}
      display="flex"
      alignItems="center"
      flexDirection="column"
      justifyContent="center"
      sx={{ borderRadius: 'inherit', bgcolor: 'background.neutral', p: 5 }}
    >
      <Typography variant="h6">השלמת את כל השלבים - כעת המערכת מוכנה!</Typography>

      <Button
        sx={{ mt: 2 }}
        variant="outlined"
        onClick={onReset}
        startIcon={<Iconify icon="solar:restart-bold" />}
      >
        העלאה מחדש
      </Button>
    </Box>
  );
}