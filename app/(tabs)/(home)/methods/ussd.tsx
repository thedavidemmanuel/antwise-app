import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Clipboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHashtag } from '@fortawesome/free-solid-svg-icons';

const Ussd = () => {
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
        <View style={styles.headerContainer}>
          <FontAwesomeIcon icon={faHashtag} size={36} color="#333" />
          <Text style={styles.headerTitle}>USSD Payment</Text>
        </View>

        <Text style={styles.instructionText}>
          Dial the USSD code below on your mobile phone to fund your account
        </Text>

        <View style={styles.codeContainer}>
          <Text style={styles.sectionTitle}>MTN Mobile Money</Text>
          <View style={styles.codeCard}>
            <Text style={styles.codeLabel}>Dial</Text>
            <View style={styles.codeValueContainer}>
              <Text style={styles.codeValue}>*165*3*1*123456*AMOUNT#</Text>
              <TouchableOpacity 
                style={styles.copyButton}
                onPress={() => copyToClipboard('*165*3*1*123456*AMOUNT#')}
              >
                <Feather name="copy" size={18} color="#FFCC08" />
                <Text style={[styles.copyText, { color: '#FFCC08' }]}>Copy</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.codeNotes}>
              Replace AMOUNT with the amount you want to deposit (e.g., 10000)
            </Text>
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Airtel Money</Text>
          <View style={styles.codeCard}>
            <Text style={styles.codeLabel}>Dial</Text>
            <View style={styles.codeValueContainer}>
              <Text style={styles.codeValue}>*185*9*1*123456*AMOUNT#</Text>
              <TouchableOpacity 
                style={styles.copyButton}
                onPress={() => copyToClipboard('*185*9*1*123456*AMOUNT#')}
              >
                <Feather name="copy" size={18} color="#FF0000" />
                <Text style={[styles.copyText, { color: '#FF0000' }]}>Copy</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.codeNotes}>
              Replace AMOUNT with the amount you want to deposit (e.g., 10000)
            </Text>
          </View>
        </View>

        <View style={styles.noteContainer}>
          <Feather name="info" size={16} color="#666" />
          <Text style={styles.noteText}>
            Follow the prompts on your phone to complete the transaction. Your account will be credited immediately after your payment is confirmed.
          </Text>
        </View>

        <View style={styles.helpContainer}>
          <Text style={styles.helpText}>
            Need help? Contact our support team at support@anwise.com
          </Text>
        </View>
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
    padding: 16,
    paddingBottom: 30,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginTop: 12,
  },
  instructionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
    marginBottom: 24,
    textAlign: 'center',
  },
  codeContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  codeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  codeLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  codeValueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  codeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  copyText: {
    fontSize: 14,
    marginLeft: 4,
    fontWeight: '500',
  },
  codeNotes: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8,
  },
  noteContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF9EB',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FFB800',
    marginBottom: 24,
  },
  noteText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  helpContainer: {
    alignItems: 'center',
  },
  helpText: {
    fontSize: 14,
    color: '#666',
  },
});

export default Ussd;