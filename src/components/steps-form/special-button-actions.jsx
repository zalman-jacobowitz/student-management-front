import { Box, Button, Fab, Stack, Tooltip, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { Iconify } from 'src/components/iconify';

/**
 * Special button design for initialization wizard
 * Features: Circular buttons with icons and labels
 */
export function SpecialButtonActions({
  steps,
  activeStep,
  handleNext,
  handleBack,
  isSubmitting,
}) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
      {/* Previous Button */}
      {activeStep > 0 && (
        <Tooltip title="הקודם">
          <Button variant='contained' sx={{
            borderRadius: 7,
            p: 2,
            spacing: 1
          }} color='primary' alignItems="center" spacing={0.5} onClick={handleBack}>
            <Iconify icon="solar:arrow-left-bold" width={24} />
            <Typography variant="h6" sx={{ textAlign: 'center' }}>
              הקודם
            </Typography>
          </Button>
        </Tooltip>
      )}
      <Box sx={{ flex: '1 1 auto' }} />

      {/* Next Button */}
      {activeStep < steps.length - 2 && (
        <Tooltip title="הבא">
<Button variant='contained' sx={{
            borderRadius: 7,
            p: 2,
            spacing: 1
          }} color='primary' alignItems="center" spacing={0.5} onClick={handleNext}>
            <Iconify icon="solar:arrow-left-bold" width={24} />
            <Typography variant="h6" sx={{ textAlign: 'center' }}>
              הבא
            </Typography>
          </Button>
        </Tooltip>
      )}

      {/* Save Button */}
      {activeStep === steps.length - 2 && (
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
      )}

      {/* Complete Button */}
      {activeStep === steps.length - 1 && (
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
      )}
    </Box>
  );
}
