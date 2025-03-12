import { Stack } from 'expo-router';

export default function MoreLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'More'
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: 'Settings'
        }}
      />
      <Stack.Screen
        name="help"
        options={{
          title: 'Help & Support'
        }}
      />
      <Stack.Screen
        name="privacy"
        options={{
          title: 'Privacy & Security'
        }}
      />
      <Stack.Screen
        name="about"
        options={{
          title: 'About'
        }}
      />
    </Stack>
  );
}