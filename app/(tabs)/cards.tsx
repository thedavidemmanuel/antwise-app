import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const CARD_MARGIN = width * 0.075;

// Dummy data for cards
const cards = [
  {
    id: '1',
    type: 'Virtual Card',
    cardNumber: '5412 7512 3412 3456',
    expiryDate: '12/28',
    cardholderName: 'DAVID JOHNSON',
    balance: 250,
    currency: 'USD',
    color: '#7C00FE',
    logo: 'visa',
  },
  {
    id: '2',
    type: 'Physical Card',
    cardNumber: '4000 1234 5678 9010',
    expiryDate: '10/29',
    cardholderName: 'DAVID JOHNSON',
    balance: 1500000,
    currency: 'RWF',
    color: '#FF9500',
    logo: 'mastercard',
  },
];

// Dummy data for transactions
const transactions = [
  {
    id: '1',
    merchant: 'Netflix',
    date: '2023-11-15',
    amount: -14.99,
    currency: 'USD',
    category: 'Entertainment',
    icon: 'film',
  },
  {
    id: '2',
    merchant: 'Amazon',
    date: '2023-11-14',
    amount: -129.99,
    currency: 'USD',
    category: 'Shopping',
    icon: 'shopping-bag',
  },
  {
    id: '3',
    merchant: 'Spotify',
    date: '2023-11-10',
    amount: -9.99,
    currency: 'USD',
    category: 'Entertainment',
    icon: 'music',
  },
  {
    id: '4',
    merchant: 'Uber',
    date: '2023-11-08',
    amount: -24.50,
    currency: 'USD',
    category: 'Transport',
    icon: 'navigation',
  },
];

// Format card number for display (show last 4 digits)
const formatCardNumber = (cardNumber: string) => {
  const last4 = cardNumber.slice(-4);
  return `•••• ${last4}`;
};

// Format date for display
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Format currency for display
const formatCurrency = (amount: number, currency: string) => {
  return `${amount.toLocaleString()} ${currency}`;
};

export default function CardsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
    onMomentumEnd: (event) => {
      const index = Math.round(event.contentOffset.x / (CARD_WIDTH + CARD_MARGIN * 2));
      setActiveCardIndex(index);
    },
  });

  const renderCardItem = ({ item, index }: { item: typeof cards[0]; index: number }) => {
    return (
      <View 
        style={[
          styles.cardContainer,
          { marginHorizontal: CARD_MARGIN },
        ]}
      >
        <TouchableOpacity
          style={[styles.card, { backgroundColor: item.color }]}
          onPress={() => router.push(`/cards/${item.id}` as any)}
          activeOpacity={0.9}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardType}>{item.type}</Text>
          </View>
          
          <Text style={styles.cardNumber}>{formatCardNumber(item.cardNumber)}</Text>
          
          <View style={styles.cardDetails}>
            <View>
              <Text style={styles.cardDetailLabel}>CARD HOLDER</Text>
              <Text style={styles.cardDetailValue}>{item.cardholderName}</Text>
            </View>
            <View>
              <Text style={styles.cardDetailLabel}>EXPIRES</Text>
              <Text style={styles.cardDetailValue}>{item.expiryDate}</Text>
            </View>
          </View>
          
          <Text style={styles.cardBalance}>
            {formatCurrency(item.balance, item.currency)}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderTransactionItem = ({ item }: { item: typeof transactions[0] }) => (
    <TouchableOpacity
      style={styles.transactionItem}
      onPress={() => console.log('Transaction pressed:', item.id)}
    >
      <View style={styles.transactionIconContainer}>
        <Feather name={item.icon as any} size={20} color="#FFFFFF" />
      </View>
      
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionMerchant}>{item.merchant}</Text>
        <Text style={styles.transactionDate}>{formatDate(item.date)}</Text>
      </View>
      
      <Text 
        style={[
          styles.transactionAmount,
          item.amount < 0 ? styles.negativeAmount : styles.positiveAmount
        ]}
      >
        {item.amount < 0 ? '' : '+'}
        {item.amount.toFixed(2)} {item.currency}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { marginTop: insets.top }]}>
        <Text style={styles.headerTitle}>My Cards</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/cards/add' as any)} // updated cast to fix error
        >
          <Feather name="plus" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={cards}
        renderItem={renderCardItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToInterval={CARD_WIDTH + CARD_MARGIN * 2}
        decelerationRate="fast"
        contentContainerStyle={styles.cardList}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(
            e.nativeEvent.contentOffset.x / (CARD_WIDTH + CARD_MARGIN * 2)
          );
          setActiveCardIndex(index);
        }}
      />
      
      <View style={styles.cardIndicatorContainer}>
        {cards.map((_, index) => (
          <View
            key={index}
            style={[
              styles.cardIndicator,
              index === activeCardIndex && styles.activeCardIndicator
            ]}
          />
        ))}
      </View>
      
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Feather name="lock" size={20} color="#7C00FE" />
          <Text style={styles.actionButtonText}>Freeze</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Feather name="settings" size={20} color="#7C00FE" />
          <Text style={styles.actionButtonText}>Settings</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Feather name="eye" size={20} color="#7C00FE" />
          <Text style={styles.actionButtonText}>Details</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.transactionsContainer}>
        <View style={styles.transactionsHeader}>
          <Text style={styles.transactionsTitle}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => console.log('View all transactions')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={transactions}
          renderItem={renderTransactionItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
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
  cardList: {
    paddingVertical: 10,
  },
  cardContainer: {
    width: CARD_WIDTH,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    height: 200,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  cardType: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.9,
  },
  cardLogo: {
    width: 50,
    height: 30,
  },
  cardNumber: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 30,
    letterSpacing: 2,
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  cardDetailLabel: {
    color: '#FFFFFF',
    fontSize: 10,
    opacity: 0.8,
    marginBottom: 4,
  },
  cardDetailValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  cardBalance: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    alignSelf: 'flex-end',
  },
  cardIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  cardIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DDDDDD',
    marginHorizontal: 4,
  },
  activeCardIndicator: {
    backgroundColor: '#7C00FE',
    width: 16,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#333333',
    fontSize: 12,
    marginTop: 8,
  },
  transactionsContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  transactionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  viewAllText: {
    fontSize: 14,
    color: '#7C00FE',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  transactionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7C00FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionMerchant: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#666666',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  negativeAmount: {
    color: '#FF3B30',
  },
  positiveAmount: {
    color: '#34C759',
  },
});