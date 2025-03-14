import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHouse, faPiggyBank, faCreditCard, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { Grip } from 'lucide-react-native';
import { Redirect } from 'expo-router';
import { useSession } from '../_layout';

export default function TabsLayout() {
  const { session } = useSession();

  if (!session) {
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
        name="(home)"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesomeIcon icon={faHouse} color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="(finances)"
        options={{
          title: 'Finances',
          tabBarIcon: ({ color }) => <FontAwesomeIcon icon={faPiggyBank} color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="(cards)"
        options={{
          title: 'Cards',
          tabBarIcon: ({ color }) => <FontAwesomeIcon icon={faCreditCard} color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="(learn)"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color }) => <FontAwesomeIcon icon={faChartLine} color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="(more)"
        options={{
          title: 'More',
          tabBarIcon: ({ color }) => <Grip size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}