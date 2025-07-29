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
          throw supabaseError;
        }
        setUserDetails(data.user);
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