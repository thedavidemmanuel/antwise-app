import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';

const { width, height } = Dimensions.get('window');
const scale = Math.min(width / 375, height / 812);
const scaledSize = (size: number) => size * scale;

export default function ResetScreen() {
  const router = useRouter();
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [codeError, setCodeError] = useState('');
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

  // Request a password reset code by email
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
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'yourapp://reset-password',
      });

      if (error) throw error;
      
      setEmailSent(true);
      
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      
      if (err.errors?.[0]) {
        setEmailError(err.errors[0].message || 'Error sending reset code');
      } else {
        setEmailError('Could not send reset code. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Reset the password with the code and the new password
  const onReset = async () => {
    // Reset error states
    setCodeError('');
    setPasswordError('');
    
    // Validate inputs
    let isValid = true;
    
    if (!code) {
      setCodeError('Verification code is required');
      isValid = false;
    }
    
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (!validatePassword(password)) {
      setPasswordError('Password must be at least 8 characters');
      isValid = false;
    }
    
    if (!isValid) return;
    
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        email,
        password,
      });

      if (error) throw error;
      
      Alert.alert('Success', 'Password reset successfully!', [
        { text: 'OK', onPress: () => router.replace('/(tabs)/home') }
      ]);
      
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      
      if (err.errors?.[0]?.code === 'form_code_incorrect') {
        setCodeError('Invalid verification code');
      } else if (err.errors?.[0]) {
        Alert.alert('Error', err.errors[0].message || 'Failed to reset password');
      } else {
        Alert.alert('Error', 'Failed to reset password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>
        {!emailSent 
          ? 'Enter your email to receive a password reset code' 
          : 'Enter the code sent to your email and your new password'}
      </Text>
      
      {!emailSent ? (
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
            accessibilityLabel="Send Reset Code"
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.actionButtonText}>Send Reset Code</Text>
            )}
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.label}>Verification Code</Text>
          <TextInput
            style={[styles.input, codeError ? styles.inputError : null]}
            placeholder="Enter verification code"
            placeholderTextColor="rgba(0, 0, 0, 0.3)"
            value={code}
            onChangeText={(text) => {
              setCode(text);
              setCodeError('');
            }}
            keyboardType="number-pad"
            editable={!loading}
            testID="code-input"
          />
          {codeError ? <Text style={styles.errorText}>{codeError}</Text> : null}

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
            onPress={onReset}
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


