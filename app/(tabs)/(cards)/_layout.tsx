import { Stack } from 'expo-router';

export default function CardsLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'Cards'
        }}
      />
      <Stack.Screen
        name="card-details"
        options={{
          title: 'Card Details'
        }}
      />
      <Stack.Screen
        name="add-card"
        options={{
          title: 'Add New Card',
          presentation: 'modal'
        }}
      />
      <Stack.Screen
        name="card-settings"
        options={{
          title: 'Card Settings'
        }}
      />
    </Stack>
  );
}