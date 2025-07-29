import { useEffect, useCallback } from "react";

import { Card, Box, Container } from "@mui/material";

import { useSteps } from "src/hooks/use-stepper";

import { Form } from "src/components/hook-form";

import { InitializationStepper, InitializationStepperActions } from "./initialization-header-steps";
import { InitializationStepsIconsOnly } from "./initialization-steps-icons-only";
import { InitializationStepProvider } from "./initialization-step-styles";

// Steps Handler Component
function StepsHandler({ steps, defaultValues, WizardSchema, onSubmit, watch, watchName }) {
  const {
    activeStep,
    handleNext,
    handleBack,
    isSubmitting,
    handleSubmit,
    methods,
    reset
  } = useSteps(steps, defaultValues, WizardSchema);

  // Memoize watch function to prevent effect loops
  const watchValues = methods.watch(watchName);
  
  useEffect(() => {
    if (watch && typeof watch === 'function') {
      watch(methods.getValues());
    }
  }, [watchValues, watch, methods]);
  
  const submit = useCallback(
    handleSubmit(async (data) => {
      console.log('INITIALIZATION SUBMIT: ', data);
      const result = await onSubmit(data);
      if (result) {
        handleNext();
        reset();
      }
      return result;
    }),
    [handleSubmit, onSubmit, handleNext, reset]
  );

  return {
    activeStep,
    handleNext,
    handleBack,
    isSubmitting,
    methods,
    submit,
  };
}

// Fixed Header Component
function FixedHeader({ steps, activeStep }) {
  return (
    <Box sx={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: (theme) => theme.zIndex.appBar,
      width: '100%',
      backgroundColor: 'background.default',
      borderBottom: 1,
      borderColor: 'divider',
      py: 2
    }}>
      <InitializationStepsIconsOnly steps={steps} activeStep={activeStep} />
    </Box>
  );
}

// Form Content Component
function FormContent({ component, alertHelper, isFullWidthStep }) {
  return (
    <Box sx={{ 
      flex: 1, 
      overflow: 'auto',
      pt: '80px', // Space for fixed top steps
      pb: '80px'  // Space for fixed bottom buttons
    }}>
      {isFullWidthStep ? (
        <Box sx={{ width: '100%', px: 4, mx: 2, py: 3 }}>
          <InitializationStepProvider alertHelper={alertHelper}>
            {component}
          </InitializationStepProvider>
        </Box>
      ) : (
        <Container maxWidth="md">
          <Box sx={{ p: 5, width: 1, mx: 'auto' }}>
            {component}
          </Box>
        </Container>
      )}
    </Box>
  );
}

// Fixed Footer Component
function FixedFooter({ steps, activeStep, handleNext, handleBack, isSubmitting }) {
  return (
    <Box sx={{ 
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: (theme) => theme.zIndex.appBar,
      width: '100%',
      backgroundColor: 'background.default',
      borderTop: 1,
      borderColor: 'divider',
      py: 2,
      px: 4
    }}>
      <InitializationStepperActions
        steps={steps}
        activeStep={activeStep}
        handleNext={handleNext}
        handleBack={handleBack}
        isSubmitting={isSubmitting}
      />
    </Box>
  );
}

// Icons Only Layout Component
function IconsOnlyLayout({ 
  methods, 
  submit, 
  steps, 
  activeStep, 
  component, 
  alertHelper, 
  isFullWidthStep,
  handleNext,
  handleBack,
  isSubmitting 
}) {
  return (
    <Box sx={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Form methods={methods} onSubmit={submit} sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <FixedHeader steps={steps} activeStep={activeStep} />
        <FormContent 
          component={component}
          alertHelper={alertHelper}
          isFullWidthStep={isFullWidthStep}
        />
        <FixedFooter 
          steps={steps}
          activeStep={activeStep}
          handleNext={handleNext}
          handleBack={handleBack}
          isSubmitting={isSubmitting}
        />
      </Form>
    </Box>
  );
}

// Standard Layout Component
function StandardLayout({ 
  methods, 
  submit, 
  steps, 
  activeStep, 
  component, 
  alertHelper,
  handleNext,
  handleBack,
  isSubmitting 
}) {
  return (
    <Card sx={{ p: 5, width: 1, mx: 'auto' }}>
      <Form methods={methods} onSubmit={submit}>
        <InitializationStepper steps={steps} activeStep={activeStep} />
        
        <InitializationStepProvider alertHelper={alertHelper}>
          {component}
        </InitializationStepProvider>

        <InitializationStepperActions
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

export function InitializationStepsProvider({
  steps, 
  defaultValues, 
  WizardSchema, 
  onSubmit, 
  onClose = () => {}, 
  watch = () => {}, 
  watchName = '', 
  useIconsOnly = false, 
  fullWidthSteps = []
}) {
  const {
    activeStep,
    handleNext,
    handleBack,
    isSubmitting,
    methods,
    submit,
  } = StepsHandler({ steps, defaultValues, WizardSchema, onSubmit, watch, watchName });
    
  const { alertHelper, component } = steps[activeStep];
  const currentStepName = steps[activeStep]?.name;
  const isFullWidthStep = fullWidthSteps.includes(currentStepName);
  
  if (useIconsOnly) {
    return (
      <IconsOnlyLayout
        methods={methods}
        submit={submit}
        steps={steps}
        activeStep={activeStep}
        component={component}
        alertHelper={alertHelper}
        isFullWidthStep={isFullWidthStep}
        handleNext={handleNext}
        handleBack={handleBack}
        isSubmitting={isSubmitting}
      />
    );
  }

  return (
    <StandardLayout
      methods={methods}
      submit={submit}
      steps={steps}
      activeStep={activeStep}
      component={component}
      alertHelper={alertHelper}
      handleNext={handleNext}
      handleBack={handleBack}
      isSubmitting={isSubmitting}
    />
  );
}