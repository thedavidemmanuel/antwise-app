import { Stack } from 'expo-router';

export default function FinancesLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'Finances'
        }}
      />
    </Stack>
  );
}