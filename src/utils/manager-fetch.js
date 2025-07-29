import axios from "axios"

import { supabase } from "src/auth/supabase"

const local = true // true for local, false for production
const api = axios.create({
  baseURL: local
    ? "http://localhost:8080/"
    : "https://student-managment-878143138878.us-central1.run.app",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  }
})

// בכל קריאה לפני שליחתה – מוסיף את ה-JWT
api.interceptors.request.use(async (config) => {
  try {
    const {
      data: { session }
    } = await supabase.auth.getSession()

    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`
      
      // Add user info to request metadata for logging/debugging
      config.metadata = {
        userId: session.user?.id,
        userEmail: session.user?.email
      }
    }
  } catch (error) {
    console.error('Error getting session in interceptor:', error)
  }
  
  return config
}, (error) => Promise.reject(error))

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized request - token may be expired')
      // Optionally redirect to login or refresh token
    }
    return Promise.reject(error)
  }
)

export async function apiFetch(router, postData = {}) {
  try {
    // Get current user information
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
      console.error('Error getting user:', error)
      throw new Error("Authentication error")
    }

    if (!user) {
      throw new Error("No logged-in user")
    }

    // Add comprehensive user info to post data
    const enrichedPostData = {
      ...postData,
      user_id: user.id,           // Use user.id instead of email for better consistency
      user_email: user.email,     // Keep email if needed by backend
      timestamp: new Date().toISOString()  // Add timestamp for tracking
    }


    const response = await api.post(`/${router}`, enrichedPostData)
    

    return response
  } catch (err) {
    console.error(`API Error for ${router}:`, {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data
    })
    
    // Re-throw with more context
    throw new Error(`API call to ${router} failed: ${err.message}`)
  }
}

function changeBool(newData){
  // for base screen
  return newData.map((item) => ({...item, data: item.data? "100": "0"}))
}

export async function updateManagerData(newData, eventDetails={}){
  const fake = !true
  if (fake){
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 7000);
    });
  }
  
  try {
    const res = await apiFetch('update_manager', {
      "event": "update_table", 
      "table": 'data_students', 
      "data": changeBool(newData),
      "eventDetails": eventDetails  // Include event details for better tracking
    })
    
    return res
  } catch (error) {
    console.error('Error updating manager data:', error)
    throw error
  }
}