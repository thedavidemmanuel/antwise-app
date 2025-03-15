// This file implements the USSD Payment screen.
// It displays USSD codes for different mobile money providers and allows users to copy them to the clipboard.
// The design follows modern UX principles with proper spacing and clear typography.

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Clipboard,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';

const Ussd = () => {
  // Function to copy text to clipboard and notify the user
  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
    Alert.alert('Copied', 'USSD code copied to clipboard!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: 'USSD Payment',
          headerLeft: () => (
            // Navigation button to go back
            <TouchableOpacity onPress={() => router.back()}>
              <Feather name="arrow-left" size={24} color="#000" />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Instructions */}
        <Text style={styles.instructionText}>
          Dial the USSD code on your mobile phone to fund your account
        </Text>

        {/* Payment Cards Container */}
        <View style={styles.cardsContainer}>
          {/* MTN Mobile Money Card */}
          <View style={styles.paymentCard}>
            {/* Card Header */}
            <View style={styles.cardHeader}>
              {/* Provider color indicator */}
              <View style={[styles.providerIndicator, { backgroundColor: '#FFCC08' }]} />
              <Text style={styles.providerName}>MTN Mobile Money</Text>
            </View>
            
            {/* USSD Code Section */}
            <View style={styles.codeSection}>
              <Text style={styles.codeValue}>*165*3*1*123456*AMOUNT#</Text>
              <TouchableOpacity 
                style={styles.copyButton}
                onPress={() => copyToClipboard('*165*3*1*123456*AMOUNT#')}
              >
                <Feather name="copy" size={18} color="#007AFF" />
              </TouchableOpacity>
            </View>
            
            {/* Code Notes */}
            <Text style={styles.codeNotes}>
              Replace AMOUNT with the amount you want to deposit
            </Text>
          </View>

          {/* Airtel Money Card */}
          <View style={styles.paymentCard}>
            <View style={styles.cardHeader}>
              <View style={[styles.providerIndicator, { backgroundColor: '#FF0000' }]} />
              <Text style={styles.providerName}>Airtel Money</Text>
            </View>
            
            <View style={styles.codeSection}>
              <Text style={styles.codeValue}>*185*9*1*123456*AMOUNT#</Text>
              <TouchableOpacity 
                style={styles.copyButton}
                onPress={() => copyToClipboard('*185*9*1*123456*AMOUNT#')}
              >
                <Feather name="copy" size={18} color="#007AFF" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.codeNotes}>
              Replace AMOUNT with the amount you want to deposit
            </Text>
          </View>
        </View>

        {/* Information Note */}
        <View style={styles.noteContainer}>
          <Feather name="info" size={16} color="#007AFF" />
          <Text style={styles.noteText}>
            Follow the prompts on your phone to complete the transaction. Your account will be credited immediately after payment confirmation.
          </Text>
        </View>

        {/* Help Button */}
        <TouchableOpacity style={styles.helpButton}>
          <Text style={styles.helpButtonText}>
            Need help?
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 30,
  },
  instructionText: {
    fontSize: 17,
    lineHeight: 24,
    color: '#333',
    marginBottom: 40, // increased spacing between header instructions and content
    textAlign: 'left',
    fontWeight: '400',
  },
  cardsContainer: {
    marginBottom: 24,
    gap: 16,
  },
  paymentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  providerIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  providerName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
  },
  codeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  codeValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  copyButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#E9E9EB',
  },
  codeNotes: {
    fontSize: 14,
    color: '#666',
    fontWeight: '400',
  },
  noteContainer: {
    flexDirection: 'row',
    backgroundColor: '#F0F8FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  noteText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  helpButton: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F5F5F7',
    borderRadius: 12,
  },
  helpButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
});

export default Ussd;