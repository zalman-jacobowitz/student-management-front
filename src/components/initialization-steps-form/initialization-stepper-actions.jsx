import { Box, Fab, Stack, Tooltip, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { Iconify } from 'src/components/iconify';

/**
 * Previous Button Component
 */
function StepperButton({ onClick, children }) {
  return (
    
      <Stack alignItems="center" spacing={0.5}>
        <Fab
          color="primary"
          variant="extended"
          onClick={onClick}
        >
          {children}
        </Fab>
      </Stack>

  );
}

/**
 * Next Button Component
 */
function NextButton({ onNext }) {
  return (
    <Tooltip title="הבא">
      <Stack alignItems="center" spacing={0.5}>
        <Fab
          color="primary"
          aria-label="next"
          id="next-button"
          onClick={onNext}
          sx={{ width: 60, height: 60 }}
        >
          <Iconify icon="solar:arrow-right-bold" width={24} />
        </Fab>
        <Typography variant="caption" sx={{ textAlign: 'center' }}>
          הבא
        </Typography>
      </Stack>
    </Tooltip>
  );
}

/**
 * Save Button Component
 */
function SaveButton({ isSubmitting }) {
  return (
    <Tooltip title="שמור">
      <Stack alignItems="center" spacing={0.5}>
        <LoadingButton
          type="submit"
          variant="contained"
          loading={isSubmitting}
          sx={{
            borderRadius: '50%',
            width: 60,
            height: 60,
            minWidth: 60,
          }}
        >
          <Iconify icon="solar:check-circle-bold" width={24} />
        </LoadingButton>
        <Typography variant="caption" sx={{ textAlign: 'center' }}>
          שמור
        </Typography>
      </Stack>
    </Tooltip>
  );
}

/**
 * Complete Button Component
 */
function CompleteButton() {
  return (
    <Tooltip title="סיום">
      <Stack alignItems="center" spacing={0.5}>
        <Fab color="success" aria-label="complete" sx={{ width: 60, height: 60 }}>
          <Iconify icon="solar:check-circle-bold" width={24} />
        </Fab>
        <Typography variant="caption" sx={{ textAlign: 'center' }}>
          סיום
        </Typography>
      </Stack>
    </Tooltip>
  );
}

/**
 * Special circular button design for initialization wizard
 * Features: Circular buttons with icons and text labels
 * Fixed positioning at bottom of screen
 */
export function InitializationStepperActions({
  steps,
  activeStep,
  handleNext,
  handleBack,
  isSubmitting,
}) {
  return (
    <Box
      pr={15}
      pl={15}
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 2,
        position: 'fixed',
        bottom: { xs: 24, md: 32 },
        right: { xs: 24, md: 32 },
        left: { xs: 24, md: 32 },
        zIndex: (theme) => theme.zIndex.speedDial,
      }}
    >
      {/* Previous Button */}
      {activeStep > 0 &&
      
      <StepperButton onClick={handleBack}>
        <Iconify icon="solar:arrow-right-bold"/>
        הקודם        
      </StepperButton>
}
      
      <Box sx={{ flex: '1 1 auto' }} />

      {/* Next Button */}
      {activeStep < steps.length - 2 && <StepperButton onClick={handleNext}>
        הבא
        <Iconify icon="solar:arrow-left-bold"/>
        
        </StepperButton>
        }

      {/* Save Button */}
      {activeStep === steps.length - 2 && <SaveButton isSubmitting={isSubmitting} />}

      {/* Complete Button */}
      {activeStep === steps.length - 1 && <CompleteButton />}
    </Box>
  );
}
