import { Step, StepLabel, Stepper as MuiStepper } from '@mui/material';
import { CustomConnector, CustomStepIcon } from './initialization-step-styles';

export function InitializationStepper({ steps, activeStep }) {
  const withoutComplete = steps.filter((step) => step.name !== 'complete');
  return (
    <MuiStepper
      activeStep={activeStep}
      alternativeLabel
      connector={<CustomConnector />}
      sx={{ mb: 2 }}
    >
      {withoutComplete.map((step) => (
        <Step key={step.label}>
          <StepLabel StepIconComponent={CustomStepIcon} icon={step.icon}>
            {step.label}
          </StepLabel>
        </Step>
      ))}
    </MuiStepper>
  );
}
