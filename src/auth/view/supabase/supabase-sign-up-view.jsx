import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { signUp } from '../../context/supabase';
import { FormHead } from '../../components/form-head';
import { SignUpTerms } from '../../components/sign-up-terms';

// ----------------------------------------------------------------------

export const SignUpSchema = zod.object({
  firstName: zod.string().min(1, { message: 'שם פרטי נדרש!' }),
  lastName: zod.string().min(1, { message: 'שם משפחה נדרש!' }),
  email: zod
    .string()
    .min(1, { message: 'דוא"ל נדרש!' })
    .email({ message: 'יש להזין כתובת דוא"ל תקינה!' }),
  password: zod
    .string()
    .min(1, { message: 'סיסמה נדרשת!' })
    .min(6, { message: 'הסיסמה חייבת להכיל לפחות 6 תווים!' }),
  country: zod.string().min(1, { message: 'מדינה נדרשת!' }),
});

// ----------------------------------------------------------------------

export function SupabaseSignUpView() {
  const [errorMsg, setErrorMsg] = useState('');

  const router = useRouter();

  const password = useBoolean();

  const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    country: '',
  };

  const methods = useForm({
    resolver: zodResolver(SignUpSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await signUp({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        country: data.country,
      });

      router.push(paths.auth.supabase.verify);
    } catch (error) {
      console.error(error);
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  const renderForm = (
    <Box gap={3} display="flex" flexDirection="column">
      <Box display="flex" gap={{ xs: 3, sm: 2 }} flexDirection={{ xs: 'column', sm: 'row' }}>
        <Field.Text name="firstName" label="שם פרטי" InputLabelProps={{ shrink: true }} />
        <Field.Text name="lastName" label="שם משפחה" InputLabelProps={{ shrink: true }} />
      </Box>

      <Field.Text name="email" label="כתובת דוא״ל" InputLabelProps={{ shrink: true }} />

      <Field.CountrySelect name="country" label="מדינה" InputLabelProps={{ shrink: true }} />

      <Field.Text
        name="password"
        label="סיסמה"
        placeholder="לפחות 6 תווים"
        type={password.value ? 'text' : 'password'}
        InputLabelProps={{ shrink: true }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="יוצר חשבון..."
      >
        צור חשבון
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <FormHead
        title="התחבר בחינם"
        description={
          <>
            {`כבר יש לך חשבון? `}
            <Link component={RouterLink} href={paths.auth.supabase.signIn} variant="subtitle2">
              התחבר
            </Link>
          </>
        }
        sx={{ textAlign: { xs: 'center', md: 'left' } }}
      />

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>

      <SignUpTerms />
    </>
  );
}
