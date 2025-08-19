import { Suspense, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { Stack, Button, Typography, LinearProgress, Card } from '@mui/material';

import { Form, Field } from 'src/components/hook-form';
import { LoadingScreen } from 'src/components/loading-screen';

import JsonEditorComponent from './json-editor';
import { DashboardContent } from 'src/layouts/dashboard';
import { ComponentContainer } from 'src/components/blanks/component-block';
import { Scrollbar } from 'src/components/scrollbar';
import { UploadNewReports } from './upload-new-files';

// Helper function to convert a File object to a base64 string
// This is crucial for sending image data to the Gemini API
const fileToBase64 = (file) =>
  new Promise((resolve: (value: string) => void, reject) => {
    // Added type for resolve
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Explicitly cast reader.result to string before splitting
      const base64String = reader.result as string;
      resolve(base64String.split(',')[1]); // Get only the base64 part
    };
    reader.onerror = (error) => reject(error);
  });



function useUploadReports() {
  // Custom hook for managing upload reports state
  const [step, setStep] = useState<'upload' | 'preview'>('upload');
  // מכיל את מצב ההעלאה
  const [progress, setProgress] = useState<number>(0);
  // מכיל את הנתונים המפוענחים
  const [parsedData, setParsedData] = useState<{ fileName: string; json: any }[]>([]);

  // מכיל את מצב הטעינה הכללית
  const [loadingOverall, setLoadingOverall] = useState<boolean>(false); // New state for overall loading

  // מכיל את מצב השגיאות
  const [error, setError] = useState<string>(''); // New state for error messages

  // טופס הנתונים
  const methods = useForm({
    defaultValues: {
      scannedReports: [],
    },
  });

  const { control, getValues } = methods;
  
  // מכיל את הנתונים שהתקבלו מהמסמך
  const uploadedFiles = useWatch({ name: 'scannedReports', control }) || [];

  // שליחת הפרומט עם התמונה
  const handleProcess = () => {
    // וידוא שהקובץ קיים
    const files = getValues('scannedReports') || [];
    const parsed = [];

    // אם הקובץ ריק
    if (files.length === 0) {
      setError('Please select at least one image file to process.');
      return;
    }

    // התחלת העלאה
    setLoadingOverall(true);
    setError('');
    setProgress(0);

    // פרומט
    const prompt =
      "Extract all Hebrew text and any tabular data from this image. For tables, identify headers and rows. Provide the output as a JSON object with 'document_text' for general text and a 'tables' array for structured table data. Each table in the 'tables' array should have a 'table_id', 'headers' (array of strings), and 'rows' (array of arrays of strings where the order of values in each inner array corresponds to the order of headers).";

    // הסכמה לקבלת התשובה
    const responseSchema = {
      type: 'OBJECT',
      properties: {
        document_text: {
          type: 'STRING',
          description: 'All general Hebrew text found in the image, concatenated.',
        },
        tables: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              table_id: {
                type: 'NUMBER',
                description: 'Unique identifier for the table.',
              },
              headers: {
                type: 'ARRAY',
                items: { type: 'STRING' },
                description: 'Array of table header strings.',
              },
              rows: {
                type: 'ARRAY',
                items: {
                  type: 'ARRAY',
                  items: { type: 'STRING' },
                  description:
                    'Array of table rows, where each row is an array of cell content strings.',
                },
              },
            },
            required: ['table_id', 'headers', 'rows'],
          },
          description: 'Array of extracted tables, each with headers and data rows.',
        },
      },
      required: ['document_text', 'tables'],
    };

    const totalFiles = files.length;
    let processedCount = 0;

    files
      .reduce(
        (promiseChain, file) =>
          promiseChain.then(
            () =>
              new Promise<void>((resolve) => {
                fileToBase64(file)
                  .then((base64ImageData) => {
                    const payload = {
                      contents: [
                        {
                          role: 'user',
                          parts: [
                            { text: prompt },
                            {
                              inlineData: {
                                mimeType: file.type,
                                data: base64ImageData,
                              },
                            },
                          ],
                        },
                      ],
                      generationConfig: {
                        responseMimeType: 'application/json',
                        responseSchema,
                      },
                    };

                    const apiKey = 'AIzaSyBvk38UgS65nlRn-2M2G6MqAb_HdjqfBAA';
                    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

                    console.log('Attempting API call for file:', file.name);
                    console.log('API Key value (should be populated by environment):', apiKey);

                    let retries = 0;
                    const maxRetries = 5;
                    const baseDelay = 1000;

                    // Recursive function for API call with exponential backoff
                    const makeApiCall = () =>
                      fetch(apiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                      })
                        .then((response) => {
                          if (response.status === 429) {
                            // Too Many Requests
                            const delay = baseDelay * 2 ** retries + Math.random() * 1000;
                            // eslint-disable-next-line no-plusplus
                            retries++;
                            if (retries < maxRetries) {
                              return new Promise((res) => setTimeout(res, delay)).then(makeApiCall); // Retry after delay
                            }
                            throw new Error(`Max retries exceeded for file: ${file.name}`);
                          }
                          if (!response.ok) {
                            return response.text().then((errorText) => {
                              throw new Error(
                                `API request failed with status ${response.status}: ${errorText}`
                              );
                            });
                          }
                          return response.json();
                        })
                        .then((result) => {
                          if (
                            result &&
                            result.candidates &&
                            result.candidates.length > 0 &&
                            result.candidates[0].content &&
                            result.candidates[0].content.parts &&
                            result.candidates[0].content.parts.length > 0
                          ) {
                            const jsonString = result.candidates[0].content.parts[0].text;
                            try {
                              const parsedJson = JSON.parse(jsonString);
                              console.log('🧪 Parsed JSON for', file.name, ':', parsedJson);
                              parsed.push({ fileName: file.name, json: parsedJson });
                            } catch (parseError) {
                              console.error(
                                'Failed to parse JSON response for file:',
                                file.name,
                                'Raw:',
                                jsonString,
                                parseError
                              );
                              setError(
                                `Failed to parse JSON for ${file.name}. Raw: ${jsonString.substring(0, 100)}...`
                              );
                            }
                          } else {
                            setError(`No valid response for ${file.name} from Gemini API.`);
                            console.error(
                              'Gemini API response structure unexpected for file:',
                              file.name,
                              result
                            );
                          }
                          // eslint-disable-next-line no-plusplus
                          processedCount++;
                          setProgress(Math.round((processedCount / totalFiles) * 100));
                          resolve(); // Resolve the promise for the current file
                        })
                        .catch((err) => {
                          console.error('Error processing file:', file.name, err);
                          setError(
                            `Error processing ${file.name}: ${err.message || 'An unknown error occurred.'}`
                          );
                          // eslint-disable-next-line no-plusplus
                          processedCount++; // Increment even on error to update progress
                          setProgress(Math.round((processedCount / totalFiles) * 100));
                          resolve(); // Resolve the promise even on error to continue processing other files
                        });

                    makeApiCall();
                  })
                  .catch((err) => {
                    console.error('Error converting file to base64:', file.name, err);
                    setError(
                      `Error preparing ${file.name}: ${err.message || 'An unknown error occurred.'}`
                    );
                    // eslint-disable-next-line no-plusplus
                    processedCount++;
                    setProgress(Math.round((processedCount / totalFiles) * 100));
                    resolve(); // Resolve the promise even on error
                  });
              })
          ),
        Promise.resolve()
      )
      .then(() => {
        // This block runs after all files have been processed (or attempts made)
        setParsedData(parsed);
        setStep('preview');
      })
      .catch((finalErr) => {
        // This catch handles any unhandled rejections from the promise chain
        console.error('Overall processing error:', finalErr);
        setError(`Overall processing failed: ${finalErr.message || 'An unknown error occurred.'}`);
      })
      .finally(() => {
        setLoadingOverall(false); // Ensure loading is off regardless of success or failure
      });
  };
  return {
    step,
    parsedData,
    error,
    setStep,
    methods,
    loadingOverall,
    uploadedFiles,
    handleProcess,
    progress
  };
}


export function UploadPreview({
  parsedData,
  loadingOverall,
  error,
  setStep 
}) {
      return (
      <Stack spacing={3}>
        {parsedData.length === 0 && !loadingOverall && (
          <Typography variant="body1" color="text.secondary">
            לא נתוחו דוחות בהצלחה
          </Typography>
        )}

        {parsedData?.length ? (
          <JsonEditorComponent initialParsedData={parsedData} onDataChange={undefined} />
        ) : null}
        {error && (
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        )}

        <Button variant="outlined" onClick={() => setStep('upload')}>
          חזור
        </Button>
      </Stack>
    );
  }

function UploadReports() {
  const {
    step,
    parsedData,
    error,
    setStep,
    methods,
    loadingOverall,
    uploadedFiles,
    handleProcess,
    progress
  } = useUploadReports();
 
  return (
    <ComponentContainer sx={{}}>
      {
      step === 'upload' ? 
      <UploadNewReports
          methods={methods}
          loadingOverall={loadingOverall}
          progress={progress}
          error={error}
          uploadedFiles={uploadedFiles}
          handleProcess={handleProcess}
        />
      :
      <UploadPreview
        parsedData={parsedData}
        loadingOverall={loadingOverall}
        error={error}
        setStep={setStep}
      />
      }

    </ComponentContainer>
  );
}

export function UploadReportsWrapper() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <UploadReports />
    </Suspense>
  );
}
