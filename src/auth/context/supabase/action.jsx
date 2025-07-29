import { paths, PATH_AFTER_LOGIN } from 'src/routes/paths';

import { supabase } from 'src/auth/supabase';
import { createInitialUser } from 'src/actions/users';

/** **************************************
 * Sign in
 *************************************** */
export const signInWithPassword = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error(error);
    throw error;
  }

  return { data, error };
};

/** **************************************
 * Sign up
 *************************************** */
export const signUp = async ({ email, password, firstName, lastName, country }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}${PATH_AFTER_LOGIN}`,
      data: { display_name: `${firstName} ${lastName}` },
    },
  });

  if (error) {
    console.error(error);
    throw error;
  }

  if (!data?.user?.identities?.length) {
    throw new Error('This user already exists');
  }

  // After successful Supabase registration, send user data to server
  try {
    await createInitialUser({
      userId: data.user.id,
      email,
      firstName,
      lastName,
      country,
    });
  } catch (serverError) {
    console.error('Server user creation failed:', serverError);
    throw new Error('Failed to create user in system. Please contact support.');
  }

  return { data, error };
};

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error(error);
    throw error;
  }

  return { error };
};

/** **************************************
 * Reset password
 *************************************** */
export const resetPassword = async ({ email }) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}${paths.auth.supabase.updatePassword}`,
  });

  if (error) {
    console.error(error);
    throw error;
  }

  return { data, error };
};

/** **************************************
 * Update password
 *************************************** */
export const updatePassword = async ({ password }) => {
  const { data, error } = await supabase.auth.updateUser({ password });

  if (error) {
    console.error(error);
    throw error;
  }

  return { data, error };
};
