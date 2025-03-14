import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator, AppState } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useSession } from '@/app/_layout';
import { TransactionService } from '@/services/TransactionService';
import { refreshEvents } from '@/utils/refreshEvents';

interface BalanceProps {
  refreshTrigger?: boolean;
}

const Balance: React.FC<BalanceProps> = ({ refreshTrigger }) => {
  const router = useRouter();
  const { session } = useSession();
  const [balance, setBalance] = useState<number | null>(null);
  const [currency, setCurrency] = useState<string>('RWF');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Format the balance for display
  const formatBalance = (amount: number | null) => {
    if (amount === null || isNaN(amount)) return '0';
    return amount.toLocaleString();
  };

  // Fetch wallet balance from Supabase
  const fetchBalance = async () => {
    if (!session?.user?.id) return;
    
    try {
      setIsLoading(true);
      
      // Use the TransactionService to get the total balance
      const balanceInfo = await TransactionService.getUserTotalBalance(session.user.id);
      // Ensure we have a valid balance or default to 0
      setBalance(balanceInfo?.balance ?? 0);
      setCurrency(balanceInfo?.currency || 'RWF');
    } catch (err) {
      console.error('Error fetching balance:', err);
      // Reset balance to zero on error to ensure we don't display stale data
      setBalance(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Subscribe to wallet changes and refresh events
  useEffect(() => {
    fetchBalance();

    // Add listener for the global refresh event
    const removeRefreshListener = refreshEvents.addListener(() => {
      fetchBalance();
    });

    // Set up subscriptions to listen for ALL relevant changes
    const subscription = supabase
      .channel('wallets_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'wallets', filter: `user_id=eq.${session?.user?.id}` },
        (payload) => {
          console.log('Wallet change detected:', payload);
          fetchBalance();
        }
      )
      .subscribe();

    // Listen for ALL transaction changes (including DELETES)
    const transactionSubscription = supabase
      .channel('transactions_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transactions', filter: `user_id=eq.${session?.user?.id}` },
        (payload) => {
          console.log('Transaction change detected:', payload);
          // Immediate refresh for accurate balance
          fetchBalance();
        }
      )
      .subscribe();

    // Add app state change listener to refresh when app comes to foreground
    const appStateSubscription = AppState ? AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        console.log('App came to foreground, refreshing balance');
        fetchBalance();
      }
    }) : null;

    return () => {
      subscription.unsubscribe();
      transactionSubscription.unsubscribe();
      removeRefreshListener();
      appStateSubscription?.remove();
    };
  }, [session]);

  // Refresh when the refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger) {
      fetchBalance();
    }
  }, [refreshTrigger]);

  const handleAccountSwitch = () => {
    console.log('Switching account...');
    // Implement account switching logic here if needed
  };

  return (
    <View style={styles.balanceCard}>
      <View style={styles.contentContainer}>
        <View style={styles.topRow}>
          <Text style={styles.totalBalanceTitle}>Total Balance</Text>
          <TouchableOpacity onPress={handleAccountSwitch} style={styles.switchButton}>
            <Feather name="chevron-down" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.balanceRow}>
          <Text style={styles.currencyText}>{currency}</Text>
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.balanceAmount}>{formatBalance(balance)}</Text>
          )}
        </View>

        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/(tabs)/(home)/add-money' as any)}
          >
            <View style={styles.iconCircle}>
              <Feather name="plus" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.actionText}>Add Money</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/(tabs)/(home)/send-money' as any)}
          >
            <View style={styles.iconCircle}>
              <Feather name="arrow-right" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.actionText}>Transfer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.92;
const CARD_HEIGHT = 140; // scaled down from 180

const styles = StyleSheet.create({
  balanceCard: {
    backgroundColor: '#7C00FE',
    borderRadius: 25,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    alignSelf: 'center',
    marginTop: 0,
    marginBottom: -5,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: -4,
    marginTop: -15,
  },
  totalBalanceTitle: {
    fontSize: 14, // scaled down from 16
    fontWeight: '500',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  switchButton: {
    padding: 8, // increased from 4 to 8 for a larger button area
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 8,
  },
  currencyText: {
    fontSize: 18, // scaled down from 20
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
  balanceAmount: {
    fontSize: 28, // scaled down from 35
    fontWeight: '600',
    color: '#FFFFFF',
  },
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 'auto',
    gap: 12, // Space between buttons
  },
  actionButton: {
    width: 140,
    height: 38, // scaled down from 45
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#7C00FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  actionText: {
    fontSize: 12, // scaled down from 14
    fontWeight: '600',
    color: '#7C00FE',
    marginLeft: 2,
  },
});

export default Balance;