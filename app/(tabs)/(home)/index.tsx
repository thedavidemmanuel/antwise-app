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
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useSession } from '@/app/_layout';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import Balance from '@/components/home/Balance';
import Shortcuts from '@/components/home/Shortcuts';
import MoneyFlow from '@/components/home/MoneyFlow';
import RecentTransactions from '@/components/home/RecentTransactions';
import LearnCard from '@/components/home/LearnCard';
import LeaderboardCard from '@/components/home/LeaderboardCard';
import Header from '@/components/home/Header';
import { TransactionService } from '@/services/TransactionService';
import { refreshEvents } from '@/utils/refreshEvents';
import { useFocusEffect } from '@react-navigation/native';

const Home: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { session } = useSession();
  const [firstName, setFirstName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [unreadNotifications, setUnreadNotifications] = useState<number>(0);
  const [showNotificationPopup, setShowNotificationPopup] = useState<boolean>(false);

  // Function to get unread notifications count
  const fetchUnreadNotificationsCount = async () => {
    if (!session?.user) return;
    
    try {
      // First get all transaction IDs
      const { data: allTransactions, error: txError } = await supabase
        .from('transactions')
        .select('id')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (txError) {
        console.error('Error fetching transactions:', txError);
        return;
      }
      
      if (!allTransactions?.length) {
        console.log('No transactions found');
        setUnreadNotifications(0);
        return;
      }
      
      // Try to get read notification statuses
      try {
        const { data: readNotifications, error } = await supabase
          .from('notification_status')
          .select('transaction_id')
          .eq('user_id', session.user.id)
          .eq('read', true);
          
        // If table doesn't exist, count all transactions as unread
        if (error && error.code === '42P01') {
          console.log('Notification status table does not exist, counting all as unread');
          setUnreadNotifications(allTransactions.length);
          return;
        }
        
        if (error) {
          console.error('Error fetching read notifications:', error);
          setUnreadNotifications(allTransactions.length);
          return;
        }
        
        // Count transactions that don't have a read status
        const readTransactionIds = new Set((readNotifications || []).map(n => n.transaction_id));
        const unreadCount = allTransactions.filter(tx => !readTransactionIds.has(tx.id)).length;
        
        console.log(`Found ${unreadCount} unread notifications out of ${allTransactions.length} total`);
        setUnreadNotifications(unreadCount);
      } catch (innerError) {
        console.error('Error processing read status:', innerError);
        setUnreadNotifications(allTransactions.length);
      }
    } catch (error) {
      console.error('Error calculating unread notifications:', error);
    }
  };

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

      // Fetch notification count
      fetchUnreadNotificationsCount();
    } catch (error) {
      console.error('Error refreshing home data:', error);
    } finally {
      setRefreshing(false);
      setIsLoading(false);
    }
  }, [session]);

  // Refresh notification count when returning to the Home screen
  useFocusEffect(
    useCallback(() => {
      if (session?.user) {
        console.log('Home screen focused, refreshing notification count');
        fetchUnreadNotificationsCount();
      }
    }, [session])
  );

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
        (payload) => {
          console.log('New transaction detected:', payload);
          
          // Immediately increment notification count for better UX
          setUnreadNotifications(prev => {
            const newCount = prev + 1;
            console.log(`Updated unread count: ${prev} -> ${newCount}`);
            return newCount;
          });
        }
      )
      .subscribe();
    
    // Also refresh when component mounts
    fetchUserProfile();
    fetchUnreadNotificationsCount();
    
    return () => {
      transactionSubscription.unsubscribe();
    };
  }, [session, refreshHomeData]);
  
  // Show notification popup when unread count changes
  useEffect(() => {
    if (unreadNotifications > 0) {
      setShowNotificationPopup(true);
    }
  }, [unreadNotifications]);
  
  // Add a separate effect to ensure notification badge updates
  useEffect(() => {
    console.log(`Rendering with ${unreadNotifications} unread notifications`);
  }, [unreadNotifications]);

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
        {/* Use the extracted Header component */}
        <Header 
          firstName={firstName} 
          isLoading={isLoading}
          unreadNotifications={unreadNotifications}
        />

        <View style={styles.content}>
          {/* Dismissible notification popup */}
          {showNotificationPopup && unreadNotifications > 0 && (
            <View style={styles.notificationPopupContainer}>
              <TouchableOpacity 
                style={styles.unreadNotificationBanner} 
                onPress={navigateToNotifications}
              >
                <Text style={styles.unreadNotificationText}>
                  You have {unreadNotifications > 99 ? '99+' : unreadNotifications} unread notification{unreadNotifications > 1 ? 's' : ''}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.dismissButton}
                onPress={() => setShowNotificationPopup(false)}
              >
                <Feather name="x" size={18} color="#FFF" />
              </TouchableOpacity>
            </View>
          )}

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
  notificationPopupContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  unreadNotificationBanner: {
    backgroundColor: '#7C00FE',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'stretch',
    paddingRight: 40,
    marginBottom: 0,
  },
  unreadNotificationText: {
    color: '#FFF',
    fontSize: 14,
    textAlign: 'center',
  },
  dismissButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: '100%',
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
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