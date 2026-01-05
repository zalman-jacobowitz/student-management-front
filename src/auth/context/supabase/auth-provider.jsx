import { useMemo, useEffect, useCallback } from 'react';

import { useSetState } from 'src/hooks/use-set-state';

import axios from 'src/utils/axios';

import { supabase } from 'src/auth/supabase';

import { AuthContext } from '../auth-context';

// ----------------------------------------------------------------------

export function AuthProvider({ children }) {
  const { state, setState } = useSetState({
    user: null,
    loading: true,
  });

  const checkUserSession = useCallback(async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        // Check if the error is due to user from JWT sub claim not existing
        if (
          error.message.includes('User from sub claim') ||
          error.message.includes('does not exist') ||
          error.code === 'invalid_jwt' ||
          error.status === 401 ||
          error.message.includes('error')
        ) {
          console.warn('User session invalid: User from JWT sub claim does not exist. Signing out...');
          // Sign out the user to clear the invalid session
          await supabase.auth.signOut().catch(e => console.error('Sign out error:', e));
        }
        setState({ user: null, loading: false });
        console.error(error);
        throw error;
      }

      if (session) {
        const accessToken = session?.access_token;

        setState({ user: { ...session, ...session?.user }, loading: false });
        axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      } else {
        setState({ user: null, loading: false });
        delete axios.defaults.headers.common.Authorization;
      }
    } catch (error) {
      console.error(error);
      setState({ user: null, loading: false });
    }
  }, [setState]);

  useEffect(() => {
    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user
        ? {
          ...state.user,
          id: state.user?.id,
          accessToken: state.user?.access_token,
          displayName: `${state.user?.user_metadata.display_name}`,
          role: state.user?.user_metadata?.email === state.user?.user_metadata?.client ? 'admin' : 'user',
        }
        : null,
      checkUserSession,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
    }),
    [checkUserSession, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
