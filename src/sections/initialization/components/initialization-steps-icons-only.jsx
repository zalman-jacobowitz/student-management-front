import { Step, StepLabel, Stepper as MuiStepper } from '@mui/material';
import { InitializationCustomConnector, InitializationCustomStepIcon } from './initialization-step-styles';

export function InitializationStepsIconsOnly({ steps, activeStep, sx = {} }) {
  const withoutComplete = steps.filter(step => step.name !== 'complete');
  
  return (
    <MuiStepper 
      activeStep={activeStep} 
      alternativeLabel 
      connector={<InitializationCustomConnector />} 
      sx={sx}
    >
      {withoutComplete.map((step, index) => (
        <Step key={step.label}>
          <StepLabel StepIconComponent={InitializationCustomStepIcon} icon={step.icon}>
            {step.label}
          </StepLabel>
        </Step>
      ))}
    </MuiStepper>
  );
}