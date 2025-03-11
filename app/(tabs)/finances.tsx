import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Image,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

// Dummy data for wallets
const wallets = [
  {
    id: '1',
    name: 'Emergency Fund',
    balance: 250000,
    currency: 'RWF',
    goal: 500000,
    locked: false,
    color: '#7C00FE',
  },
  {
    id: '2',
    name: 'Car Savings',
    balance: 1200000,
    currency: 'RWF',
    goal: 3000000,
    locked: true,
    lockUntil: '2024-12-31',
    color: '#FF9500',
  },
  {
    id: '3',
    name: 'Travel',
    balance: 350000,
    currency: 'RWF',
    goal: 800000,
    locked: false,
    color: '#34C759',
  },
];

// Format currency for display
const formatCurrency = (amount: number, currency: string) => {
  return `${amount.toLocaleString()} ${currency}`;
};

// Create a placeholder image component instead of using require
const EmptyWalletImage = () => {
  return (
    <View style={{
      width: 120, 
      height: 120, 
      backgroundColor: 'rgba(124, 0, 254, 0.1)',
      borderRadius: 60,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Feather name="credit-card" size={60} color="#7C00FE" />
    </View>
  );
};

export default function FinancesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('wallets'); // 'wallets' or 'insights'

  const renderWalletItem = ({ item }: { item: typeof wallets[0] }) => {
    const progress = (item.balance / item.goal) * 100;
    
    return (
      <TouchableOpacity
        style={styles.walletCard}
        onPress={() => router.push(`/wallet/${item.id}` as any)}
        activeOpacity={0.8}
      >
        <View style={styles.walletHeader}>
          <View style={[styles.walletIconContainer, { backgroundColor: `${item.color}20` }]}>
            <Feather name="briefcase" size={20} color={item.color} />
          </View>
          <View style={styles.walletHeaderRight}>
            {item.locked && (
              <View style={styles.lockedBadge}>
                <Feather name="lock" size={12} color="#FFFFFF" />
                <Text style={styles.lockedText}>Locked</Text>
              </View>
            )}
          </View>
        </View>
        
        <Text style={styles.walletName}>{item.name}</Text>
        <Text style={styles.walletBalance}>{formatCurrency(item.balance, item.currency)}</Text>
        
        <View style={styles.goalContainer}>
          <View style={styles.goalInfo}>
            <Text style={styles.goalText}>Goal: {formatCurrency(item.goal, item.currency)}</Text>
            <Text style={styles.goalPercentage}>{progress.toFixed(0)}%</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${progress}%`, backgroundColor: item.color }]} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { marginTop: insets.top }]}>
        <Text style={styles.headerTitle}>Finances</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/finances/create-wallet' as any)}
        >
          <Feather name="plus" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'wallets' && styles.activeTab]}
          onPress={() => setActiveTab('wallets')}
        >
          <Text style={[styles.tabText, activeTab === 'wallets' && styles.activeTabText]}>
            My Wallets
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'insights' && styles.activeTab]}
          onPress={() => setActiveTab('insights')}
        >
          <Text style={[styles.tabText, activeTab === 'insights' && styles.activeTabText]}>
            Insights
          </Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'wallets' ? (
        <FlatList
          data={wallets}
          renderItem={renderWalletItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.walletList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <EmptyWalletImage />
              <Text style={styles.emptyTitle}>No Wallets Yet</Text>
              <Text style={styles.emptyText}>
                Create a wallet to start saving for your goals
              </Text>
              <TouchableOpacity
                style={styles.createWalletButton}
                onPress={() => router.push('/finances/create-wallet' as any)}
              >
                <Text style={styles.createWalletText}>Create Wallet</Text>
              </TouchableOpacity>
            </View>
          }
        />
      ) : (
        <ScrollView
          style={styles.insightsContainer}
          contentContainerStyle={styles.insightsContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.insightCard}>
            <Text style={styles.insightTitle}>Spending Breakdown</Text>
            {/* Placeholder for chart */}
            <View style={styles.chartPlaceholder}>
              <Text style={styles.placeholderText}>Spending Chart</Text>
            </View>
          </View>
          
          <View style={styles.insightCard}>
            <Text style={styles.insightTitle}>Savings Progress</Text>
            {/* Placeholder for chart */}
            <View style={styles.chartPlaceholder}>
              <Text style={styles.placeholderText}>Savings Chart</Text>
            </View>
          </View>
          
          <View style={styles.insightCard}>
            <Text style={styles.insightTitle}>Monthly Budget</Text>
            {/* Placeholder for chart */}
            <View style={styles.chartPlaceholder}>
              <Text style={styles.placeholderText}>Budget Chart</Text>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#7C00FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginRight: 10,
  },
  activeTab: {
    backgroundColor: 'rgba(124, 0, 254, 0.1)',
  },
  tabText: {
    fontSize: 16,
    color: '#666666',
  },
  activeTabText: {
    fontWeight: '600',
    color: '#7C00FE',
  },
  walletList: {
    padding: 20,
    paddingBottom: 100,
  },
  walletCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
      },
    }),
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  walletIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  walletHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7C00FE',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  lockedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  walletName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  walletBalance: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
  },
  goalContainer: {
    marginTop: 8,
  },
  goalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  goalText: {
    fontSize: 12,
    color: '#666666',
  },
  goalPercentage: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7C00FE',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
  },
  createWalletButton: {
    backgroundColor: '#7C00FE',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  createWalletText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  insightsContainer: {
    flex: 1,
  },
  insightsContent: {
    padding: 20,
    paddingBottom: 100,
  },
  insightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
      },
    }),
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  chartPlaceholder: {
    height: 200,
    backgroundColor: '#F5F5F7',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999999',
  },
});