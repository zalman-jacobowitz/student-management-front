import { supabase } from 'src/auth/supabase';
import axios from 'axios';

const local = true; // true for local, false for production
const api = axios.create({
  baseURL: local
    ? 'http://localhost:8080/'
    : 'https://student-648757147624.europe-west1.run.app',
});

// בכל קריאה לפני שליחתה – מוסיף את ה-JWT
api.interceptors.request.use(
  async (config) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;

        // Add user info to request metadata for logging/debugging
        config.metadata = {
          userId: session.user?.id,
          userEmail: session.user?.email,
        };
      }
    } catch (error) {
      console.error('Error getting session in interceptor:', error);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration and JWT errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized request - token may be expired or JWT sub claim user does not exist');
      // Check if the error message contains JWT user not found
      const errorMessage = error.response?.data?.message || '';
      if (
        errorMessage.includes('User from sub claim') ||
        errorMessage.includes('does not exist')
      ) {
        console.warn('User session invalid: User from JWT sub claim does not exist. Signing out...');
        await supabase.auth.signOut().catch((e) => console.error('Sign out error:', e));
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Upload image to the backend server
 * @param {File} imageFile - The image file to upload
 * @returns {Promise<Object>} Response from server
 */
export async function apiUploadImage(imageFile) {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      if (
        error.message.includes('User from sub claim') ||
        error.message.includes('does not exist') ||
        error.code === 'invalid_jwt' ||
        error.status === 401
      ) {
        console.warn('User session invalid: User from JWT sub claim does not exist. Signing out...');
        await supabase.auth.signOut().catch((e) => console.error('Sign out error:', e));
      }
      console.error('Error getting user:', error);
      throw new Error('Authentication error');
    }

    if (!user) {
      throw new Error('No logged-in user');
    }

    // Create FormData to send file
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('user_id', user.id);

    // axios will automatically set the correct Content-Type with boundary for multipart/form-data
    const res = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Image uploaded successfully:', res.data);
    return res?.data ?? null;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

/**
 * Mutation hook for uploading images
 * @param {Object} options - Query client and other options
 * @returns {Object} Mutation configuration
 */
export const uploadImageMutation = ({ queryClient }) => ({
  mutationKey: ['uploadImage'],
  mutationFn: async (imageFile) => {
    console.log('Starting image upload mutation for file:', imageFile.name);
    const res = await apiUploadImage(imageFile);
    return res;
  },
  onSuccess: (data) => {
    console.log('Image upload successful:', data);
    // You can invalidate queries here if needed
    // queryClient.invalidateQueries({ queryKey: ['someKey'] });
  },
  onError: (error) => {
    console.error('Image upload failed:', error);
  },
});


