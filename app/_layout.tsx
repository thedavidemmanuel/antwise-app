import React, { useState, useEffect, createContext, useContext } from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { View, ActivityIndicator, Platform } from 'react-native';
import { AppState } from 'react-native';

// Create a context for the Supabase session
export const SessionContext = createContext<{
  session: Session | null;
  initialized: boolean;
}>({
  session: null,
  initialized: false,
});

// Custom hook to use session
export const useSession = () => useContext(SessionContext);

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Set up auth state listener
  useEffect(() => {
    // Skip this in SSR (server-side rendering) mode
    if (typeof window === 'undefined') {
      setInitialized(true);
      return;
    }

    // Get the initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setInitialized(true);
    });

    // Set up a subscription for future changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Set up auto-refresh when app state changes - only for mobile
    let subscription1: any = null;
    if (Platform.OS !== 'web') {
      subscription1 = AppState.addEventListener('change', (state) => {
        if (state === 'active') {
          supabase.auth.startAutoRefresh();
        } else {
          supabase.auth.stopAutoRefresh();
        }
      });
    }

    // Clean up the subscription when unmounting
    return () => {
      subscription?.unsubscribe();
      subscription1?.remove?.();
    };
  }, []);

  // Show a loading indicator while initializing auth
  if (!initialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#7C00FE" />
      </View>
    );
  }

  return (
    <SessionContext.Provider value={{ session, initialized }}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'fade' }} />
        </Stack>
      </SafeAreaProvider>
    </SessionContext.Provider>
  );
}