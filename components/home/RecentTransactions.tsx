import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

const RecentTransactions: React.FC = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Transactions</Text>
        <TouchableOpacity 
          onPress={() => router.push('/transactions' as any)}
          style={styles.seeAllContainer}
        >
          <Text style={styles.seeAll}>See all</Text>
          <Feather name="chevron-right" size={10} color="#7C00FE" />
        </TouchableOpacity>
      </View>
      <View style={styles.card}>
        <View style={styles.transactionItem}>
          <View style={[styles.transactionIconContainer, { backgroundColor: 'rgba(255, 59, 48, 0.2)' }]}>
            <Feather name="film" size={15} color="#FF3B30" />
          </View>
          <View style={styles.transactionDetails}>
            <Text style={styles.transactionTitle}>Netflix Subscription</Text>
            <Text style={styles.transactionTime}>Today, 2:30 PM</Text>
          </View>
          <Text style={[styles.transactionAmount, styles.negativeAmount]}>
            - RWF 21,040.38
          </Text>
        </View>
        <View style={[styles.transactionItem, styles.borderTop]}>
          <View style={[styles.transactionIconContainer, { backgroundColor: 'rgba(76, 217, 100, 0.2)' }]}>
            <Feather name="download" size={15} color="#4CD964" />
          </View>
          <View style={styles.transactionDetails}>
            <Text style={styles.transactionTitle}>
              Received from Jeff, Dauda
            </Text>
            <Text style={styles.transactionTime}>Yesterday, 8:06 PM</Text>
          </View>
          <Text style={[styles.transactionAmount, styles.positiveAmount]}>
            + RWF 150,000
          </Text>
        </View>
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