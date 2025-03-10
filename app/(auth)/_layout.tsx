import { Redirect, Stack } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth()

  if (isSignedIn) {
    // Ensure this matches the path we're using for successful sign-in
    return <Redirect href={'/(tabs)/home'} /> 
  }

  // Hide header on all auth screens
  return <Stack screenOptions={{ headerShown: false }} />
}