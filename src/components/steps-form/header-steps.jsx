import { Step, StepLabel, Stepper as MuiStepper } from '@mui/material';
import { CustomConnector, CustomStepIcon } from './style';
import { SpecialButtonActions } from './special-button-actions';
import { RegularButtonActions } from './regular-button-actions';

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
  
export function StepperActions({steps, activeStep, handleNext, handleBack, isSubmitting, hasSpecialButtonDesign=false}){
    
    // Use special design if enabled, otherwise use regular design
    if (hasSpecialButtonDesign) {
      return (
        <SpecialButtonActions
          steps={steps}
          activeStep={activeStep}
          handleNext={handleNext}
          handleBack={handleBack}
          isSubmitting={isSubmitting}
        />
      );
    }

    return (
      <RegularButtonActions
        steps={steps}
        activeStep={activeStep}
        handleNext={handleNext}
        handleBack={handleBack}
        isSubmitting={isSubmitting}
      />
    );
}