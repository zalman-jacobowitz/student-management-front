import { Suspense, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { LoadingButton } from '@mui/lab';
import { Stack, Button, Card, CardContent, CardActions } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard/main';

import { Scrollbar } from 'src/components/scrollbar';
import { Form, Field } from 'src/components/hook-form';
import { LoadingScreen } from 'src/components/loading-screen';

import { uploadImageMutation } from 'src/actions/upload-image';
import { UploadTableView } from './upload-table-view';

function UploadReports() {
  const [viewMode, setViewMode] = useState('upload'); // 'upload' or 'table'
  const [tableData, setTableData] = useState(null);
  const methods = useForm({
    defaultValues: {
      scannedReports: null,
    },
  });

  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation(uploadImageMutation({ queryClient }));

  const handleUploadSubmit = async (data) => {
    const file = data?.scannedReports;
    if (!file) {
      return;
    }

    try {
      console.log('Uploading file:', file);
      const result = await mutateAsync(file);
      console.log('Upload result:', result);
      setTableData(result); // Store the received data for table view
      setViewMode('table');
      // router.push(paths.dashboard.download);
    } catch (err) {
      console.error('Error uploading file:', file.name, err);
    }
  };
  
  if (viewMode === 'table' || tableData) {
    console.log('Rendering table with data:', tableData);
    return (
      <DashboardContent>
        <UploadTableView dataJson={tableData} />
      </DashboardContent>
    );
  }
  return (
    <DashboardContent>
      <Form methods={methods} onSubmit={methods.handleSubmit(handleUploadSubmit)}>
        <Card>
          <CardContent>
            <Scrollbar height={300}>
              <Field.Upload name="scannedReports" helperText="בחר קובץ תמונה של דוח סרוק" />
            </Scrollbar>
          </CardContent>
          <CardActions>
            <Stack direction="row" spacing={2}>
              <Button variant="contained" onClick={() => router.push(paths.dashboard.download)}>
                הורד תבנית
              </Button>

              <LoadingButton
                variant="contained"
                loading={isPending}
                type="submit"
              >
                {isPending ? 'מעלה...' : 'העלה'}
              </LoadingButton>
            </Stack>
          </CardActions>
        </Card>
      </Form>
    </DashboardContent>
  );
}

export function UploadReportsWrapper() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <UploadReports />
    </Suspense>
  );
}