import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import { Platform } from 'react-native'
// Remove the @env import since we're defining these constants directly below
// import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';

// Define your Supabase URL and anon key directly
const SUPABASE_URL = 'https://ugkmrhjtunswnoudsrnk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVna21yaGp0dW5zd25vdWRzcm5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2NjkwMjMsImV4cCI6MjA1NzI0NTAyM30.yhmLXopb6yLrWxZuQB_JPBJjjmqP2qaAqnsXU54FMDQ';

// Create a custom storage adapter that works in non-browser environments
const customStorage = {
  getItem: async (key: string) => {
    try {
      if (Platform.OS === 'web') {
        // In web environments
        if (typeof localStorage !== 'undefined') {
          return localStorage.getItem(key)
        }
        return null // SSR or non-browser environments
      } else {
        return await AsyncStorage.getItem(key)
      }
    } catch (error) {
      console.error('Error getting item from storage', error)
      return null
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      if (Platform.OS === 'web') {
        // In web environments
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(key, value)
          return
        }
        // SSR or non-browser environments (do nothing)
      } else {
        await AsyncStorage.setItem(key, value)
      }
    } catch (error) {
      console.error('Error setting item in storage', error)
    }
  },
  removeItem: async (key: string) => {
    try {
      if (Platform.OS === 'web') {
        // In web environments
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem(key)
          return
        }
        // SSR or non-browser environments (do nothing)
      } else {
        await AsyncStorage.removeItem(key)
      }
    } catch (error) {
      console.error('Error removing item from storage', error)
    }
  },
}

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      storage: customStorage as any,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: Platform.OS === 'web',
      flowType: 'pkce',
    },
  }
);

// Define the redirect URL for use in auth operations
export const REDIRECT_URL = 'antwiseapp://auth/confirm'