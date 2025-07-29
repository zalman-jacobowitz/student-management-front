import { Step, StepLabel, Stepper as MuiStepper } from '@mui/material';
import { CustomConnector, CustomStepIcon } from './style';

export function StepsIconsOnly({ steps, activeStep, sx = {} }) {
  const withoutComplete = steps.filter(step => step.name !== 'complete');
  
  return (
    <MuiStepper 
      activeStep={activeStep} 
      alternativeLabel 
      connector={<CustomConnector />} 
      sx={sx}
    >
      {withoutComplete.map((step, index) => (
        <Step key={step.label}>
          <StepLabel StepIconComponent={CustomStepIcon} icon={step.icon}>
            {step.label}
          </StepLabel>
        </Step>
      ))}
    </MuiStepper>
  );
}