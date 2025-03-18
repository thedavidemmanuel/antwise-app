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
  const url = typeof args[0] === 'string' ? args[0] : 'Request object';
  if (DEBUG) console.log(`Fetching: ${url}`);
  
  return new Promise<Response>((resolve, reject) => {
    // Increase timeout to 30 seconds for larger operations
    const timeoutId = setTimeout(() => {
      if (DEBUG) console.error('Fetch timeout exceeded (30s)');
      reject(new Error('Request timeout'));
    }, 30000);
    
    fetch(...args)
      .then(response => {
        clearTimeout(timeoutId);
        
        // Log response status
        if (DEBUG && url.includes('/rest/v1/transactions')) {
          console.log(`Transaction API response: ${response.status} ${response.statusText}`);
        }
        
        resolve(response);
      })
      .catch(error => {
        clearTimeout(timeoutId);
        console.error(`Fetch error for ${url}:`, error);
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

// Create a wrapper function for database operations that logs details
export const monitoredInsert = async (tableName: string, data: any, options: Record<string, any> = {}) => {
  console.log(`Starting insert to ${tableName} with ${Array.isArray(data) ? data.length : 1} records`);
  
  // For transactions table, log transaction_date values
  if (tableName === 'transactions' && Array.isArray(data)) {
    const problematicRecords = data.filter(item => !item.transaction_date);
    if (problematicRecords.length > 0) {
      console.warn(`Found ${problematicRecords.length} records with missing transaction_date`);
      console.warn('First problematic record:', JSON.stringify(problematicRecords[0], null, 2));
    }
    
    // Log a sample of the data being inserted
    if (data.length > 0) {
      console.log('Sample transaction data:', JSON.stringify({
        ...data[0],
        created_at: data[0].created_at ? new Date(data[0].created_at).toISOString() : null,
        transaction_date: data[0].transaction_date ? new Date(data[0].transaction_date).toISOString() : null
      }, null, 2));
    }
  }

  try {
    // Increase timeout for large transaction batches
    const startTime = Date.now();
    const result = await Promise.race([
      supabase.from(tableName).insert(data, options),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error(`Operation timed out after 30s for ${tableName}`)), 30000)
      )
    ]);
    
    const duration = Date.now() - startTime;
    console.log(`Completed ${tableName} insert in ${duration}ms`);
    
    return result;
  } catch (error: unknown) {
    console.error(`Error in ${tableName} insert:`, error);
    
    // For transaction date errors, try to fix the data
    if (error instanceof Error && 
        error.message && 
        error.message.includes('transaction_date') && 
        Array.isArray(data)) {
      console.log('Attempting to fix transaction_date values...');
      
      // Ensure all records have a transaction_date
      const fixedData = data.map(item => ({
        ...item,
        transaction_date: item.transaction_date || new Date().toISOString()
      }));
      
      console.log('Retrying with fixed transaction_date values...');
      return supabase.from(tableName).insert(fixedData, options);
    }
    
    throw error;
  }
};

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
export const REDIRECT_URL = 'https://www.antwise.app'