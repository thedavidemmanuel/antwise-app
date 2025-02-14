import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
  StatusBar,
  useWindowDimensions,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Icon from '@expo/vector-icons/Feather';
import { MoneyFlowChart } from '../../components/MoneyFlowChart';
import { mockFinancialData } from '../../data/financialData';
import { useRouter } from 'expo-router';

interface ShortcutItem {
  icon: keyof typeof Icon.glyphMap;
  label: string;
}

interface FinancialChartData {
  date: string;
  value: number;
}

interface Transaction {
  type: 'in' | 'out';
  title: string;
  amount: number;
  date: string;
  icon: keyof typeof Icon.glyphMap;
}

interface DashboardStyles {
  root: ViewStyle;
  container: ViewStyle;
  header: ViewStyle;
  userSection: ViewStyle;
  avatar: ViewStyle;
  headerText: TextStyle;
  headerActions: ViewStyle;
  balanceSection: ViewStyle;
  balanceContent: ViewStyle;
  balanceHeader: ViewStyle;
  balanceLabel: TextStyle;
  balanceAmount: TextStyle;
  actionsContainer: ViewStyle;
  actionButton: ViewStyle;
  actionText: TextStyle;
  section: ViewStyle;
  sectionTitle: TextStyle;
  moneyFlowHeader: ViewStyle;
  moneyFlowHeaderLeft: ViewStyle;
  moneyFlowTitle: TextStyle;
  periodSelector: ViewStyle;
  periodText: TextStyle;
  moreInsightsContainer: ViewStyle;
  moreInsights: TextStyle;
  cardsContainer: ViewStyle;
  card: ViewStyle;
  cardHeader: ViewStyle;
  cardHeaderLeft: ViewStyle;
  bulletPositive: ViewStyle;
  bulletNegative: ViewStyle;
  cardLabel: TextStyle;
  cardPercentagePositive: TextStyle;
  cardPercentageNegative: TextStyle;
  cardAmount: TextStyle;
  shortcutsCard: ViewStyle;
  shortcutItem: ViewStyle;
  shortcutIcon: ViewStyle;
  shortcutLabel: TextStyle;
  navBar: ViewStyle;
  navItem: ViewStyle;
  navLabel: TextStyle;
  itemSpacing: number;
  fab: ViewStyle;
  transactionsSection: ViewStyle;
  transactionsHeader: ViewStyle;
  transactionItem: ViewStyle;
  transactionLeft: ViewStyle;
  transactionIcon: ViewStyle;
  transactionInfo: ViewStyle;
  transactionTitle: TextStyle;
  transactionDate: TextStyle;
  transactionAmount: TextStyle;
  seeAllButton: ViewStyle;
  seeAllText: TextStyle;
  savingsRow: ViewStyle;
  savingsCard: ViewStyle;
  savingsHeader: ViewStyle;
  savingsIcon: ViewStyle;
  savingsTitle: TextStyle;
  lessonTag: ViewStyle;
  lessonTagText: TextStyle;
  progressBar: ViewStyle;
  progressFill: ViewStyle;
  progressText: TextStyle;
  leaderboardDesc: TextStyle;
  viewRankingsButton: ViewStyle;
  viewRankingsText: TextStyle;
}

const Home = () => {
  const { width } = useWindowDimensions();
  const styles = React.useMemo(() => createStyles(width), [width]);
  const router = useRouter();

  const shortcuts: ShortcutItem[] = [
    { icon: 'file-text', label: 'Pay Bills' },
    { icon: 'gift', label: 'Rewards' },
    { icon: 'smartphone', label: 'Airtime' },
    { icon: 'wifi', label: 'Data' },
    { icon: 'tv', label: 'Cable TV' },
  ];

  const formatChartData = (
    data: { date: string; amount: number }[]
  ): FinancialChartData[] => {
    return data.map((item) => ({
      date: item.date,
      value: item.amount,
    }));
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userSection}>
            <Icon name="user" size={32} color="black" />
            <Text style={styles.headerText}>Hi, CRYSTAL</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity>
              <Icon name="help-circle" size={24} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={{ marginLeft: 16 }}>
              <Icon name="bell" size={24} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceSection}>
          <View style={styles.balanceContent}>
            <View style={styles.balanceHeader}>
              <Text style={styles.balanceLabel}>Total Balance</Text>
              <Icon name="chevron-down" size={24} color="white" />
            </View>
            <Text style={styles.balanceAmount} numberOfLines={1} adjustsFontSizeToFit>
              RWF 487,650
            </Text>
          </View>
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <Icon name="plus" size={20} color="#7C3AED" />
              <Text style={styles.actionText}>Add Money</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Icon name="send" size={20} color="#7C3AED" />
              <Text style={styles.actionText}>Transfer</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Shortcuts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shortcuts</Text>
          <View style={styles.shortcutsCard}>
            {shortcuts.map((item, index) => (
              <TouchableOpacity key={index} style={styles.shortcutItem}>
                <View style={styles.shortcutIcon}>
                  <Icon name={item.icon} size={24} color="#7C3AED" />
                </View>
                <Text style={styles.shortcutLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Money Flow Section */}
        <View style={styles.section}>
          {/* Header Row: Money Flow, Period Selector, More Insights */}
          <View style={styles.moneyFlowHeader}>
            <View style={styles.moneyFlowHeaderLeft}>
              <Text style={styles.moneyFlowTitle}>Money Flow</Text>
              <TouchableOpacity style={styles.periodSelector}>
                <Text style={styles.periodText}>This Week</Text>
                <Icon name="chevron-down" size={10} color="#7C00FE" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.moreInsightsContainer}>
              <Text style={styles.moreInsights}>More Insights</Text>
              <Icon name="chevron-right" size={12} color="#7C00FE" />
            </TouchableOpacity>
          </View>

          {/* Cards Container */}
          <View style={styles.cardsContainer}>
            {/* Money In Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  <View style={styles.bulletPositive} />
                  <Text style={styles.cardLabel}>Money In</Text>
                </View>
                <Text style={styles.cardPercentagePositive}>+12.5%</Text>
              </View>
              <Text style={styles.cardAmount}>RWF 210,000</Text>
              <MoneyFlowChart
                data={formatChartData(mockFinancialData.moneyIn)}
                color="#4CD964"
                width={144}
                height={55}
              />
            </View>

            {/* Money Out Card */}
            <View style={[styles.card, { marginLeft: styles.itemSpacing }]}>
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  <View style={styles.bulletNegative} />
                  <Text style={styles.cardLabel}>Money Out</Text>
                </View>
                <Text style={styles.cardPercentageNegative}>-8.3%</Text>
              </View>
              <Text style={styles.cardAmount}>RWF 530,000</Text>
              <MoneyFlowChart
                data={formatChartData(mockFinancialData.moneyOut)}
                color="#FF3B30"
                width={144}
                height={55}
              />
            </View>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.transactionsSection}>
            <View style={styles.transactionsHeader}>
              <Text style={styles.sectionTitle}>Recent Transactions</Text>
              <TouchableOpacity style={styles.seeAllButton}>
                <Text style={styles.seeAllText}>See all</Text>
                <Icon name="chevron-right" size={16} color="#7C00FE" />
              </TouchableOpacity>
            </View>
            
            {/* Netflix Transaction */}
            <View style={styles.transactionItem}>
              <View style={styles.transactionLeft}>
                <View style={[styles.transactionIcon, { backgroundColor: '#FFE8E8' }]}>
                  <Icon name="credit-card" size={20} color="#FF3B30" />
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionTitle}>Netflix Subscription</Text>
                  <Text style={styles.transactionDate}>Today, 2:30 PM</Text>
                </View>
              </View>
              <Text style={[styles.transactionAmount, { color: '#FF3B30' }]}>
                - RWF 21,040.38
              </Text>
            </View>
            
            {/* Money Received Transaction */}
            <View style={styles.transactionItem}>
              <View style={styles.transactionLeft}>
                <View style={[styles.transactionIcon, { backgroundColor: '#E8FFF3' }]}>
                  <Icon name="arrow-down-left" size={20} color="#4CD964" />
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionTitle}>Received from Jeff, Dauda</Text>
                  <Text style={styles.transactionDate}>Yesterday, 8:06 PM</Text>
                </View>
              </View>
              <Text style={[styles.transactionAmount, { color: '#4CD964' }]}>
                +RWF 150,000
              </Text>
            </View>
          </View>
        </View>

        {/* Savings Section */}
        <View style={styles.savingsRow}>
          {/* Savings Basics Card */}
          <View style={styles.savingsCard}>
            <View style={styles.savingsHeader}>
              <View style={styles.savingsIcon}>
                <Icon name="book-open" size={20} color="#7C00FE" />
              </View>
              <Text style={styles.savingsTitle}>Savings Basics</Text>
            </View>
            <View style={styles.lessonTag}>
              <Text style={styles.lessonTagText}>Lesson 1</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={styles.progressFill} />
            </View>
            <Text style={styles.progressText}>25 XP to next lesson</Text>
          </View>

          {/* Savings Leaderboard Card */}
          <View style={styles.savingsCard}>
            <View style={styles.savingsHeader}>
              <View style={styles.savingsIcon}>
                <Icon name="award" size={20} color="#7C00FE" />
              </View>
              <Text style={styles.savingsTitle}>Savings Leaderboard</Text>
            </View>
            <Text style={styles.leaderboardDesc}>
              Compete and save with friends
            </Text>
            <TouchableOpacity style={styles.viewRankingsButton}>
              <Text style={styles.viewRankingsText}>View Rankings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Add FAB before the NavBar */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push("./ai-chat")}
      >
        <Icon name="message-circle" size={24} color="#FFF" />
      </TouchableOpacity>

      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="home" size={24} color="#7C3AED" />
          <Text style={[styles.navLabel, { color: '#7C3AED' }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="dollar-sign" size={24} color="#666" />
          <Text style={styles.navLabel}>Finances</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="credit-card" size={24} color="#666" />
          <Text style={styles.navLabel}>Cards</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="book-open" size={24} color="#666" />
          <Text style={styles.navLabel}>Learn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="more-horizontal" size={24} color="#666" />
          <Text style={styles.navLabel}>More</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const createStyles = (width: number): DashboardStyles & { fab: ViewStyle } => {
  const CARD_PADDING = width * 0.04; // 4% of screen width
  const ITEM_SPACING = width * 0.03; // 3% of screen width

  // Create base styles (excluding non-style values like itemSpacing)
  const baseStyles = StyleSheet.create<Omit<DashboardStyles, 'itemSpacing'>>({
    root: {
      flex: 1,
      backgroundColor: '#F5F5F5',
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    container: {
      flex: 1,
      paddingHorizontal: CARD_PADDING,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 16,
      marginBottom: 12,
    },
    userSection: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: '#7C3AED',
    },
    headerText: {
      marginLeft: 8,
      fontSize: 16,
      fontWeight: '600',
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    balanceSection: {
      backgroundColor: '#7C3AED',
      borderRadius: width * 0.06,
      padding: CARD_PADDING,
      marginVertical: ITEM_SPACING,
      width: width * 0.9,
      alignSelf: 'center',
      elevation: 4,
    },
    balanceContent: {
      marginBottom: CARD_PADDING,
    },
    balanceHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: ITEM_SPACING,
    },
    balanceLabel: {
      color: 'white',
      fontSize: 14,
    },
    balanceAmount: {
      color: 'white',
      fontSize: Math.min(width * 0.07, 32),
      fontWeight: 'bold',
      flexShrink: 1,
    },
    actionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: CARD_PADDING,
    },
    actionButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      paddingVertical: ITEM_SPACING,
      paddingHorizontal: CARD_PADDING,
      borderRadius: 100,
      marginHorizontal: ITEM_SPACING / 2,
    },
    actionText: {
      color: '#7C3AED',
      marginLeft: 8,
      fontSize: 14,
      fontWeight: '500',
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: ITEM_SPACING,
    },
    moneyFlowHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: ITEM_SPACING,
    },
    moneyFlowHeaderLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    moneyFlowTitle: {
      fontSize: 12,
      fontWeight: '600',
      color: '#000',
      marginRight: 8,
    },
    periodSelector: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F3E8FF',
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 16,
    },
    periodText: {
      fontSize: 10,
      color: '#7C00FE',
      marginRight: 4,
    },
    moreInsightsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    moreInsights: {
      fontSize: 12,
      fontWeight: '400',
      color: '#7C00FE',
      marginRight: 2,
    },
    cardsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    card: {
      backgroundColor: '#FFF',
      borderRadius: 20,
      width: (width - 2 * CARD_PADDING - ITEM_SPACING) / 2,
      height: 120,
      padding: 10,
      shadowColor: '#000',
      shadowOpacity: 0.25,
      shadowRadius: 6,
      elevation: 6,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    cardHeaderLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    bulletPositive: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: '#4CD964',
      marginRight: 4,
    },
    bulletNegative: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: '#FF3B30',
      marginRight: 4,
    },
    cardLabel: {
      fontSize: 10,
      color: '#000',
    },
    cardPercentagePositive: {
      fontSize: 10,
      color: '#4CD964',
    },
    cardPercentageNegative: {
      fontSize: 10,
      color: '#932323',
    },
    cardAmount: {
      fontSize: 10,
      fontWeight: '600',
      color: '#000',
      marginVertical: 4,
    },
    shortcutsCard: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      backgroundColor: 'white',
      borderRadius: width * 0.04,
      padding: CARD_PADDING,
    },
    shortcutItem: {
      alignItems: 'center',
      width: (width - 2 * CARD_PADDING - ITEM_SPACING * 4) / 5,
      marginBottom: ITEM_SPACING,
    },
    shortcutIcon: {
      width: width * 0.12,
      height: width * 0.12,
      backgroundColor: '#F3E8FF',
      borderRadius: width * 0.03,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: ITEM_SPACING,
    },
    shortcutLabel: {
      fontSize: Math.min(width * 0.03, 14),
      color: '#333',
      textAlign: 'center',
    },
    navBar: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingVertical: ITEM_SPACING,
      paddingHorizontal: CARD_PADDING,
      backgroundColor: 'white',
      borderTopWidth: 1,
      borderTopColor: '#E5E5E5',
      elevation: 8,
    },
    navItem: {
      alignItems: 'center',
      flex: 1,
    },
    navLabel: {
      fontSize: 12,
      marginTop: 4,
      color: '#666',
    },
    fab: {
      position: 'absolute',
      right: CARD_PADDING,
      bottom: 80, // Position above nav bar
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: '#7C00FE',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      zIndex: 1,
    },
    transactionsSection: {
      backgroundColor: '#F8F5FF',
      borderRadius: 20,
      padding: CARD_PADDING,
      marginVertical: ITEM_SPACING,
    },
    transactionsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    transactionItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    transactionLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    transactionIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    transactionInfo: {
      flex: 1,
    },
    transactionTitle: {
      fontSize: 14,
      fontWeight: '500',
      color: '#000',
    },
    transactionDate: {
      fontSize: 12,
      color: '#666',
      marginTop: 2,
    },
    transactionAmount: {
      fontSize: 14,
      fontWeight: '500',
    },
    seeAllButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    seeAllText: {
      color: '#7C00FE',
      fontSize: 14,
      marginRight: 4,
    },
    savingsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: ITEM_SPACING,
    },
    savingsCard: {
      backgroundColor: '#FFF',
      borderRadius: 20,
      padding: CARD_PADDING,
      width: '48%',
    },
    savingsHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    savingsIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: '#F3E8FF',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 8,
    },
    savingsTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#000',
    },
    lessonTag: {
      backgroundColor: '#E8FFF3',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      marginLeft: 8,
    },
    lessonTagText: {
      color: '#00B37E',
      fontSize: 12,
    },
    progressBar: {
      height: 8,
      backgroundColor: '#E5E5E5',
      borderRadius: 4,
      marginVertical: 8,
    },
    progressFill: {
      width: '75%',
      height: '100%',
      backgroundColor: '#7C00FE',
      borderRadius: 4,
    },
    progressText: {
      fontSize: 12,
      color: '#666',
    },
    leaderboardDesc: {
      fontSize: 14,
      color: '#666',
      marginVertical: 8,
    },
    viewRankingsButton: {
      backgroundColor: '#7C00FE',
      padding: 12,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 8,
    },
    viewRankingsText: {
      color: '#FFF',
      fontSize: 14,
      fontWeight: '500',
    },
  });

  // Return the base styles merged with our extra numeric value.
  return { ...baseStyles, itemSpacing: ITEM_SPACING };
};

export default Home;
