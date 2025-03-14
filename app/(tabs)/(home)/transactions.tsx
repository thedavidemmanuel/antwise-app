import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, SafeAreaView, RefreshControl } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSession } from '@/app/_layout';
import { TransactionService, Transaction } from '@/services/TransactionService';
import { supabase } from '@/lib/supabase';
import { refreshEvents } from '@/utils/refreshEvents';

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

export default function Transactions() {
  const { session } = useSession();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const pageSize = 20; // Number of transactions per page

  // Fetch all transactions with pagination
  const fetchTransactions = async (pageNum = 1, refresh = false) => {
    if (!session?.user?.id) return;
    
    try {
      if (pageNum === 1) {
        setIsLoading(true);
      }
      
      // Get all transactions with pagination
      const allTransactions = await TransactionService.getAllTransactions(
        session.user.id, 
        pageSize, 
        (pageNum - 1) * pageSize
      );
      
      if (refresh || pageNum === 1) {
        setTransactions(allTransactions);
      } else {
        setTransactions(prev => [...prev, ...allTransactions]);
      }

      // Check if we've reached the end of the data
      setHasMoreData(allTransactions.length === pageSize);
      
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
      setIsLoadingMore(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    fetchTransactions(1, true);
  }, [session]);

  const loadMoreTransactions = () => {
    if (!hasMoreData || isLoadingMore) return;
    
    setIsLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    fetchTransactions(nextPage);
  };

  useEffect(() => {
    fetchTransactions();
    
    // Add listener for the global refresh event
    const removeRefreshListener = refreshEvents.addListener(() => {
      setPage(1);
      fetchTransactions(1, true);
    });
    
    // Subscribe to changes in the transactions table
    const subscription = supabase
      .channel('transactions_full_list')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transactions', filter: `user_id=eq.${session?.user?.id}` },
        (payload) => {
          console.log('Transaction change detected:', payload);
          // Add a slight delay to ensure Supabase has processed the transaction
          setTimeout(() => {
            setPage(1);
            fetchTransactions(1, true);
          }, 500);
        }
      )
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
      removeRefreshListener();
    };
  }, [session]);

  // Render a transaction item
  const renderTransactionItem = ({ item, index }: { item: Transaction, index: number }) => (
    <View 
      style={[
        styles.transactionItem,
        index > 0 && styles.itemSpacing
      ]}
    >
      <View 
        style={[
          styles.transactionIconContainer, 
          { backgroundColor: `${getCategoryColor(item.category)}20` }
        ]}
      >
        <Feather 
          name={getCategoryIcon(item.category)} 
          size={20} 
          color={getCategoryColor(item.category)} 
        />
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionTitle}>
          {item.merchant || item.category}
        </Text>
        <Text style={styles.transactionTime}>
          {TransactionService.formatTransactionDate(item.transaction_date)}
        </Text>
      </View>
      <Text 
        style={[
          styles.transactionAmount, 
          item.type === 'income' ? styles.positiveAmount : styles.negativeAmount
        ]}
      >
        {item.type === 'income' ? '+ ' : '- '}
        {TransactionService.formatAmount(item.amount, item.currency)}
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#7C00FE" />
        <Text style={styles.loadingMoreText}>Loading more transactions...</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>All Transactions</Text>
      </View>
      
      {isLoading && page === 1 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7C00FE" />
        </View>
      ) : transactions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No transactions found</Text>
        </View>
      ) : (
        <FlatList
          data={transactions}
          renderItem={renderTransactionItem}
          keyExtractor={(item) => item.id}
          style={styles.transactionsList}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#7C00FE"]}
            />
          }
          onEndReached={loadMoreTransactions}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          maxToRenderPerBatch={10}
          windowSize={15}
          removeClippedSubviews={true}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Inter-Bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    fontFamily: 'Inter',
  },
  transactionsList: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    backgroundColor: 'rgba(124, 0, 254, 0.05)',
    borderRadius: 16,
  },
  itemSpacing: {
    marginTop: 12,
  },
  transactionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    fontFamily: 'Inter-SemiBold',
  },
  transactionTime: {
    fontSize: 14,
    color: '#999999',
    fontFamily: 'Inter',
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  negativeAmount: {
    color: '#FF3B30',
  },
  positiveAmount: {
    color: '#4CD964',
  },
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  loadingMoreText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    fontFamily: 'Inter',
  },
});