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

  // Hide header on all auth screens and specify the initial route name
  return (
    <Stack 
      screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: '#FFFFFF' },
        animation: 'slide_from_right',
      }} 
      initialRouteName="sign-in"
    >
      <Stack.Screen name="sign-in" options={{ title: 'Sign In' }} />
      <Stack.Screen name="sign-up" options={{ title: 'Sign Up' }} />
      <Stack.Screen name="welcome-back" options={{ title: 'Welcome Back' }} />
      <Stack.Screen name="forgot-password" options={{ title: 'Forgot Password' }} />
      <Stack.Screen name="reset" options={{ title: 'Reset Password' }} />
      <Stack.Screen name="confirm" options={{ title: 'Confirm Email' }} />
    </Stack>
  );
}