import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';

type PaymentMethod = 'bank' | 'momo' | 'airtel' | 'ussd';

const AddMoney: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [ussdCode, setUssdCode] = useState<string>('');

  const handleAmountChange = (text: string) => {
    // Only allow numeric input with up to 2 decimal places
    const regex = /^\d+(\.\d{0,2})?$/;
    if (text === '' || regex.test(text)) {
      setAmount(text);
    }
  };

  const renderMethodSelection = () => {
    const methods = [
      { id: 'bank' as PaymentMethod, name: 'Bank Transfer', icon: 'credit-card' },
      { id: 'momo' as PaymentMethod, name: 'Mobile Money', icon: 'smartphone' },
      { id: 'airtel' as PaymentMethod, name: 'Airtel Money', icon: 'radio' },
      { id: 'ussd' as PaymentMethod, name: 'USSD', icon: 'hash' }
    ];

    return (
      <View style={styles.methodsContainer}>
        <Text style={styles.sectionTitle}>Select Payment Method</Text>
        <View style={styles.methodsList}>
          {methods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.methodCard,
                selectedMethod === method.id && styles.selectedMethodCard
              ]}
              onPress={() => setSelectedMethod(method.id)}
            >
              <View style={styles.methodIconContainer}>
                <Feather
                  name={method.icon as any}
                  size={24}
                  color={selectedMethod === method.id ? '#FFFFFF' : '#7C00FE'}
                />
              </View>
              <Text
                style={[
                  styles.methodName,
                  selectedMethod === method.id && styles.selectedMethodText
                ]}
              >
                {method.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderBankTransferForm = () => {
    return (
      <View style={styles.formContainer}>
        <Text style={styles.formLabel}>Account Number</Text>
        <TextInput
          style={styles.textInput}
          value={accountNumber}
          onChangeText={setAccountNumber}
          placeholder="Enter your account number"
          keyboardType="number-pad"
        />
        <Text style={styles.infoText}>
          Funds will be transferred from this account to your wallet.
        </Text>
      </View>
    );
  };

  const renderMobileMoneyForm = (provider: string) => {
    return (
      <View style={styles.formContainer}>
        <Text style={styles.formLabel}>{provider} Number</Text>
        <TextInput
          style={styles.textInput}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder={`Enter your ${provider} number`}
          keyboardType="phone-pad"
        />
        <Text style={styles.infoText}>
          You will receive a prompt on your phone to confirm the transaction.
        </Text>
      </View>
    );
  };

  const renderUSSDForm = () => {
    // Generate a USSD code based on the amount
    const generatedCode = `*123*1*${amount}#`;
    
    return (
      <View style={styles.formContainer}>
        <Text style={styles.formLabel}>USSD Code</Text>
        <View style={styles.ussdCodeContainer}>
          <Text style={styles.ussdCode}>{generatedCode}</Text>
          <TouchableOpacity 
            style={styles.copyButton}
            onPress={() => {
              setUssdCode(generatedCode);
              Alert.alert('Copied!', 'USSD code copied to clipboard');
            }}
          >
            <Feather name="copy" size={20} color="#7C00FE" />
          </TouchableOpacity>
        </View>
        <Text style={styles.infoText}>
          Dial this code on your phone to initiate the transfer.
        </Text>
      </View>
    );
  };

  const renderSelectedMethodForm = () => {
    if (!selectedMethod) return null;

    switch (selectedMethod) {
      case 'bank':
        return renderBankTransferForm();
      case 'momo':
        return renderMobileMoneyForm('Mobile Money');
      case 'airtel':
        return renderMobileMoneyForm('Airtel Money');
      case 'ussd':
        return renderUSSDForm();
      default:
        return null;
    }
  };

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }

    if (!selectedMethod) {
      Alert.alert('Method Required', 'Please select a payment method');
      return;
    }

    // Validate based on selected method
    if ((selectedMethod === 'momo' || selectedMethod === 'airtel') && !phoneNumber) {
      Alert.alert('Phone Number Required', 'Please enter your phone number');
      return;
    }

    if (selectedMethod === 'bank' && !accountNumber) {
      Alert.alert('Account Number Required', 'Please enter your account number');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success handling
      Alert.alert(
        'Transaction Initiated',
        `Your transaction of ${amount} has been initiated. Please follow the prompts to complete the payment.`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Transaction Failed', 'An error occurred while processing your request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen 
        options={{
          headerShown: true,
          title: 'Add Money',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Feather name="x" size={24} color="#000" />
            </TouchableOpacity>
          )
        }} 
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Enter Amount</Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={handleAmountChange}
                placeholder="0.00"
                keyboardType="decimal-pad"
                placeholderTextColor="#AAAAAA"
              />
            </View>
          </View>

          {renderMethodSelection()}
          {renderSelectedMethodForm()}
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.addButton,
              (!amount || !selectedMethod || isLoading) && styles.disabledButton
            ]}
            onPress={handleSubmit}
            disabled={!amount || !selectedMethod || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Add Money</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  amountContainer: {
    marginBottom: 32,
  },
  amountLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333333',
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 8,
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: '600',
    color: '#333333',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: '600',
    color: '#333333',
  },
  methodsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333333',
  },
  methodsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  methodCard: {
    width: '48%',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  selectedMethodCard: {
    backgroundColor: '#7C00FE',
  },
  methodIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  methodName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  selectedMethodText: {
    color: '#FFFFFF',
  },
  formContainer: {
    marginTop: 8,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333333',
  },
  textInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  infoText: {
    fontSize: 12,
    color: '#666666',
    marginTop: 8,
  },
  ussdCodeContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ussdCode: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  copyButton: {
    padding: 8,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 16,
  },
  addButton: {
    backgroundColor: '#7C00FE',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddMoney;