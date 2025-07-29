import { paths } from 'src/routes/paths';

import { EmailInboxIcon } from 'src/assets/icons';

import { FormHead } from '../../components/form-head';
import { FormReturnLink } from '../../components/form-return-link';

// ----------------------------------------------------------------------

export function SupabaseVerifyView() {
  return (
    <>
      <FormHead
        icon={<EmailInboxIcon />}
        title="בדוק את האימייל שלך!"
        description={`שלחנו לך קוד אישור בן 6 ספרות בדוא"ל. \nאנא הזן את הקוד בתיבה למטה כדי לאמת את כתובת הדוא"ל שלך.`}
      />

      <FormReturnLink href={paths.auth.supabase.signIn} sx={{ mt: 0 }} />
    </>
  );
}
