import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function ConfirmScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [message, setMessage] = useState('Verifying your email...');
  const [error, setError] = useState(false);

  useEffect(() => {
    // Extract token from URL params
    const token = params.token as string;
    const type = params.type as string;
    
    if (token) {
      handleToken(token, type);
    } else {
      setError(true);
      setMessage('Invalid confirmation link. Please try again.');
    }
  }, [params]);
  
  const handleToken = async (token: string, type: string) => {
    try {
      if (type === 'signup') {
        // Handle email confirmation
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'signup',
        });
        
        if (error) throw error;
        
        setMessage('Email verified successfully! Redirecting...');
        setTimeout(() => {
          router.replace('/(auth)/sign-in');
        }, 2000);
      } else if (type === 'recovery') {
        // Handle password reset
        router.replace({
          pathname: '/(auth)/reset',
          params: { token }
        });
      } else {
        setError(true);
        setMessage('Unknown verification type. Please try again.');
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError(true);
      setMessage('Failed to verify your email. The link may have expired.');
    }
  };
  
  return (
    <View style={styles.container}>
      {!error && <ActivityIndicator size="large" color="#7C00FE" style={styles.spinner} />}
      <Text style={[styles.message, error && styles.errorMessage]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  spinner: {
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333333',
    marginBottom: 20,
  },
  errorMessage: {
    color: '#FF3B30',
  },
});
