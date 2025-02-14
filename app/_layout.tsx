import React from 'react';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="OnboardingScreen" />
      <Stack.Screen name="screens" />
      <Stack.Screen name="auth" />
    </Stack>
  );
}