/* eslint-disable react/no-unstable-nested-components */
import * as XLSX from 'xlsx';
/* eslint-disable react/jsx-no-bind */
import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Step from '@mui/material/Step';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import MuiStepper from '@mui/material/Stepper';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { Card, Alert, Table, MenuItem, TableRow, TableBody, TableCell, TableHead, IconButton } from '@mui/material';

import { Upload } from 'src/components/upload';
import { Iconify } from 'src/components/iconify';
import { Field } from 'src/components/hook-form';
import { Scrollbar } from 'src/components/scrollbar';


export const CustomConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage: `linear-gradient( 95deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage: `linear-gradient( 95deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      height: 3,
      border: 0,
      borderRadius: 1,
      backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    },
  }));
  
  // סגנון לאייקון של כל שלב
export  const CustomStepIconRoot = styled('div')(({ theme, ownerState }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    ...(ownerState.active && {
      backgroundImage: `linear-gradient( 136deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
      boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    }),
    ...(ownerState.completed && {
      backgroundImage: `linear-gradient( 136deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
    }),
  }));
  
  
  // קומפוננטה לאייקון מותאם אישית
 export function CustomStepIcon(props) {
    const { active, completed, className, icon } = props;
  
    return (
      <CustomStepIconRoot ownerState={{ active, completed }} className={className}>
        {completed ? (
          <Iconify icon="mdi:check" width={24} />
        ) : (
          <Iconify icon={icon} width={24} />
        )}
      </CustomStepIconRoot>
    );
  }
  export const StepProvider = ({children, alertHelper={}}) => (
    <Box
    gap={3}
    display="flex"
    flexDirection="column"

    sx={{
      p: 3,
      mb: 3,
      borderRadius: 1.5,
      border: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
    }}
  >

      {alertHelper.text && (
        <Alert severity={alertHelper.color}>
            {alertHelper.text}
        </Alert>
      )}
    <Scrollbar sx={{ height: 400 }}>
      {children}
    </Scrollbar>
  </Box>
  );
  