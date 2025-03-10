import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { useSignIn } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const scale = Math.min(width / 375, height / 812);
const scaledSize = (size: number) => size * scale;

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Validate form fields
  const validateForm = () => {
    let isValid = true;
    
    // Reset errors
    setEmailError('');
    setPasswordError('');
    
    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    }
    
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    }
    
    return isValid;
  };

  // Handle the submission of the sign-in form
  const onSignInPress = useCallback(async () => {
    if (!isLoaded || !validateForm()) return;

    setLoading(true);
    
    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      });

      if (signInAttempt.status === 'complete') {
        // This indicates the user is signed in
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace('/(tabs)/home');
      } else {
        // Handle other statuses if needed
        console.log(`Sign-in status: ${signInAttempt.status}`);
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      
      // Handle specific error codes
      if (err.errors && err.errors[0]) {
        const errorCode = err.errors[0].code;
        const errorMessage = err.errors[0].message;
        
        if (errorCode === 'form_identifier_not_found') {
          setEmailError('No account found with this email');
        } else if (errorCode === 'form_password_incorrect') {
          setPasswordError('Incorrect password');
        } else {
          // Generic error handling
          setEmailError(errorMessage || 'An error occurred during sign in');
        }
      }
    } finally {
      setLoading(false);
    }
  }, [isLoaded, email, password]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>Hey you're back, fill in your details to get back in</Text>

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

      <Text style={styles.label}>Password</Text>
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
        onPress={onSignInPress}
        disabled={loading}
        accessibilityRole="button"
        accessibilityLabel="Sign In"
        testID="sign-in-button"
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Text style={styles.signInButtonText}>Sign In</Text>
        )}
      </TouchableOpacity>

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account? </Text>
        <Link href="/(auth)/sign-up" asChild>
          <TouchableOpacity disabled={loading}>
            <Text style={styles.signupLink}>Sign up</Text>
          </TouchableOpacity>
        </Link>
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
  forgotPasswordLink: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: scaledSize(12),
    color: '#7C00FE',
  },
  signInButton: {
    backgroundColor: '#7C00FE',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
    height: 50, // Fixed height for button
    justifyContent: 'center', // Center content vertically
  },
  disabledButton: {
    opacity: 0.7,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: scaledSize(16),
  },
  signupContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  signupText: {
    fontSize: scaledSize(14),
    color: '#333',
  },
  signupLink: {
    fontSize: scaledSize(14),
    color: '#7C00FE',
    fontWeight: '500',
  },
});