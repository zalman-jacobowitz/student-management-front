import { Step, StepLabel, Stepper as MuiStepper, Box, Button } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { CustomConnector, CustomStepIcon } from './style';

export function InitStepper({ steps, activeStep }) {
    const withoutComplete = steps.filter(step => step.name !== 'complete');
    return (
      <MuiStepper activeStep={activeStep} alternativeLabel connector={<CustomConnector />} sx={{ mb: 2 }}>
        {withoutComplete.map((step, index) => (
          <Step key={step.label}>
            <StepLabel StepIconComponent={CustomStepIcon} icon={step.icon} >
             {step.label}
            </StepLabel>
          </Step>
        ))}
      </MuiStepper>
    );
  }
  
export function StepperActions({steps, activeStep, handleNext, handleBack, isSubmitting}){
    return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
    {activeStep > 0 && <Button onClick={handleBack}>הקודם</Button>}
    <Box sx={{ flex: '1 1 auto' }} />
        {activeStep < steps.length - 2 && (
          <Button variant="contained" onClick={() => handleNext()}>
            הבא
          </Button>
        )}
        {activeStep === steps.length - 2 && (
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            שמור שינויים
          </LoadingButton>
        )}
        {activeStep === steps.length - 1 && (
          <Button variant="contained">
            סיום
          </Button>
        )}
      </Box>)
}