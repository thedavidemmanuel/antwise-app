import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

// Add debug mode flag
const DEBUG = true;

// Define your Supabase URL and anon key
const SUPABASE_URL = 'https://ugkmrhjtunswnoudsrnk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVna21yaGp0dW5zd25vdWRzcm5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2NjkwMjMsImV4cCI6MjA1NzI0NTAyM30.yhmLXopb6yLrWxZuQB_JPBJjjmqP2qaAqnsXU54FMDQ';

if (DEBUG) {
  console.log('Initializing Supabase client:');
  console.log(`- URL: ${SUPABASE_URL.substring(0, 20)}...`);
  console.log(`- Key defined: ${SUPABASE_ANON_KEY ? 'Yes' : 'No'}`);
  console.log(`- Platform: ${Platform.OS}`);
}

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

// Enhanced fetch with timeout
const enhancedFetch = (...args: Parameters<typeof fetch>) => {
  if (DEBUG) console.log(`Fetching: ${args[0]}`);
  
  return new Promise<Response>((resolve, reject) => {
    // Set a timeout for the request (15 seconds)
    const timeoutId = setTimeout(() => {
      if (DEBUG) console.error('Fetch timeout exceeded (15s)');
      reject(new Error('Request timeout'));
    }, 15000);
    
    fetch(...args)
      .then(response => {
        clearTimeout(timeoutId);
        resolve(response);
      })
      .catch(error => {
        clearTimeout(timeoutId);
        console.error('Fetch error:', error);
        reject(error);
      });
  });
};

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
    global: {
      fetch: enhancedFetch as typeof fetch,
    },
    // Add request timeouts
    realtime: {
      timeout: 30000 // 30 seconds for realtime connections
    }
  }
);

// Test the Supabase connection
export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase
      .from('financial_courses')
      .select('count(*)', { count: 'exact', head: true });
    
    if (error) {
      console.error('Connection test error:', error);
      return false;
    }
    
    console.log('✅ Supabase connection successful');
    return true;
  } catch (err) {
    console.error('Connection test failed:', err);
    return false;
  }
};

// Call the test function immediately
testSupabaseConnection();

// Define the redirect URL for use in auth operations
export const REDIRECT_URL = 'antwiseapp://auth/confirm';