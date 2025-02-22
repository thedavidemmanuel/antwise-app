// app/_layout.tsx
import { Stack } from 'expo-router';
import { ClerkProvider } from '@clerk/clerk-expo';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Onboarding" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaProvider>
    </ClerkProvider>
  );
}