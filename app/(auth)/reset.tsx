import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Feather } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const scale = Math.min(width / 375, height / 812);
const scaledSize = (size: number) => size * scale;

export default function ResetScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Validate email format
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate password strength
  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  // Request a password reset email
  const onRequestReset = async () => {
    // Reset error state
    setEmailError('');
    
    // Validate email
    if (!email) {
      setEmailError('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      return;
    }
    
    setLoading(true);
    
    try {
      // Use Supabase to send password reset email
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        throw error;
      }
      
      setEmailSent(true);
      Alert.alert('Success', 'Check your email for the reset link');
      
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      setEmailError(err.message || 'Error sending reset email');
    } finally {
      setLoading(false);
    }
  };

  // Reset the password
  const onResetPassword = async () => {
    // Reset error states
    setPasswordError('');
    
    // Validate inputs
    if (!password) {
      setPasswordError('Password is required');
      return;
    } 
    
    if (!validatePassword(password)) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }
    
    setLoading(true);
    
    try {
      // Use Supabase to update password
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) {
        throw error;
      }
      
      Alert.alert('Success', 'Password reset successfully!', [
        { text: 'OK', onPress: () => router.replace('/(auth)/sign-in') }
      ]);
      
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert('Error', err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  // If we have a token in the URL, show the password reset form directly
  const showPasswordForm = params.token || emailSent;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>
        {!showPasswordForm 
          ? 'Enter your email to receive a password reset link' 
          : 'Enter your new password'}
      </Text>
      
      {!showPasswordForm ? (
        <>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, emailError ? styles.inputError : null]}
            placeholder="you@example.com"
            placeholderTextColor="rgba(0, 0, 0, 0.3)"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
            testID="email-input"
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          <TouchableOpacity 
            style={[styles.actionButton, loading && styles.disabledButton]}
            onPress={onRequestReset}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Send Reset Link"
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.actionButtonText}>Send Reset Link</Text>
            )}
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.label}>New Password</Text>
          <View style={[styles.passwordContainer, passwordError ? styles.inputError : null]}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Create new password"
              placeholderTextColor="rgba(0, 0, 0, 0.3)"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError('');
              }}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              editable={!loading}
              testID="password-input"
            />
            <TouchableOpacity 
              onPress={() => setShowPassword(!showPassword)} 
              style={styles.eyeIcon}
              disabled={loading}
              accessibilityRole="button"
              accessibilityLabel={showPassword ? "Hide password" : "Show password"}
            >
              <Feather name={showPassword ? "eye" : "eye-off"} size={scaledSize(20)} color="#777" />
            </TouchableOpacity>
          </View>
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

          <TouchableOpacity 
            style={[styles.actionButton, loading && styles.disabledButton]}
            onPress={onResetPassword}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Reset Password"
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.actionButtonText}>Reset Password</Text>
            )}
          </TouchableOpacity>
        </>
      )}

      <View style={styles.backContainer}>
        <TouchableOpacity 
          onPress={() => router.back()}
          disabled={loading}
          accessibilityRole="button"
          accessibilityLabel="Go back to sign in"
        >
          <Text style={styles.backLink}>Back to Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: scaledSize(24),
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: scaledSize(16),
    color: '#666666',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: scaledSize(14),
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: scaledSize(12),
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
    padding: 10,
  },
  eyeIcon: {
    paddingHorizontal: 10,
  },
  actionButton: {
    backgroundColor: '#7C00FE',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
    height: 50,
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: scaledSize(16),
    fontWeight: '500',
  },
  backContainer: {
    marginTop: 20,
  },
  backLink: {
    color: '#7C00FE',
    fontSize: scaledSize(14),
    fontWeight: '500',
  },
});
