import { useEffect } from 'react';

import { Box, Container, Alert, Stack } from '@mui/material';

import { useSteps } from 'src/hooks/use-stepper';
import { Form } from 'src/components/hook-form';
import { Scrollbar } from 'src/components/scrollbar';

import { InitializationStepper } from './initialization-stepper';
import { InitializationStepperActions } from './initialization-stepper-actions';

/**
 * Provider component for initialization wizard with special design
 * Features: Circular buttons, custom styling, video background support
 */
export function InitializationStepsProvider({
  steps,
  defaultValues,
  WizardSchema,
  onSubmit,
  onClose = () => {},
  watch = () => {},
  watchName = '',
}) {
  const { activeStep, handleNext, handleBack, isSubmitting, handleSubmit, methods, reset } =
    useSteps(steps, defaultValues, WizardSchema);

  const watchValue = methods.watch(watchName);

  useEffect(() => {
    watch(methods.getValues());
  }, [watchValue, watch, methods]);

  const { alertHelper, component, maxWidth = 'xl' } = steps[activeStep];

  const submit = handleSubmit(async (data) => {
    const result = await onSubmit(data);
    if (result) {
      handleNext();
      reset();
    }
    return result;
  });

  return (
    <Stack sx={{ p: 5, width: 1, mx: 'auto' }}>
      <Form methods={methods} onSubmit={submit}>
        <InitializationStepper steps={steps} activeStep={activeStep} />

        <Container maxWidth={maxWidth}>
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
            {alertHelper?.text && (
              <Alert severity={alertHelper.color}>{alertHelper.text}</Alert>
            )}
            <Scrollbar >
              {component}
            </Scrollbar>
          </Box>
        </Container>

        <InitializationStepperActions
          steps={steps}
          activeStep={activeStep}
          handleNext={handleNext}
          handleBack={handleBack}
          isSubmitting={isSubmitting}
        />
      </Form>
</Stack>    
  );
}
