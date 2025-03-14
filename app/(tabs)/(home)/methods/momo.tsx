import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Modal,
  Alert,
  Keyboard,
  Platform,
  ActivityIndicator
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useSession } from '@/app/_layout';
import { TransactionService } from '@/services/TransactionService';

const MtnMomo = () => {
  const { session } = useSession();
  const [amount, setAmount] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('+250 790 139 249');
  const [showTransactionModal, setShowTransactionModal] = useState<boolean>(false);
  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const [pin, setPin] = useState<string>('');
  const [keyboardVisible, setKeyboardVisible] = useState<boolean>(false);
  const [transactionOption, setTransactionOption] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [userWallet, setUserWallet] = useState<any>(null);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    // Fetch user's default wallet when component mounts
    if (session?.user?.id) {
      fetchUserWallet();
    }

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [session]);

  // Function to fetch user's default wallet
  const fetchUserWallet = async () => {
    if (!session?.user?.id) return;

    try {
      const wallet = await TransactionService.getUserDefaultWallet(session.user.id);
      if (wallet) {
        setUserWallet(wallet);
      }
    } catch (err) {
      console.error('Error fetching wallet:', err);
    }
  };

  const handleContinue = () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    setShowTransactionModal(true);
  };

  const handleTransactionSelect = () => {
    if (transactionOption === '1') {
      setShowTransactionModal(false);
      setTransactionOption(''); // Reset option after selection
      setTimeout(() => {
        setShowPinModal(true);
      }, 300);
    } else {
      Alert.alert('Error', 'Please enter 1 to proceed with the payment');
    }
  };

  const handlePinSubmit = async () => {
    if (pin.length === 4) {
      setShowPinModal(false);
      setPin('');
      
      try {
        setIsProcessing(true);
        
        if (!session?.user?.id) {
          Alert.alert('Error', 'User not authenticated');
          return;
        }
        
        // Remove this comment if you're intentionally using TransactionService
        // but remove the updateWalletBalance function to avoid potential double-counting
        const numericAmount = parseFloat(amount);
        
        const success = await TransactionService.addMoneyToWallet(
          session.user.id,
          numericAmount,
          userWallet?.id,
          {
            merchant: 'MTN Mobile Money',
            category: 'Deposit',
            description: 'Mobile money deposit'
          }
        );
        
        if (success) {
          Alert.alert(
            'Transaction Successful',
            `Your account has been credited with ${amount} RWF`,
            [{ text: 'OK', onPress: () => router.back() }]
          );
        } else {
          Alert.alert('Error', 'Transaction failed. Please try again.');
        }
      } catch (err) {
        console.error('Error processing transaction:', err);
        Alert.alert('Error', 'An unexpected error occurred');
      } finally {
        setIsProcessing(false);
      }
    } else {
      Alert.alert('Error', 'Please enter a valid 4-digit PIN');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: 'MTN Mobile Money',
          headerTitleStyle: {
            color: '#333',
            fontSize: 18,
          },
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Feather name="arrow-left" size={24} color="#333" />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.content}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Add Money via MTN Mobile Money</Text>
          <Text style={styles.welcomeSubtitle}>
            Quick, safe, and convenient way to add funds to your account
          </Text>
        </View>

        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Amount (RWF)</Text>
            <View style={styles.amountContainer}>
              <Text style={styles.currencySymbol}>RWF</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <View style={styles.phoneContainer}>
              <Feather name="phone" size={20} color="#FFD700" style={styles.phoneIcon} />
              <Text style={styles.phoneNumber}>{phoneNumber}</Text>
              <TouchableOpacity style={styles.editButton}>
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoItem}>
              <Feather name="info" size={16} color="#FFCC08" />
              <Text style={styles.infoText}>
                Make sure you have enough balance in your MTN Mobile Money account.
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Feather name="shield" size={16} color="#FFCC08" />
              <Text style={styles.infoText}>
                Your transaction is secure and will be processed instantly.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.continueButton, (!amount || isProcessing) && styles.continueButtonDisabled]}
            onPress={handleContinue}
            disabled={!amount || isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color="#333" size="small" />
            ) : (
              <Text style={styles.continueText}>Continue</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Transaction Selection Modal */}
      <Modal
        visible={showTransactionModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.ussdModal}>
            <View style={styles.ussdContent}>
              <Text style={styles.ussdMessage}>
                Select Transaction to Approve a Cash Deposit:{'\n'}{'\n'}
                1) Payment to Antwise: {amount} RWF
              </Text>
              <TextInput 
                style={styles.ussdOptionInput}
                value={transactionOption}
                onChangeText={setTransactionOption}
                placeholder="Enter 1 to proceed"
                placeholderTextColor="#777"
                keyboardType="numeric"
                maxLength={1}
                autoFocus={true}
              />
            </View>
            <View style={styles.ussdDivider} />
            <View style={styles.ussdActions}>
              <TouchableOpacity 
                style={styles.ussdCancel}
                onPress={() => {
                  setShowTransactionModal(false);
                  setTransactionOption('');
                }}
              >
                <Text style={styles.ussdCancelText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.ussdSubmit, transactionOption !== '1' && styles.ussdSubmitDisabled]}
                onPress={handleTransactionSelect}
              >
                <Text style={styles.ussdSubmitText}>SEND</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* PIN Entry Modal */}
      <Modal
        visible={showPinModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.ussdModal}>
            <View style={styles.ussdContent}>
              <Text style={styles.ussdMessage}>
                Enter PIN to confirm payment of {amount} RWF to Antwise:
              </Text>
              <TextInput
                style={styles.ussdPinInput}
                secureTextEntry
                autoFocus={true}
                maxLength={4}
                keyboardType="numeric"
                value={pin}
                onChangeText={setPin}
                onSubmitEditing={handlePinSubmit}
              />
            </View>
            <View style={styles.ussdDivider} />
            <View style={styles.ussdActions}>
              <TouchableOpacity 
                style={styles.ussdCancel}
                onPress={() => {
                  setShowPinModal(false);
                  setPin('');
                }}
              >
                <Text style={styles.ussdCancelText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.ussdSubmit, pin.length !== 4 && styles.ussdSubmitDisabled]}
                onPress={handlePinSubmit}
                disabled={pin.length !== 4}
              >
                <Text style={styles.ussdSubmitText}>SEND</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  welcomeSection: {
    marginBottom: 30,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  formSection: {
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 56,
    backgroundColor: '#F9F9F9',
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 10,
  },
  amountInput: {
    flex: 1,
    fontSize: 18,
    color: '#333',
    height: '100%',
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 56,
    backgroundColor: '#F9F9F9',
  },
  phoneIcon: {
    marginRight: 10,
  },
  phoneNumber: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
  },
  editText: {
    fontSize: 12,
    color: '#555',
    fontWeight: '500',
  },
  infoSection: {
    marginTop: 20,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 12,
    backgroundColor: '#FFFBEB',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FFCC08',
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 10,
    flex: 1,
    lineHeight: 18,
  },
  footer: {
    marginTop: 'auto',
    paddingVertical: 20,
  },
  continueButton: {
    backgroundColor: '#FFCC08',
    borderRadius: 8,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  continueButtonDisabled: {
    backgroundColor: '#F0F0F0',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ussdModal: {
    width: '85%',
    backgroundColor: '#1A1A1A',
    borderRadius: 1,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#444',
  },
  ussdContent: {
    padding: 16,
  },
  ussdMessage: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 22,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  ussdDivider: {
    height: 1,
    backgroundColor: '#444444',
  },
  ussdActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  ussdCancel: {
    marginRight: 24,
  },
  ussdCancelText: {
    color: '#4A86E8',
    fontSize: 14,
    fontWeight: '500',
  },
  ussdSubmit: {
  },
  ussdSubmitText: {
    color: '#4A86E8',
    fontSize: 14,
    fontWeight: '500',
  },
  ussdPinInput: {
    height: 36,
    borderBottomWidth: 1,
    borderBottomColor: '#4A86E8',
    color: '#FFFFFF',
    marginTop: 16,
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  ussdOptionInput: {
    height: 36,
    borderBottomWidth: 1,
    borderBottomColor: '#4A86E8',
    color: '#FFFFFF',
    marginTop: 16,
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  ussdSubmitDisabled: {
    opacity: 0.5,
  },
});

export default MtnMomo;