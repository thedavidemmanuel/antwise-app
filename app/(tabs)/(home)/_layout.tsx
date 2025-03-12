import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'Home'
        }}
      />
      <Stack.Screen
        name="add-money"
        options={{
          title: 'Add Money',
          presentation: 'modal'
        }}
      />
      <Stack.Screen
        name="send-money"
        options={{
          title: 'Send Money'
        }}
      />
      <Stack.Screen
        name="transactions"
        options={{
          title: 'Transactions'
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          title: 'Notifications'
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          title: 'Profile'
        }}
      />
    </Stack>
  );
}