import { Suspense, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { Stack, Button, Typography, LinearProgress } from '@mui/material';

import { readImageAsText } from 'src/utils/ocr';

import { Form, Field } from 'src/components/hook-form';
import { LoadingScreen } from 'src/components/loading-screen';

function UploadReports() {
  const [step, setStep] = useState<'upload' | 'preview'>('upload');
  const [progress, setProgress] = useState<number>(0);
  const [parsedData, setParsedData] = useState<{ fileName: string; json: any }[]>([]);

  const methods = useForm({
    defaultValues: {
      scannedReports: [],
    },
  });

  const { control, getValues } = methods;
  const uploadedFiles: File[] = useWatch({ name: 'scannedReports', control }) || [];

  const parseFileToJSON = (text: string): any => {
    const lines = text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const dateLine = lines.find((line) => line.includes('תאריך'));
    const topicLine = lines.find((line) => line.includes('נושא'));

    const date = dateLine?.split(':')[1]?.trim();
    const topic = topicLine?.split(':')[1]?.trim();

    const tableStartIndex = lines.findIndex((line) => line.includes('שם'));
    const headers = lines[tableStartIndex]?.split(/\s+/)?.reverse() ?? [];

    const data = lines.slice(tableStartIndex + 1).map((line) => {
      const values = line.split(/\s+/).reverse();
      return Object.fromEntries(headers.map((h, i) => [h, values[i]]));
    });

    return { topic, date, data };
  };

  const handleProcess = async () => {
    const files = getValues('scannedReports') || [];
    const parsed: { fileName: string; json: any }[] = [];

    await files.reduce(
      (prev, file) =>
        prev.then(async () => {
          setProgress(0);

          const text = await readImageAsText(file, (p) => setProgress(Math.round(p * 100)));
          console.log('🧾 OCR RAW TEXT:', text);
          const json = parseFileToJSON(text);

          parsed.push({ fileName: file.name, json });
        }),
      Promise.resolve()
    );

    setParsedData(parsed);
    setStep('preview');
  };

  if (step === 'preview') {
    return (
      <Stack spacing={3}>
        <Typography variant="h5">Parsed Reports</Typography>

        {parsedData.map((item, index) => (
          <Stack key={index} spacing={1}>
            <Typography variant="subtitle1">{item.fileName}</Typography>
            <pre>{JSON.stringify(item.json, null, 2)}</pre>
          </Stack>
        ))}

        <Button variant="outlined" onClick={() => setStep('upload')}>
          Back
        </Button>
      </Stack>
    );
  }

  return (
    <Form methods={methods} onSubmit={() => {}}>
      <Stack spacing={2}>
        <Field.Upload name="scannedReports" multiple helperText="בחר קבצי תמונה של דוחות סרוקים" />

        {progress > 0 && progress < 100 && (
          <LinearProgress variant="determinate" value={progress} />
        )}

        <Button variant="contained" disabled={uploadedFiles.length === 0} onClick={handleProcess}>
          Process Files
        </Button>
      </Stack>
    </Form>
  );
}

export function UploadReportsWrapper() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <UploadReports />
    </Suspense>
  );
}
