import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  UIManager,
  LayoutAnimation,
  Animated,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { useSession } from '@/app/_layout';
import { TransactionService, Transaction } from '@/services/TransactionService';
import { supabase } from '@/lib/supabase';
import { format, isToday, isYesterday, isThisWeek, parseISO } from 'date-fns';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Interface for our notification object
interface Notification {
  id: string;
  transaction: Transaction;
  read: boolean;
  createdAt: string;
}

export default function Notifications() {
  const { session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedNotification, setExpandedNotification] = useState<string | null>(null);

  // Fetch notifications (based on transactions)
  const fetchNotifications = async (refresh = false) => {
    if (!session?.user?.id) return;
    
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setIsLoading(true);
      }
      
      // Get all transactions
      const transactions = await TransactionService.getAllTransactions(session.user.id, 100, 0);
      
      // Get read statuses and hidden flags from notification_status table
      const { data: statusData, error: statusError } = await supabase
        .from('notification_status')
        .select('transaction_id, read, hidden')
        .eq('user_id', session.user.id);
      
      if (statusError) {
        console.error('Error fetching notification statuses:', statusError);
      }
      
      // Create a map for quick lookup
      const statusMap: Record<string, { read: boolean; hidden: boolean }> = {};
      if (statusData) {
        statusData.forEach(status => {
          statusMap[status.transaction_id] = { 
            read: status.read || false, 
            hidden: status.hidden || false 
          };
        });
      }
      
      // Convert transactions to notifications, filtering out hidden ones
      const notificationsList: Notification[] = transactions
        .filter(transaction => {
          const status = statusMap[transaction.id];
          // Skip if status exists and is marked as hidden
          return !status || !status.hidden;
        })
        .map(transaction => {
          const status = statusMap[transaction.id];
          return {
            id: transaction.id,
            transaction,
            read: status ? status.read : false,
            createdAt: transaction.created_at,
          };
        });
      
      // Sort notifications by date (newest first)
      notificationsList.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      // Use LayoutAnimation for smooth transitions when data changes
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setNotifications(notificationsList);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    fetchNotifications(true);
  }, [session]);

  // Toggle read status for a single notification
  const toggleReadStatus = async (notificationId: string, currentReadStatus: boolean) => {
    try {
      // Update locally first for immediate UI feedback
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, read: !currentReadStatus } : n
      ));
      
      // Update in Supabase
      const { error } = await supabase
        .from('notification_status')
        .upsert({
          user_id: session?.user?.id,
          transaction_id: notificationId,
          read: !currentReadStatus
        });
      
      if (error) {
        console.error('Error updating notification status:', error);
        // Show error only if it's a real database error (not RLS or permission)
        if (!error.message.includes('permission') && !error.message.includes('policy')) {
          Alert.alert(
            "Update Failed",
            "There was an error updating the notification status."
          );
          
          // Revert UI state
          setNotifications(prev => prev.map(n => 
            n.id === notificationId ? { ...n, read: currentReadStatus } : n
          ));
        }
      }
    } catch (error) {
      console.error('Exception toggling read status:', error);
      // Revert on error
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, read: currentReadStatus } : n
      ));
    }
  };

  // Delete a notification (mark as hidden)
  const deleteNotification = async (notificationId: string) => {
    // Ask for confirmation
    Alert.alert(
      "Delete Notification",
      "Are you sure you want to hide this notification?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {              
              // Update locally first for immediate UI feedback
              LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
              setNotifications(prev => prev.filter(n => n.id !== notificationId));
              
              // Update in Supabase
              const { error } = await supabase
                .from('notification_status')
                .upsert({
                  user_id: session?.user?.id,
                  transaction_id: notificationId,
                  read: true,
                  hidden: true
                });
              
              if (error) {
                console.error('Error hiding notification:', error);
                // Refresh to restore the state on error
                fetchNotifications();
              }
            } catch (error) {
              console.error('Exception deleting notification:', error);
              // Refresh to restore the state on error
              fetchNotifications();
            }
          }
        }
      ]
    );
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      // Check if there are unread notifications
      const unreadNotifications = notifications.filter(n => !n.read);
      if (unreadNotifications.length === 0) return;
      
      // Update locally first for immediate UI feedback
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      
      // Process in batches to avoid payload size issues
      const batchSize = 25;
      let allSuccessful = true;
      
      for (let i = 0; i < unreadNotifications.length; i += batchSize) {
        const batch = unreadNotifications.slice(i, i + batchSize);
        
        const { error } = await supabase
          .from('notification_status')
          .upsert(
            batch.map(n => ({
              user_id: session?.user?.id,
              transaction_id: n.id,
              read: true
            }))
          );
        
        if (error) {
          console.error(`Error in batch ${i/batchSize + 1}:`, error);
          allSuccessful = false;
        }
      }
      
      if (!allSuccessful) {
        console.warn('Some batches failed when marking all as read');
      }
    } catch (error) {
      console.error('Exception marking all as read:', error);
    }
  };

  // Mark all notifications as read when the screen is focused
  useFocusEffect(
    useCallback(() => {
      if (!session?.user?.id) return;
      
      // Only auto-mark as read if there are unread notifications
      const hasUnread = notifications.some(n => !n.read);
      if (hasUnread) {
        markAllAsRead();
      }
    }, [session, notifications])
  );

  useEffect(() => {
    fetchNotifications();
    
    // Subscribe to changes in the transactions table
    const transactionSubscription = supabase
      .channel('transaction_changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'transactions', filter: `user_id=eq.${session?.user?.id}` },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();
    
    // Subscribe to changes in the notification_status table
    const statusSubscription = supabase
      .channel('notification_status_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notification_status', filter: `user_id=eq.${session?.user?.id}` },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();
      
    return () => {
      transactionSubscription.unsubscribe();
      statusSubscription.unsubscribe();
    };
  }, [session]);

  // Get appropriate emoji and message for notification
  const getNotificationDetails = (transaction: Transaction) => {
    const isIncome = transaction.type === 'income';
    const emoji = isIncome ? '💰' : '🛍️';
    
    let message = '';
    let summary = '';
    
    if (isIncome) {
      summary = `Income from ${transaction.merchant || 'someone'}`;
      message = `You received ${TransactionService.formatAmount(transaction.amount, transaction.currency)}`;
      // Updated to access 'notes'
      if ((transaction as any).notes) {
        message += ` with note: "${(transaction as any).notes}"`;
      }
    } else {
      summary = `${transaction.merchant || 'Purchase'}`;
      message = `You spent ${TransactionService.formatAmount(transaction.amount, transaction.currency)}`;
      if (transaction.category) {
        summary += ` · ${transaction.category}`;
      }
      // Updated to access 'notes'
      if ((transaction as any).notes) {
        message += ` - ${(transaction as any).notes}`;
      }
    }
    
    return { emoji, summary, message };
  };

  // Group notifications by date
  const groupNotificationsByDate = (notifications: Notification[]) => {
    const groups: {title: string, data: Notification[]}[] = [
      { title: 'Today', data: [] },
      { title: 'Yesterday', data: [] },
      { title: 'This Week', data: [] },
      { title: 'Earlier', data: [] },
    ];
    
    notifications.forEach(notification => {
      const date = parseISO(notification.createdAt);
      if (isToday(date)) {
        groups[0].data.push(notification);
      } else if (isYesterday(date)) {
        groups[1].data.push(notification);
      } else if (isThisWeek(date)) {
        groups[2].data.push(notification);
      } else {
        groups[3].data.push(notification);
      }
    });
    
    // Remove empty groups
    return groups.filter(group => group.data.length > 0);
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => {
    const { emoji, summary, message } = getNotificationDetails(item.transaction);
    const date = format(parseISO(item.createdAt), 'h:mm a');
    const isExpanded = expandedNotification === item.id;
    
    return (
      <View style={styles.notificationContainer}>
        <TouchableOpacity
          style={[
            styles.notificationItem,
            !item.read && styles.unreadNotification,
            Platform.OS === 'ios' ? styles.iosNotificationItem : styles.androidNotificationItem
          ]}
          onPress={() => {
            if (!item.read) {
              toggleReadStatus(item.id, item.read);
            } else {
              setExpandedNotification(isExpanded ? null : item.id);
            }
          }}
          activeOpacity={0.7}
        >
          <View style={styles.notificationHeader}>
            <Text style={styles.notificationEmoji}>{emoji}</Text>
            <View style={styles.notificationHeaderText}>
              <Text style={styles.notificationSummary} numberOfLines={1}>{summary}</Text>
              <Text style={styles.notificationTime}>{date}</Text>
            </View>
            {!item.read && <View style={styles.unreadDot} />}
          </View>
          <Text 
            style={styles.notificationMessage} 
            numberOfLines={isExpanded ? undefined : 2}
          >
            {message}
          </Text>
        </TouchableOpacity>
        
        {/* Action buttons shown underneath */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.readButton]}
            onPress={() => toggleReadStatus(item.id, item.read)}
          >
            <Feather 
              name={item.read ? "eye-off" : "eye"} 
              size={16} 
              color={Platform.OS === 'ios' ? '#007AFF' : '#7C00FE'} 
            />
            <Text style={[styles.actionText, styles.readText]}>
              {item.read ? 'Mark as unread' : 'Mark as read'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => deleteNotification(item.id)}
          >
            <Feather 
              name="trash-2" 
              size={16} 
              color={Platform.OS === 'ios' ? '#FF3B30' : '#F44336'} 
            />
            <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const ListHeaderComponent = () => (
    <View style={styles.listHeader}>
      <Text style={styles.listHeaderTitle}>Notifications</Text>
      {notifications.length > 0 && notifications.some(n => !n.read) && (
        <TouchableOpacity
          style={styles.markAllReadButton}
          onPress={markAllAsRead}
        >
          <Text style={styles.markAllReadText}>Mark all as read</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderSectionHeader = ({ section }: { section: {title: string} }) => (
    <View style={styles.sectionHeaderContainer}>
      <Text style={styles.sectionHeader}>{section.title}</Text>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ListHeaderComponent />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7C00FE" />
        </View>
      </SafeAreaView>
    );
  }

  const groupedNotifications = groupNotificationsByDate(notifications);
  
  const renderListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Feather name="bell" size={50} color="#CCCCCC" />
      <Text style={styles.emptyText}>No notifications yet</Text>
      <Text style={styles.emptySubtext}>Your transaction alerts will appear here</Text>
      <TouchableOpacity
        style={styles.refreshButton}
        onPress={onRefresh}
        activeOpacity={0.7}
      >
        <Feather name="refresh-cw" size={16} color="#FFFFFF" />
        <Text style={styles.refreshButtonText}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSectionList = () => {
    const sections = groupedNotifications.map(group => ({
      title: group.title,
      data: group.data,
    }));

    return (
      <>
        {sections.map((section) => (
          <View key={section.title}>
            {renderSectionHeader({ section })}
            {section.data.map((item) => (
              <View key={item.id}>
                {renderNotificationItem({ item })}
              </View>
            ))}
          </View>
        ))}
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={notifications.length > 0 ? [1] : []}
        renderItem={() => renderSectionList()}
        keyExtractor={() => 'notifications-list'}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={renderListEmptyComponent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#7C00FE"]}
            tintColor="#7C00FE"
            progressViewOffset={10}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Platform.OS === 'ios' ? '#F2F2F7' : '#FAFAFA',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: Platform.OS === 'ios' ? '#F2F2F7' : '#FAFAFA',
  },
  listHeaderTitle: {
    fontSize: 22,
    fontWeight: Platform.OS === 'ios' ? '700' : '500',
    color: Platform.OS === 'ios' ? '#000000' : '#212121',
    letterSpacing: Platform.OS === 'ios' ? 0.35 : 0,
  },
  markAllReadButton: {
    padding: 8,
  },
  markAllReadText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7C00FE',
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
    padding: 20,
    minHeight: 400,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Platform.OS === 'ios' ? '#8E8E93' : '#757575',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: Platform.OS === 'ios' ? '#8E8E93' : '#9E9E9E',
    marginTop: 8,
    textAlign: 'center',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7C00FE',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 24,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    marginLeft: 8,
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  sectionHeaderContainer: {
    paddingVertical: 8,
    marginTop: 16,
    marginBottom: 4,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: Platform.OS === 'ios' ? '#8E8E93' : '#757575',
    textTransform: Platform.OS === 'ios' ? 'uppercase' : 'none',
    letterSpacing: Platform.OS === 'ios' ? 0.8 : 0,
  },
  notificationContainer: {
    marginVertical: 6,
  },
  notificationItem: {
    borderRadius: 12,
    padding: 16,
  },
  iosNotificationItem: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  androidNotificationItem: {
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  unreadNotification: {
    backgroundColor: Platform.OS === 'ios' 
      ? 'rgba(124, 0, 254, 0.06)' 
      : '#F1E6FF',
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  notificationEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  notificationHeaderText: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationSummary: {
    fontSize: 15,
    fontWeight: '600',
    color: Platform.OS === 'ios' ? '#000000' : '#212121',
    flex: 1,
    paddingRight: 16,
  },
  notificationMessage: {
    fontSize: 14,
    color: Platform.OS === 'ios' ? '#8E8E93' : '#757575',
    lineHeight: 20,
    marginLeft: 36, // Align with the emoji
  },
  notificationTime: {
    fontSize: 12,
    color: Platform.OS === 'ios' ? '#8E8E93' : '#9E9E9E',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#7C00FE',
    marginLeft: 4,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    marginLeft: 8,
  },
  readButton: {
    backgroundColor: Platform.OS === 'ios' ? 'rgba(0, 122, 255, 0.1)' : 'rgba(124, 0, 254, 0.1)',
  },
  deleteButton: {
    backgroundColor: Platform.OS === 'ios' ? 'rgba(255, 59, 48, 0.1)' : 'rgba(244, 67, 54, 0.1)',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  readText: {
    color: Platform.OS === 'ios' ? '#007AFF' : '#7C00FE',
  },
  deleteText: {
    color: Platform.OS === 'ios' ? '#FF3B30' : '#F44336',
  },
});