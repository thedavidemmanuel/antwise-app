import React, { useState, useEffect, createContext, useContext } from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { View, ActivityIndicator, Platform } from 'react-native';
import { AppState } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { getUserDetails, hasSeenOnboarding } from '@/lib/storage';

// Keep the splash screen visible while we fetch resources
// This needs to be called at the root component level
SplashScreen.preventAutoHideAsync().catch(() => {
  /* Error hiding splash screen */ 
});

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
  const [isReturningUser, setIsReturningUser] = useState(false);
  const [hasSeenOnboardingScreen, setHasSeenOnboardingScreen] = useState(false);

  // Set up auth state listener
  useEffect(() => {
    // Skip this in SSR (server-side rendering) mode
    if (typeof window === 'undefined') {
      setInitialized(true);
      return;
    }

    // Since we want the splash screen on every reload, make sure it's prevented from hiding
    SplashScreen.preventAutoHideAsync().catch(() => {});

    // Check if user has seen onboarding
    hasSeenOnboarding().then(seen => {
      setHasSeenOnboardingScreen(seen);
    }).catch(err => {
      console.error("Error checking onboarding status:", err);
    });
    
    // Check if this is a returning user
    getUserDetails().then(details => {
      setIsReturningUser(!!details);
    }).catch(err => {
      console.error("Error checking returning user status:", err);
    });

    // Get the initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setInitialized(true);
      // Hide splash screen after initialization
      SplashScreen.hideAsync().catch(err => console.log('Error hiding splash screen:', err));
    }).catch(error => {
      console.error('Error getting session:', error);
      setInitialized(true);
      SplashScreen.hideAsync().catch(() => {});
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

  // This useEffect specifically handles app state changes to show splash on re-activating the app
  useEffect(() => {
    if (Platform.OS !== 'web') {
      const subscription = AppState.addEventListener('change', (state) => {
        if (state === 'active') {
          // When app comes back to foreground, show splash if we want it on every return
          // Note: Uncomment the next line if you want splash screen when returning to app
          // SplashScreen.preventAutoHideAsync().catch(() => {});
        }
      });
      
      return () => {
        subscription.remove();
      };
    }
  }, []);

  // Make sure any redirects use the proper route pattern based on various states
  const determineInitialRoute = () => {
    if (session) {
      return '(tabs)'; // Removed the leading slash
    } else if (isReturningUser) {
      return '(auth)/welcome-back';
    } else if (hasSeenOnboardingScreen) {
      return '(auth)/sign-in';
    } else {
      return 'index'; // Use 'index' instead of '/'
    }
  };

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
        <Stack 
          screenOptions={{ headerShown: false }}
          initialRouteName={determineInitialRoute()}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'fade' }} />
        </Stack>
      </SafeAreaProvider>
    </SessionContext.Provider>
  );
}