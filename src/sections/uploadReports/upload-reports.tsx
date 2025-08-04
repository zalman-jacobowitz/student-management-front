import { Suspense } from 'react';
import { useForm } from 'react-hook-form';

import { Form, Field } from 'src/components/hook-form';

import { LoadingScreen } from '../../components/loading-screen';

const UploadReports = () => {
  const methods = useForm({
    defaultValues: {
      'upload scenned reports': [], // or '' if not multiple
    },
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit((data) => {
    console.log({ data });
  });
  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Field.Upload name="upload scenned reports" multiple helperText="" />;
    </Form>
  );
};

export function UploadReportsWrapper() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <UploadReports />
    </Suspense>
  );
}
