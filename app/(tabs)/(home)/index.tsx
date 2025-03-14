import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useSession } from '@/app/_layout';
import { supabase } from '@/lib/supabase';
import Balance from '@/components/home/Balance';
import Shortcuts from '@/components/home/Shortcuts';
import MoneyFlow from '@/components/home/MoneyFlow';
import RecentTransactions from '@/components/home/RecentTransactions';
import LearnCard from '@/components/home/LearnCard';
import LeaderboardCard from '@/components/home/LeaderboardCard';
import { TransactionService } from '@/services/TransactionService';
import { refreshEvents } from '@/utils/refreshEvents';

const Home: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { session } = useSession();
  const [firstName, setFirstName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Function to refresh all data on the home screen
  const refreshHomeData = useCallback(async () => {
    if (!session?.user) return;
    
    setRefreshing(true);
    
    try {
      // Trigger the global refresh event for all components to refresh their data
      refreshEvents.trigger();
      
      // Fetch user profile data
      const { data: userData } = await supabase.auth.getUser();
      
      // Check if first_name is in user metadata
      if (userData?.user?.user_metadata?.first_name) {
        setFirstName(userData.user.user_metadata.first_name);
      } else {
        // If not in metadata, try fetching from profiles table
        const { data: profileData } = await supabase
          .from('profiles')
          .select('first_name')
          .eq('id', session.user.id)
          .single();
        
        if (profileData?.first_name) {
          setFirstName(profileData.first_name);
        } else {
          // Fallback to username or email
          const email = session.user.email || '';
          const username = email.split('@')[0];
          setFirstName(username);
        }
      }
    } catch (error) {
      console.error('Error refreshing home data:', error);
    } finally {
      setRefreshing(false);
      setIsLoading(false);
    }
  }, [session]);

  // Initial data fetch
  useEffect(() => {
    // Fetch user profile data when component mounts
    const fetchUserProfile = async () => {
      if (!session?.user) return;
      
      try {
        // First try to get the first name from user metadata
        const { data: userData } = await supabase.auth.getUser();
        
        // Check if first_name is in user metadata
        if (userData?.user?.user_metadata?.first_name) {
          setFirstName(userData.user.user_metadata.first_name);
          setIsLoading(false);
          return;
        }
        
        // If not in metadata, try fetching from profiles table
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('first_name')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          console.error('Error fetching user profile:', error);
          setIsLoading(false);
          return;
        }
        
        if (profileData?.first_name) {
          setFirstName(profileData.first_name);
        } else {
          // Fallback to username or email
          const email = session.user.email || '';
          const username = email.split('@')[0];
          setFirstName(username);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
    
    // Listen for transaction changes to trigger a refresh
    const transactionSubscription = supabase
      .channel('transactions_refresh')
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'transactions', 
          filter: `user_id=eq.${session?.user?.id}` 
        },
        () => {
          // Delay the refresh slightly to ensure Supabase has time to process
          setTimeout(() => refreshHomeData(), 1000);
        }
      )
      .subscribe();
    
    return () => {
      transactionSubscription.unsubscribe();
    };
  }, [session, refreshHomeData]);

  // Format greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: Math.max(16, insets.top) }
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshHomeData}
            colors={['#7C00FE']}
            tintColor="#7C00FE"
          />
        }
      >
        {/* Header */}
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
          <Balance refreshTrigger={refreshing} />
          <View style={styles.sectionSpacing}>
            <Shortcuts />
          </View>
          <View style={styles.sectionSpacing}>
            <MoneyFlow />
          </View>
          <View style={styles.sectionSpacing}>
            <RecentTransactions refreshTrigger={refreshing} />
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