import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

interface HeaderProps {
  firstName: string;
  isLoading: boolean;
  unreadNotifications: number;
}

const Header: React.FC<HeaderProps> = ({ firstName, isLoading, unreadNotifications }) => {
  // Format greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const navigateToNotifications = () => {
    router.push('/(tabs)/(home)/notifications');
  };
  
  const navigateToChat = () => {
    router.push('/(tabs)/(home)/chat');
  };

  return (
    <View style={styles.header}>
      <View style={styles.greeting}>
        <View style={styles.profileIcon}>
          <Feather name="user" size={24} color="#FFF" />
        </View>  
        <Text style={styles.greetingText}>
          {isLoading ? 'Loading...' : `${getGreeting()}, ${firstName || 'there'}`}
        </Text>
      </View>
      <View style={styles.headerActions}>
        <TouchableOpacity
          onPress={navigateToChat}
          style={styles.chatButton}
        >
          <Image source={require('@/assets/images/chat-icon.png')} style={styles.chatIcon} />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={navigateToNotifications} 
          style={styles.notificationButton}
        >
          <Feather name="bell" size={24} color="#666" />
          {unreadNotifications > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationCount}>
                {unreadNotifications > 99 ? '99+' : unreadNotifications}
              </Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => console.log('Settings pressed')}
          style={styles.settingsButton}
        >
          <Feather name="settings" size={24} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#7C00FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatButton: {
    marginRight: 16,
  },
  chatIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  notificationButton: {
    position: 'relative',
    marginRight: 16,
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  notificationCount: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  settingsButton: {
    marginLeft: 16,
  },
});

export default Header;
