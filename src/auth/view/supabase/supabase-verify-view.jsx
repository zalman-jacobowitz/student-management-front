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
        description={`לחץ על כפתור האימות במייל שנשלח אליך - ותחזור למערכת`}
      />

      <FormReturnLink href={paths.auth.supabase.signIn} sx={{ mt: 0 }} />
    </>
  );
}
