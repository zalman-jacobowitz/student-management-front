
import LoadingButton from '@mui/lab/LoadingButton';
import { Step, StepLabel, Stepper as MuiStepper, Box, Button, Fab, keyframes } from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { responsiveFontSizes } from 'src/theme/styles';

import { InitializationCustomConnector, InitializationCustomStepIcon } from './initialization-step-styles';

export function InitializationStepper({ steps, activeStep }) {
    const withoutComplete = steps.filter(step => step.name !== 'complete');
    return (
      <MuiStepper 
        activeStep={activeStep} 
        alternativeLabel 
        connector={<InitializationCustomConnector />} 
        sx={{ 
          mb: { sm: 1, md: 1.5, lg: 2 }
        }}
      >
        {withoutComplete.map((step, index) => (
          <Step key={step.label}>
            <StepLabel StepIconComponent={InitializationCustomStepIcon} icon={step.icon}>
              <Box sx={{ ...responsiveFontSizes({ sm: 12, md: 13, lg: 14 }) }}>
                {step.label}
              </Box>
            </StepLabel>
          </Step>
        ))}
      </MuiStepper>
    );
  }
  
// Animation keyframes for initialization-specific styling
const pulseGlow = keyframes`
  0% {
    box-shadow: 0 0 5px rgba(25, 118, 210, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(25, 118, 210, 0.8), 0 0 30px rgba(25, 118, 210, 0.6);
  }
  100% {
    box-shadow: 0 0 5px rgba(25, 118, 210, 0.5);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-3px);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: 200px 0;
  }
`;

export function InitializationStepperActions({steps, activeStep, handleNext, handleBack, isSubmitting}){
    const buttonBaseStyles = {
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '50px',
      px: { sm: 2, md: 3, lg: 4 },
      py: { sm: 1, md: 1.25, lg: 1.5 },
      minWidth: { sm: 100, md: 110, lg: 120 },
      fontWeight: 600,
      fontSize: { sm: '0.813rem', md: '0.875rem', lg: '0.95rem' },
      textTransform: 'none',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        transform: 'translateY(-2px) scale(1.02)',
        animation: `${float} 2s ease-in-out infinite`,
      },
      '&:active': {
        transform: 'translateY(0px) scale(0.98)',
      },
      '&:before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: '-100%',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
        transition: 'left 0.5s',
      },
      '&:hover:before': {
        left: '100%',
      }
    };

    const primaryButtonStyles = {
      ...buttonBaseStyles,
      background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 50%, #1976d2 100%)',
      backgroundSize: '200% 200%',
      color: 'white',
      boxShadow: '0 4px 15px 0 rgba(25, 118, 210, 0.4)',
      animation: `${pulseGlow} 3s ease-in-out infinite`,
      '&:hover': {
        ...buttonBaseStyles['&:hover'],
        backgroundPosition: 'right center',
        boxShadow: '0 6px 20px 0 rgba(25, 118, 210, 0.6)',
      },
    };

    const secondaryButtonStyles = {
      ...buttonBaseStyles,
      background: 'transparent',
      color: '#666',
      border: '2px solid #e0e0e0',
      boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)',
      '&:hover': {
        ...buttonBaseStyles['&:hover'],
        background: 'rgba(0,0,0,0.04)',
        borderColor: '#bdbdbd',
        color: '#424242',
        boxShadow: '0 4px 12px 0 rgba(0,0,0,0.12)',
      },
    };

    const fabStyles = {
      width: { sm: 48, md: 52, lg: 56 },
      height: { sm: 48, md: 52, lg: 56 },
      background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
      color: 'white',
      boxShadow: '0 4px 15px 0 rgba(76, 175, 80, 0.4)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      animation: `${float} 3s ease-in-out infinite`,
      '&:hover': {
        transform: 'scale(1.1) rotate(5deg)',
        boxShadow: '0 6px 20px 0 rgba(76, 175, 80, 0.6)',
        background: 'linear-gradient(135deg, #66bb6a 0%, #4caf50 100%)',
      },
    };

    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        gap: { sm: 1, md: 1.5, lg: 2 },
        px: { sm: 1.5, md: 3, lg: 6 },
        py: { sm: 1, md: 1.5, lg: 2 },
        maxWidth: '1200px',
        mx: 'auto',
        flexWrap: { sm: 'wrap', md: 'nowrap', lg: 'nowrap' },
        width: '100%'
      }}>
        {/* Back Button */}
        {activeStep > 0 && (
          <Button 
            onClick={handleBack}
            startIcon={<Iconify icon="solar:arrow-right-bold" sx={{ transform: 'rotate(180deg)' }} />}
            sx={secondaryButtonStyles}
          >
            הקודם
          </Button>
        )}
        
        <Box sx={{ flex: '1 1 auto' }} />
        
        {/* Next Button */}
        {activeStep < steps.length - 2 && (
          <Button 
            variant="contained" 
            onClick={() => handleNext()}
            endIcon={<Iconify icon="solar:arrow-left-bold" />}
            sx={primaryButtonStyles}
          >
            הבא
          </Button>
        )}
        
        {/* Save Button */}
        {activeStep === steps.length - 2 && (
          <LoadingButton 
            type="submit" 
            variant="contained" 
            loading={isSubmitting}
            loadingPosition="end"
            endIcon={<Iconify icon="solar:diskette-bold" />}
            sx={primaryButtonStyles}
          >
            שמור שינויים
          </LoadingButton>
        )}
        
        {/* Finish Button */}
        {activeStep === steps.length - 1 && (
          <Fab
            sx={fabStyles}
          >
            <Iconify 
              icon="solar:check-circle-bold" 
              width={{ sm: 24, md: 26, lg: 28 }}
              height={{ sm: 24, md: 26, lg: 28 }}
            />
          </Fab>
        )}
      </Box>
    );
}