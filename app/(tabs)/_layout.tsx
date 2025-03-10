// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Home, Wallet, CreditCard, BookOpen, Menu } from 'lucide-react-native';
import { useAuth } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';

export default function TabsLayout() {
  const { isSignedIn } = useAuth();

  // Add authentication protection
  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 88 : 60,
          backgroundColor: '#fff',
          borderTopColor: '#E5E5E5',
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: '#7C00FE',
        tabBarInactiveTintColor: '#989898',
        tabBarLabelStyle: {
          fontFamily: Platform.select({ ios: 'Inter', android: 'Inter-Regular' }),
          fontSize: 12,
          fontWeight: '600',
        }
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name="finances"
        options={{
          title: 'Finances',
          tabBarIcon: ({ color }) => <Wallet size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name="cards"
        options={{
          title: 'Cards',
          tabBarIcon: ({ color }) => <CreditCard size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color }) => <BookOpen size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ color }) => <Menu size={24} color={color} />
        }}
      />
    </Tabs>
  );
}