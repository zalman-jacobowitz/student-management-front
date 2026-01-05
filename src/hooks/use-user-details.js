import { useState, useEffect } from 'react';

import { supabase } from 'src/auth/supabase';

export function useUserDetails() {
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUserDetails() {
      try {
        setIsLoading(true);
        
        const { data, error: supabaseError } = await supabase.auth.getUser();

        if (supabaseError) {
          // Check if the error is due to user from JWT sub claim not existing
          if (
            supabaseError.message.includes('User from sub claim') ||
            supabaseError.message.includes('does not exist') ||
            supabaseError.code === 'invalid_jwt' ||
            supabaseError.status === 401
          ) {
            console.warn('User session invalid: User from JWT sub claim does not exist. Signing out...');
            // Sign out the user and clear the session
            await supabase.auth.signOut();
            setError(new Error('יש צורך להתחבר מחדש - הפעילות שלך הסתיימה'));
          } else {
            throw supabaseError;
          }
        } else {
          setUserDetails(data.user);
        }
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserDetails();
  }, []);

  return { userDetails, isLoading, error };
}