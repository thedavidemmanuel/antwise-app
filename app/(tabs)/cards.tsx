import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedScrollHandler,
  interpolateColor,
  useAnimatedStyle,
  interpolate,
  withSpring,
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
    // Use a more general type for the gradient colors to avoid type errors
    let gradientColors: [string, string] = ['#7C00FE', '#5C00BE']; // Default purple gradient
    
    if (item.color === '#FF9500') {
      gradientColors = ['#FF9500', '#F76B1C'] as [string, string]; // Orange gradient
    } else if (item.color === '#34C759') {
      gradientColors = ['#34C759', '#2DA446'] as [string, string]; // Green gradient
    }
    
    return (
      <View 
        style={[
          styles.cardContainer,
          { marginHorizontal: CARD_MARGIN },
          index === activeCardIndex && styles.activeCardContainer,
        ]}
      >
        <TouchableOpacity
          style={styles.cardTouchable}
          onPress={() => router.push(`/cards/${item.id}` as any)}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
          >
            <View style={styles.cardHeader}>
              <View style={styles.cardTypeContainer}>
                <Text style={styles.cardType}>{item.type}</Text>
                {item.type === 'Virtual Card' && (
                  <View style={styles.virtualBadge}>
                    <Feather name="wifi" size={10} color="#FFFFFF" style={styles.virtualIcon} />
                  </View>
                )}
              </View>
              <View style={styles.cardLogoContainer}>
                {item.logo === 'visa' ? (
                  <Text style={styles.cardLogoText}>VISA</Text>
                ) : (
                  <Text style={styles.cardLogoText}>MASTERCARD</Text>
                )}
              </View>
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
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  };

  const renderTransactionItem = ({ item }: { item: typeof transactions[0] }) => (
    <TouchableOpacity
      style={styles.transactionItem}
      onPress={() => console.log('Transaction pressed:', item.id)}
    >
      <View style={[
        styles.transactionIconContainer,
        { backgroundColor: getCategoryColor(item.category) }
      ]}>
        <Feather name={item.icon as any} size={20} color="#FFFFFF" />
      </View>
      
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionMerchant}>{item.merchant}</Text>
        <Text style={styles.transactionCategory}>{item.category}</Text>
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

  // Function to get color based on transaction category
  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'Entertainment':
        return '#FF3B30';
      case 'Shopping':
        return '#FF9500';
      case 'Transport':
        return '#5AC8FA';
      default:
        return '#7C00FE';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { marginTop: insets.top }]}>
        <Text style={styles.headerTitle}>My Cards</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/cards/add' as any)}
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
          <View style={styles.actionIconContainer}>
            <Feather name="lock" size={20} color="#7C00FE" />
          </View>
          <Text style={styles.actionButtonText}>Freeze</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <View style={styles.actionIconContainer}>
            <Feather name="settings" size={20} color="#7C00FE" />
          </View>
          <Text style={styles.actionButtonText}>Settings</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <View style={styles.actionIconContainer}>
            <Feather name="eye" size={20} color="#7C00FE" />
          </View>
          <Text style={styles.actionButtonText}>Details</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.transactionsContainer}>
        <View style={styles.transactionsHeader}>
          <Text style={styles.transactionsTitle}>Recent Transactions</Text>
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={() => console.log('View all transactions')}
          >
            <Text style={styles.viewAllText}>View All</Text>
            <Feather name="chevron-right" size={16} color="#7C00FE" />
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={transactions}
          renderItem={renderTransactionItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.transactionsList}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7C00FE',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#7C00FE',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0px 4px 8px rgba(124, 0, 254, 0.3)',
      },
    }),
  },
  cardList: {
    paddingTop: 10,
    paddingBottom: 15,
  },
  cardContainer: {
    width: CARD_WIDTH,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 10,
      },
      web: {
        boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)',
      },
    }),
    transform: [{ scale: 0.98 }],
  },
  activeCardContainer: {
    transform: [{ scale: 1 }],
    ...Platform.select({
      ios: {
        shadowOpacity: 0.25,
      },
      android: {
        elevation: 12,
      },
      web: {
        boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.2)',
      },
    }),
  },
  cardTouchable: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  card: {
    borderRadius: 20,
    padding: 20,
    height: 200,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  cardTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardType: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  virtualBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  virtualIcon: {
    marginRight: 2,
  },
  cardLogoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  cardLogoText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  cardNumber: {
    color: '#FFFFFF',
    fontSize: 22,
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
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 10,
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
    marginTop: 5,
    marginBottom: 20,
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
  actionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(124, 0, 254, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionButtonText: {
    color: '#333333',
    fontSize: 13,
    fontWeight: '500',
  },
  transactionsContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 10,
      },
      web: {
        boxShadow: '0px -4px 12px rgba(0, 0, 0, 0.05)',
      },
    }),
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  transactionsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: '#7C00FE',
    fontWeight: '500',
    marginRight: 4,
  },
  transactionsList: {
    paddingHorizontal: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F5',
  },
  transactionIconContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionMerchant: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#999999',
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