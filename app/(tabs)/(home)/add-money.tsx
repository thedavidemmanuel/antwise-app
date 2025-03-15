// app/(tabs)/(home)/add-money.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { useSession } from '@/app/_layout';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBuildingColumns, faMobileRetro } from '@fortawesome/free-solid-svg-icons';

const PaymentMethod = {
  BANK_TRANSFER: 'BANK_TRANSFER',
  MTN_MOMO: 'MTN_MOMO',
  AIRTEL_MONEY: 'AIRTEL_MONEY',
  USSD: 'USSD',
} as const;

type PaymentMethodType = typeof PaymentMethod[keyof typeof PaymentMethod];

const AddMoney = () => {
  const { session } = useSession();

  const handleMethodSelected = (method: PaymentMethodType) => {
    // Navigate to the specific method screen
    switch (method) {
      case PaymentMethod.BANK_TRANSFER:
        router.push("/(tabs)/(home)/methods/bank-transfer");
        break;
      case PaymentMethod.MTN_MOMO:
        router.push("/(tabs)/(home)/methods/momo");
        break;
      case PaymentMethod.AIRTEL_MONEY:
        router.push("/(tabs)/(home)/methods/airtel-money");
        break;
      case PaymentMethod.USSD:
        router.push("/(tabs)/(home)/methods/ussd");
        break;
    }
  };

  const renderMethodItem = (method: PaymentMethodType, title: React.ReactNode, icon: React.ReactNode) => {
    return (
      <TouchableOpacity
        style={styles.methodItem}
        onPress={() => handleMethodSelected(method)}
      >
        <View style={styles.methodContent}>
          <View style={styles.methodIconContainer}>
            {icon}
          </View>
          {typeof title === 'string' ? (
            <Text style={styles.methodText}>{title}</Text>
          ) : (
            title
          )}
        </View>
        <Feather name="chevron-right" size={20} color="#888" />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: 'Add Money',
          headerShown: true,
          headerBackVisible: false,
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Select Method</Text>
          <View style={styles.methodsContainer}>
            {renderMethodItem(
              PaymentMethod.BANK_TRANSFER,
              'Bank Transfer',
              <FontAwesomeIcon icon={faBuildingColumns} size={24} color="#555" />
            )}
            
            {renderMethodItem(
              PaymentMethod.MTN_MOMO,
              <>
                <Text style={styles.methodText}>Momo by </Text>
                <Text style={[styles.methodText, { color: '#FFCC08' }]}>MTN</Text>
              </>,
              <Image source={require('@/assets/images/momo-icon.webp')} style={styles.methodLogo} />
            )}
            
            {renderMethodItem(
              PaymentMethod.AIRTEL_MONEY,
              'Airtel Money',
              <Image source={require('@/assets/images/airtel-money.png')} style={styles.methodLogo} />
            )}
            
            {renderMethodItem(
              PaymentMethod.USSD,
              'USSD',
              <FontAwesomeIcon icon={faMobileRetro} size={24} color="#555" />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    color: '#222',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  methodsContainer: {
    marginBottom: 20,
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  methodContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  methodLogo: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  methodText: {
    fontSize: 16,
    color: '#333',
  },
});

export default AddMoney;