import { Box, Button } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

/**
 * Default button design for steps
 * Features: Standard Material-UI buttons
 */
export function RegularButtonActions({
  steps,
  activeStep,
  handleNext,
  handleBack,
  isSubmitting,
}) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      {/* Previous Button */}
      {activeStep > 0 && <Button onClick={handleBack}>הקודם</Button>}

      <Box sx={{ flex: '1 1 auto' }} />

      {/* Next Button */}
      {activeStep < steps.length - 2 && (
        <Button variant="contained" id="next-button" onClick={() => handleNext()}>
          הבא
        </Button>
      )}

      {/* Save Button */}
      {activeStep === steps.length - 2 && (
        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          שמור שינויים
        </LoadingButton>
      )}

      {/* Complete Button */}
      {activeStep === steps.length - 1 && (
        <Button variant="contained">
          סיום
        </Button>
      )}
    </Box>
  );
}
