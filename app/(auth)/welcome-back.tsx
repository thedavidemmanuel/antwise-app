import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  Dimensions, ActivityIndicator, Alert, SafeAreaView, Image 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter, Link } from 'expo-router';
import { getUserDetails } from '@/lib/storage';
import { supabase } from '@/lib/supabase';

const { width, height } = Dimensions.get('window');
const scale = Math.min(width / 375, height / 812);
const scaledSize = (size: number) => size * scale;

export default function WelcomeBackScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  
  // Fetch stored user details on component mount
  useEffect(() => {
    async function fetchUserDetails() {
      const details = await getUserDetails();
      if (details) {
        setUserEmail(details.email);
        setFirstName(details.firstName);
      } else {
        // If no stored details, go to onboarding
        router.replace('/');
      }
    }
    
    fetchUserDetails();
  }, []);
  
  const handleSignIn = async () => {
    // Validate input
    if (!password) {
      setPasswordError('Password is required');
      return;
    }
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: password,
      });
      
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setPasswordError('Incorrect password');
        } else {
          setPasswordError(error.message || 'An error occurred during sign in');
        }
        return;
      }
      
      if (data.session) {
        // Successful sign in
        router.replace('/(tabs)/(home)');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  const signInAsDifferentUser = async () => {
    // Clear current user information and go to sign in
    router.replace('/(auth)/sign-in');
  };
  
  if (!firstName) {
    // Show loading state while fetching user data
    return (
      <View style={[styles.container, {justifyContent: 'center'}]}>
        <ActivityIndicator size="large" color="#7C00FE" />
      </View>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <Image 
        source={require('../../assets/images/antwise-logo.png')} 
        style={styles.logo}
        resizeMode="contain"
      />
      
      <Text style={styles.greeting}>Welcome back, {firstName}!</Text>
      <Text style={styles.subtitle}>Enter your password to continue</Text>
      
      <View style={[styles.passwordContainer, passwordError ? styles.inputError : null]}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Enter your password"
          placeholderTextColor="rgba(0, 0, 0, 0.3)"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setPasswordError('');
          }}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          editable={!loading}
          testID="welcome-back-password"
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
      
      <Link href="/(auth)/forgot-password" asChild>
        <TouchableOpacity 
          style={styles.forgotPasswordLink}
          disabled={loading}
          accessibilityRole="link"
        >
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </TouchableOpacity>
      </Link>
      
      <TouchableOpacity 
        style={[styles.signInButton, loading && styles.disabledButton]}
        onPress={handleSignIn}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Text style={styles.signInButtonText}>Sign In</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.differentUserButton}
        onPress={signInAsDifferentUser}
        disabled={loading}
      >
        <Text style={styles.differentUserText}>Sign in with a different account</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  logo: {
    width: scaledSize(220),
    height: scaledSize(70),
    marginTop: scaledSize(40),
    marginBottom: scaledSize(40),
  },
  greeting: {
    fontSize: scaledSize(24),
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: scaledSize(16),
    color: '#666666',
    marginBottom: 30,
    textAlign: 'center',
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
    padding: 15,
    fontSize: scaledSize(16),
  },
  eyeIcon: {
    paddingHorizontal: 15,
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
  forgotPasswordLink: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: scaledSize(14),
    color: '#7C00FE',
  },
  signInButton: {
    backgroundColor: '#7C00FE',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    width: width * 0.7,
    marginTop: 10,
    height: scaledSize(50),
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: scaledSize(18),
  },
  differentUserButton: {
    marginTop: 20,
    padding: 15,
  },
  differentUserText: {
    color: '#7C00FE',
    fontSize: scaledSize(16),
  }
});
