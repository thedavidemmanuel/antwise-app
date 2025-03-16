import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface AccountNumberProps {
  phoneNumber: string | null | undefined;
  userId: string; // Add userId to fetch the correct profile when needed
  onEditPress: () => void; // Function to handle edit press
}

const AccountNumber: React.FC<AccountNumberProps> = ({ phoneNumber, userId, onEditPress }) => {
  // Extract account number by removing country code (like +250)
  const getAccountNumber = (): string => {
    if (!phoneNumber) return 'Not available';
    
    // Remove the country code (anything starting with '+' up to the first digit)
    const accountNumber = phoneNumber.replace(/^\+\d+\s*/, '');
    return accountNumber || 'Not available';
  };

  const accountNumber = getAccountNumber();
  const hasPhoneNumber = phoneNumber !== null && phoneNumber !== undefined;

  // Copy to clipboard function
  const copyToClipboard = (text: string) => {
    if (text === 'Not available') {
      // If trying to copy 'Not available', prompt to add phone number instead
      onEditPress();
      return;
    }
    
    if (Platform.OS === 'web') {
      navigator.clipboard.writeText(text);
      Alert.alert('Copied', 'Account number copied to clipboard!');
    } else {
      Alert.alert('Copied', 'Account number copied to clipboard!');
    }
  };

  return (
    <View style={styles.fieldContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.fieldLabel}>Antwise Account Number</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={onEditPress}
        >
          <Feather name="edit-2" size={16} color="#7C00FE" />
        </TouchableOpacity>
      </View>
      <View style={styles.valueContainer}>
        <Text style={[
          styles.fieldValue,
          !hasPhoneNumber && styles.unavailableText
        ]}>
          {accountNumber}
        </Text>
        {hasPhoneNumber && (
          <TouchableOpacity
            style={styles.copyButton}
            onPress={() => copyToClipboard(accountNumber)}
          >
            <Feather name="copy" size={16} color="#7C00FE" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fieldContainer: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#777777',
  },
  valueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldValue: {
    fontSize: 16,
    color: '#333333',
    flex: 1,
  },
  unavailableText: {
    color: '#999999',
    fontStyle: 'italic',
  },
  editButton: {
    padding: 8,
  },
  copyButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(124, 0, 254, 0.1)',
  },
});

export default AccountNumber;