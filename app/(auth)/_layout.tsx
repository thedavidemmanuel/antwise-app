import { Redirect, Stack } from 'expo-router';
import { useSession } from '../_layout';

export default function AuthRoutesLayout() {
  const { session, initialized } = useSession();

  // Wait for auth to initialize before redirecting
  if (!initialized) {
    return null;
  }

  // If the user is authenticated, redirect to home
  if (session) {
    return <Redirect href={'/(tabs)/(home)'} />;
  }

  // Hide header on all auth screens
  return <Stack screenOptions={{ headerShown: false }} />;
}