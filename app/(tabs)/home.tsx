import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useUser } from '@clerk/clerk-expo'; // Add this import
import Balance from '@/components/home/Balance';
import Shortcuts from '@/components/home/Shortcuts';
import MoneyFlow from '@/components/home/MoneyFlow';
import RecentTransactions from '@/components/home/RecentTransactions';
import LearnCard from '@/components/home/LearnCard';
import LeaderboardCard from '@/components/home/LeaderboardCard';

const Home: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { user } = useUser(); // Get user data from Clerk

  // Get user's first name or email for greeting
  const userName = user?.firstName || 
                  user?.fullName?.split(' ')[0] || 
                  user?.emailAddresses[0]?.emailAddress?.split('@')[0] || 
                  'there';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: Math.max(16, insets.top) }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.greeting}>
            <View style={styles.profileIcon}>
              <Feather name="user" size={24} color="#FFF" />
            </View>  
            <Text style={styles.greetingText}>Hi, {userName.toUpperCase()}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={() => console.log('Notification pressed')}>
              <Feather name="bell" size={24} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => console.log('Settings pressed')}
              style={styles.settingsButton}
            >
              <Feather name="settings" size={24} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          <Balance />
          <View style={styles.sectionSpacing}>
            <Shortcuts />
          </View>
          <View style={styles.sectionSpacing}>
            <MoneyFlow />
          </View>
          <View style={styles.sectionSpacing}>
            <RecentTransactions />
          </View>
          
          {/* Learning and Savings Leaderboard Cards Section */}
          <View style={styles.cardsContainer}>
            <LearnCard />
            <LeaderboardCard />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
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
  settingsButton: {
    marginLeft: 16,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 20 : 16,
  },
  sectionSpacing: {
    marginTop: 24,
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
});

export default Home;