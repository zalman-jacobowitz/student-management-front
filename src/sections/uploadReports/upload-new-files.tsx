import { Button, Card, LinearProgress, Stack, Typography } from "@mui/material";
import { Field, Form } from "src/components/hook-form";

export function UploadNewReports({
  methods,
  loadingOverall,
  progress,
  error,
  uploadedFiles,
  handleProcess
}) {
  return (
  <Card sx={{ p: 5, width: 1, mx: 'auto', maxWidth: 720 }}>
    <Form methods={methods} onSubmit={() => {}}>

      <Stack spacing={2}>
        <Field.Upload name="scannedReports" multiple />

            {loadingOverall && <LinearProgress variant="determinate" value={progress} />}

            {error && (
              <Typography variant="body2" color="error">
                {error}
              </Typography>
            )}
            <Button
              variant="contained"
              disabled={uploadedFiles.length === 0 || loadingOverall}
              onClick={handleProcess}
            >
              {loadingOverall ? 'מנתח את הדפים...' : 'העלה'}
            </Button>
          </Stack>
        </Form>
      </Card>
      );
}