import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSession } from '@/app/_layout';
import { TransactionService, Transaction } from '@/services/TransactionService';
import { supabase } from '@/lib/supabase';
import { refreshEvents } from '@/app/(tabs)/(home)/index';

// Helper function to get icon based on transaction category
const getCategoryIcon = (category: string): React.ComponentProps<typeof Feather>['name'] => {
  const categoryMap: Record<string, React.ComponentProps<typeof Feather>['name']> = {
    'Entertainment': 'film',
    'Shopping': 'shopping-bag',
    'Food': 'coffee',
    'Transport': 'navigation',
    'Deposit': 'download',
    'Transfer': 'arrow-right',
    'Withdrawal': 'arrow-up',
    'Bills': 'file-text',
    'Education': 'book',
    'Health': 'activity',
  };
  
  return categoryMap[category] || 'circle';
};

// Helper function to get color based on transaction category
const getCategoryColor = (category: string): string => {
  const colorMap: Record<string, string> = {
    'Entertainment': '#FF3B30',
    'Shopping': '#FF9500',
    'Food': '#FFCC00',
    'Transport': '#5AC8FA',
    'Deposit': '#4CD964',
    'Transfer': '#007AFF',
    'Withdrawal': '#FF3B30',
    'Bills': '#FF9500',
    'Education': '#5856D6',
    'Health': '#FF2D55',
  };
  
  return colorMap[category] || '#7C00FE';
};

interface RecentTransactionsProps {
  refreshTrigger?: boolean;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ refreshTrigger }) => {
  const router = useRouter();
  const { session } = useSession();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch recent transactions
  const fetchTransactions = async () => {
    if (!session?.user?.id) return;
    
    try {
      setIsLoading(true);
      const recentTransactions = await TransactionService.getRecentTransactions(session.user.id, 2);
      setTransactions(recentTransactions);
    } catch (err) {
      console.error('Error fetching recent transactions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    
    // Add listener for the global refresh event
    const removeRefreshListener = refreshEvents.addListener(() => {
      fetchTransactions();
    });
    
    // Subscribe to changes in the transactions table
    const subscription = supabase
      .channel('transactions_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transactions', filter: `user_id=eq.${session?.user?.id}` },
        (payload) => {
          console.log('Transaction change detected:', payload);
          // Add a slight delay to ensure Supabase has processed the transaction
          setTimeout(() => fetchTransactions(), 500);
        }
      )
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
      removeRefreshListener();
    };
  }, [session]);

  // Refresh when the refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger) {
      fetchTransactions();
    }
  }, [refreshTrigger]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Transactions</Text>
        <TouchableOpacity 
          onPress={() => router.push('/(tabs)/(home)/transactions' as any)}
          style={styles.seeAllContainer}
        >
          <Text style={styles.seeAll}>See all</Text>
          <Feather name="chevron-right" size={10} color="#7C00FE" />
        </TouchableOpacity>
      </View>
      <View style={styles.card}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#7C00FE" />
          </View>
        ) : transactions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No recent transactions</Text>
          </View>
        ) : (
          transactions.map((transaction, index) => (
            <View 
              key={transaction.id} 
              style={[
                styles.transactionItem, 
                index > 0 && styles.borderTop
              ]}
            >
              <View 
                style={[
                  styles.transactionIconContainer, 
                  { backgroundColor: `${getCategoryColor(transaction.category)}20` }
                ]}
              >
                <Feather 
                  name={getCategoryIcon(transaction.category)} 
                  size={15} 
                  color={getCategoryColor(transaction.category)} 
                />
              </View>
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionTitle}>
                  {transaction.merchant || transaction.category}
                </Text>
                <Text style={styles.transactionTime}>
                  {TransactionService.formatTransactionDate(transaction.transaction_date)}
                </Text>
              </View>
              <Text 
                style={[
                  styles.transactionAmount, 
                  transaction.type === 'income' ? styles.positiveAmount : styles.negativeAmount
                ]}
              >
                {transaction.type === 'income' ? '+ ' : '- '}
                {TransactionService.formatAmount(transaction.amount, transaction.currency)}
              </Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 5,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    fontFamily: 'Inter-SemiBold',
  },
  seeAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAll: {
    fontSize: 12,
    color: '#7C00FE',
    fontFamily: 'Inter',
  },
  card: {
    backgroundColor: 'rgba(124, 0, 254, 0.05)',
    borderRadius: 20,
    overflow: 'hidden',
    minHeight: 100,
  },
  loadingContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'Inter',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  transactionIconContainer: {
    width: 25,
    height: 25,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    fontFamily: 'Inter-SemiBold',
  },
  transactionTime: {
    fontSize: 12,
    color: '#999999',
    fontFamily: 'Inter',
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  negativeAmount: {
    color: '#FF3B30',
  },
  positiveAmount: {
    color: '#4CD964',
  },
});

export default RecentTransactions;