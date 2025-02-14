import { Stack } from 'expo-router';

export default function ScreenLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" />
      <Stack.Screen name="Finances" />
      <Stack.Screen name="Cards" />
      <Stack.Screen name="Learn" />
      <Stack.Screen name="More" />
    </Stack>
  );
}
