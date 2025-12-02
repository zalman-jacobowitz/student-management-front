import { paths, PATH_AFTER_LOGIN } from 'src/routes/paths';

import { supabase } from 'src/auth/supabase';



const adminUserBlank = (data) => {
  console.log(data)
  const {email, country, lastName, firstName, client, org} = data
  return {
    client,
    user: {
        email,
        country,
        lastName,
        firstName,
        org
    },
    screens: {
      "info": true,
      "insert": true,
    },
    permissions: [],
    info_students: []
  }
}

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
export const signUp = async (userData, firstUser=true) => {
  const {
    email,
    password,
    firstName,
    lastName,
    country,
    client,
    org
  } = userData
  console.log({userData})
  const blankData = firstUser ? adminUserBlank(userData) : {...userData.data, client}
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}${PATH_AFTER_LOGIN}`,
      data: {
        ...blankData,
        display_name: `${firstName} ${lastName}`
      },
    },
  });
  if (error) {
    console.error(error);
    throw error;
  }

}

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
