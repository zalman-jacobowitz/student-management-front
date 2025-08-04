import { Controller, useFormContext } from 'react-hook-form';

import FormHelperText from '@mui/material/FormHelperText';

import { Upload, UploadBox, UploadAvatar } from '../upload';

// ----------------------------------------------------------------------

export function RHFUploadAvatar({ name, ...other }) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const onDrop = (acceptedFiles) => {
          const value = acceptedFiles[0];

          setValue(name, value, { shouldValidate: true });
        };

        return (
          <div>
            <UploadAvatar value={field.value} error={!!error} onDrop={onDrop} {...other} />

            {!!error && (
              <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                {error.message}
              </FormHelperText>
            )}
          </div>
        );
      }}
    />
  );
}

// ----------------------------------------------------------------------

export function RHFUploadBox({ name, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <UploadBox value={field.value} error={!!error} {...other} />
      )}
    />
  );
}

// ----------------------------------------------------------------------

export function RHFUpload({ name, multiple, helperText, ...other }) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const uploadProps = {
          multiple,
          accept: { 'image/*': [] },
          error: !!error,
          helperText: error?.message ?? helperText,
        };

        const onDrop = (acceptedFiles) => {
          const current = Array.isArray(field.value) ? field.value : [];

          if (multiple) {
            // Remove duplicates by name
            const existingNames = new Set(current.map((file) => file.name));
            const uniqueNewFiles = acceptedFiles.filter((file) => !existingNames.has(file.name));

            const value = [...current, ...uniqueNewFiles];
            setValue(name, value, { shouldValidate: true });
          } else {
            // For single uploads, just override
            setValue(name, acceptedFiles[0], { shouldValidate: true });
          }
        };

        const onRemove = (fileToRemove) => {
          if (!multiple) {
            setValue(name, null, { shouldValidate: true });
          } else {
            const updated = (field.value || []).filter((file) => file.name !== fileToRemove.name);
            setValue(name, updated, { shouldValidate: true });
          }
        };

        const onRemoveAll = () => {
          setValue(name, multiple ? [] : null, { shouldValidate: true });
        };

        return (
          <Upload
            {...uploadProps}
            value={field.value}
            onDrop={onDrop}
            onRemove={onRemove}
            onRemoveAll={onRemoveAll}
            {...other}
          />
        );
      }}
    />
  );
}
