import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Clipboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useSession } from '@/app/_layout';

const BankTransfer = () => {
  const { session } = useSession();
  const [fullName, setFullName] = useState<string>('Loading...');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [accountNumber] = useState<string>("0123456789"); // Replace with actual account number

  useEffect(() => {
    // Fetch user profile data when component mounts
    const fetchUserProfile = async () => {
      if (!session?.user) return;
      
      try {
        // First try to get the name from user metadata
        const { data: userData } = await supabase.auth.getUser();
        
        let firstName = userData?.user?.user_metadata?.first_name || '';
        let lastName = userData?.user?.user_metadata?.last_name || '';
        
        // If not in metadata, try fetching from profiles table
        if (!firstName || !lastName) {
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', session.user.id)
            .single();
          
          if (error) {
            console.error('Error fetching user profile:', error);
            setIsLoading(false);
            return;
          }
          
          firstName = profileData?.first_name || '';
          lastName = profileData?.last_name || '';
        }
        
        if (firstName || lastName) {
          setFullName(`${firstName} ${lastName}`.trim());
        } else {
          // Fallback to email
          const email = session.user.email || '';
          setFullName(email);
        }
      } catch (error) {
        console.error('Error:', error);
        setFullName('User');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [session]);

  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
    Alert.alert('Copied', 'Account number copied to clipboard!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: 'Bank Transfer',
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
        <View style={styles.infoContainer}>
          <Text style={styles.instructionText}>
            Use the details below to fund your account from bank apps or internet banking
          </Text>

          <View style={styles.accountDetailsCard}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Account Name</Text>
              <Text style={styles.detailValue}>Antwise</Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Account Number</Text>
              <View style={styles.accountNumberContainer}>
                <Text style={styles.detailValue}>{accountNumber}</Text>
                <TouchableOpacity 
                  style={styles.copyButton}
                  onPress={() => copyToClipboard(accountNumber)}
                >
                  <Feather name="copy" size={18} color="#7C00FE" />
                  <Text style={styles.copyText}>Copy</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Your Name</Text>
              {isLoading ? (
                <ActivityIndicator size="small" color="#7C00FE" />
              ) : (
                <Text style={styles.detailValue}>{fullName}</Text>
              )}
            </View>
          </View>

          <View style={styles.noteContainer}>
            <Feather name="info" size={16} color="#666" />
            <Text style={styles.noteText}>
              Your account will be credited immediately after payment is confirmed. If your account is not credited within 5 minutes, please contact our support team.
            </Text>
          </View>
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
  },
  infoContainer: {
    marginBottom: 20,
  },
  instructionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 20,
  },
  accountDetailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 20,
  },
  detailItem: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  accountNumberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0E6FF',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  copyText: {
    fontSize: 14,
    color: '#7C00FE',
    marginLeft: 4,
    fontWeight: '500',
  },
  noteContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF9EB',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FFB800',
  },
  noteText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default BankTransfer;