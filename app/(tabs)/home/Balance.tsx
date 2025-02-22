import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const Balance: React.FC = () => {
  const router = useRouter();

  const handleAccountSwitch = () => {
    console.log('Switching account...');
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
          <Text style={styles.currencyText}>RWF</Text>
          <Text style={styles.balanceAmount}>487,650</Text>
        </View>

        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/add-money' as any)}
          >
            <View style={styles.iconCircle}>
              <Feather name="plus" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.actionText}>Add Money</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/transfer' as any)}
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
const CARD_HEIGHT = 180;

const styles = StyleSheet.create({
  balanceCard: {
    backgroundColor: '#7C00FE',
    borderRadius: 25,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    alignSelf: 'center',
    marginTop: 20,
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
    marginBottom: -5,
  },
  totalBalanceTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  switchButton: {
    padding: 4,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 0,
  },
  currencyText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
  balanceAmount: {
    fontSize: 40,
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
    height: 45,
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
    fontSize: 14,
    fontWeight: '600',
    color: '#7C00FE',
    marginLeft: 2,
  },
});

export default Balance;