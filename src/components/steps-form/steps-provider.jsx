import { useEffect } from "react";

import { Card, Container } from "@mui/material";

import { useSteps } from "src/hooks/use-stepper";

import { Form } from "src/components/hook-form";

import { InitStepper, StepperActions } from "./header-steps";
import { StepProvider } from "./style";

export function StepsProvider({steps, defaultValues, WizardSchema, onSubmit, onClose=()=>{}, watch=()=>{}, watchName=''}){
    const {
        activeStep,
        handleNext,
        handleBack,
        isSubmitting,
        handleSubmit,
        methods,
        reset
    } = useSteps(steps, defaultValues, WizardSchema);



    const watchValue = methods.watch(watchName);
    
    useEffect(() => {
      watch(methods.getValues());
    }, [watchValue, watch, methods]);
    
    const {alertHelper, component, maxWidth='sm'} = steps[activeStep];
    const submit = handleSubmit(async (data)=> {
       const result = await onSubmit(data);
       if (result) {
        handleNext();
        reset();
       }
       return result;
    }
    );
    return (
    <Card sx={{ p: 5, width: 1, mx: 'auto' }}>
      <Form methods={methods} onSubmit={submit}>
        <InitStepper steps={steps} activeStep={activeStep} />
        
        <Container maxWidth={maxWidth}>
        <StepProvider alertHelper={alertHelper}>
          {component}
        </StepProvider>
        </Container>

        <StepperActions
          steps={steps}
          activeStep={activeStep}
          handleNext={handleNext}
          handleBack={handleBack}
          isSubmitting={isSubmitting}
        />
      </Form>
    </Card>
  );
}
