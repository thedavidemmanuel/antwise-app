import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Platform, Alert, ActivityIndicator, KeyboardAvoidingView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { supabase, REDIRECT_URL } from '@/lib/supabase';

const { width, height } = Dimensions.get('window');
const scale = Math.min(width / 375, height / 812);
const scaledSize = (size: number) => size * scale;

export default function SignupScreen() {
    const router = useRouter();

    // Form refs for better keyboard navigation
    const firstNameRef = useRef<TextInput>(null);
    const lastNameRef = useRef<TextInput>(null);
    const emailRef = useRef<TextInput>(null);
    const passwordRef = useRef<TextInput>(null);
    const confirmPasswordRef = useRef<TextInput>(null);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    
    // Add loading states
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Add field-specific error states
    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    // Validate email format
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Validate password strength
    const validatePassword = (password: string) => {
        return password.length >= 8; // Simple length check, enhance as needed
    };

    // Handle submission of sign-up form
    const onSignUpPress = async () => {
        // Reset error states
        setFirstNameError('');
        setLastNameError('');
        setEmailError('');
        setPasswordError('');
        
        // Client-side validation
        let isValid = true;
        
        if (!firstName.trim()) {
            setFirstNameError('First name is required');
            isValid = false;
        }
        
        if (!lastName.trim()) {
            setLastNameError('Last name is required');
            isValid = false;
        }
        
        if (!email) {
            setEmailError('Email is required');
            isValid = false;
        } else if (!validateEmail(email)) {
            setEmailError('Please enter a valid email');
            isValid = false;
        }
        
        if (!password) {
            setPasswordError('Password is required');
            isValid = false;
        } else if (!validatePassword(password)) {
            setPasswordError('Password must be at least 8 characters');
            isValid = false;
        }
        
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            isValid = false;
        }

        if (!termsAccepted) {
            Alert.alert('Error', 'Please accept the Terms of Use and Privacy Policy');
            isValid = false;
        }
        
        if (!isValid) return;

        setIsSubmitting(true);
        
        try {
            // Create user with Supabase
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    emailRedirectTo: REDIRECT_URL,
                    data: {
                        first_name: firstName,
                        last_name: lastName,
                        full_name: `${firstName} ${lastName}`
                    }
                }
            });

            if (error) {
                if (error.message.includes('already registered')) {
                    setEmailError('This email is already registered');
                } else {
                    Alert.alert(
                        "Sign Up Error", 
                        error.message || "An error occurred during sign up"
                    );
                }
                return;
            }

            // For Supabase, if email confirmation is enabled,
            // the user will receive an email with a link to confirm their account
            if (data) {
                setEmailSent(true);
                Alert.alert('Success', 'Please check your email for a verification link to complete your registration.');
            }
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2));
            Alert.alert(
                "Sign Up Error", 
                "An unexpected error occurred. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    // Verification screen - with Supabase we show a message to check email
    if (emailSent) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Check Your Email</Text>
                <Text style={styles.subtitle}>We've sent a verification link to {email}</Text>
                
                <Text style={styles.subtitle}>Please check your inbox and click the link to verify your email address.</Text>
                
                <TouchableOpacity 
                    style={styles.continueButton}
                    onPress={() => router.replace('/(auth)/sign-in')}>
                    <Text style={styles.continueButtonText}>Go to Sign In</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={styles.resendCodeButton}
                    onPress={onSignUpPress}>
                    <Text style={styles.resendCodeText}>Resend verification email</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Sign up screen
    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1}}
        >
            <ScrollView contentContainerStyle={{flexGrow: 1}}>
                <View style={styles.container}>
                    <Text style={styles.title}>Shall we begin?</Text>

                    {/* First Name Field */}
                    <Text style={styles.label}>First Name</Text>
                    <TextInput
                        ref={firstNameRef}
                        style={[styles.input, firstNameError ? styles.inputError : null]}
                        placeholder="Your first name"
                        placeholderTextColor="rgba(0, 0, 0, 0.3)"
                        value={firstName}
                        onChangeText={(text) => {
                            setFirstName(text);
                            setFirstNameError('');
                        }}
                        autoCapitalize="words"
                        returnKeyType="next"
                        onSubmitEditing={() => lastNameRef.current?.focus()}
                        blurOnSubmit={false}
                    />
                    {firstNameError ? <Text style={styles.errorText}>{firstNameError}</Text> : null}

                    {/* Last Name Field */}
                    <Text style={styles.label}>Last Name</Text>
                    <TextInput
                        ref={lastNameRef}
                        style={[styles.input, lastNameError ? styles.inputError : null]}
                        placeholder="Your last name"
                        placeholderTextColor="rgba(0, 0, 0, 0.3)"
                        value={lastName}
                        onChangeText={(text) => {
                            setLastName(text);
                            setLastNameError('');
                        }}
                        autoCapitalize="words"
                        returnKeyType="next"
                        onSubmitEditing={() => emailRef.current?.focus()}
                        blurOnSubmit={false}
                    />
                    {lastNameError ? <Text style={styles.errorText}>{lastNameError}</Text> : null}

                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        ref={emailRef}
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
                        autoComplete="email"
                        returnKeyType="next"
                        onSubmitEditing={() => passwordRef.current?.focus()}
                        blurOnSubmit={false}
                    />
                    {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

                    <Text style={styles.label}>Password</Text>
                    <View style={[styles.passwordContainer, passwordError ? styles.inputError : null]}>
                        <TextInput
                            ref={passwordRef}
                            style={styles.passwordInput}
                            placeholder="Create your password"
                            placeholderTextColor="rgba(0, 0, 0, 0.3)"
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                setPasswordError('');
                            }}
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                            returnKeyType="next"
                            onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                            blurOnSubmit={false}
                        />
                        <TouchableOpacity 
                            onPress={() => setShowPassword(!showPassword)} 
                            style={styles.eyeIcon}
                            accessibilityLabel={showPassword ? "Hide password" : "Show password"}
                        >
                            <Feather name={showPassword ? "eye" : "eye-off"} size={scaledSize(20)} color="#777" />
                        </TouchableOpacity>
                    </View>
                    {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

                    <Text style={styles.label}>Confirm Password</Text>
                    <View style={styles.passwordContainer}>
                        <TextInput
                            ref={confirmPasswordRef}
                            style={styles.passwordInput}
                            placeholder="Re-enter your password"
                            placeholderTextColor="rgba(0, 0, 0, 0.3)"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showConfirmPassword}
                            autoCapitalize="none"
                            returnKeyType="done"
                        />
                        <TouchableOpacity 
                            onPress={() => setShowConfirmPassword(!showConfirmPassword)} 
                            style={styles.eyeIcon}
                            accessibilityLabel={showConfirmPassword ? "Hide password" : "Show password"}
                        >
                            <Feather name={showConfirmPassword ? "eye" : "eye-off"} size={scaledSize(20)} color="#777" />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity 
                        style={[styles.continueButton, isSubmitting && styles.disabledButton]}
                        onPress={onSignUpPress}
                        disabled={isSubmitting}>
                        {isSubmitting ? (
                            <ActivityIndicator color="#FFFFFF" size="small" />
                        ) : (
                            <Text style={styles.continueButtonText}>Continue</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.termsContainer}>
                        <TouchableOpacity 
                            style={styles.checkbox}
                            onPress={() => setTermsAccepted(!termsAccepted)}
                            accessibilityRole="checkbox"
                            accessibilityLabel={termsAccepted ? "Terms accepted" : "Accept terms"}
                        >
                            {termsAccepted && (
                                <Feather name="check" size={scaledSize(14)} color="#7C00FE" />
                            )}
                        </TouchableOpacity>
                        <Text style={styles.termsText}>
                            By continuing, you accept our{' '}
                            <Text style={styles.linkText}>Terms of use</Text> and{' '}
                            <Text style={styles.linkText}>Privacy Policy</Text>
                        </Text>
                    </View>

                    <Text style={styles.loginText}>
                        Already have an account?{' '}
                        <Text 
                            style={styles.loginLink} 
                            onPress={() => router.push('/(auth)/sign-in')}>
                            Log In
                        </Text>
                    </Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
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
        marginBottom: 20,
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
    continueButton: {
        backgroundColor: '#7C00FE',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        width: '100%',
        marginTop: 10,
    },
    continueButtonText: {
        color: '#fff',
        fontSize: scaledSize(16),
    },
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 20,
        width: '100%',
    },
    checkbox: {
        width: scaledSize(18),
        height: scaledSize(18),
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 3,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    termsText: {
        fontSize: scaledSize(12),
        color: '#666',
        flex: 1,
    },
    linkText: {
        color: '#7C00FE',
    },
    loginText: {
        fontSize: scaledSize(14),
        textAlign: 'center',
        marginTop: 20,
    },
    loginLink: {
        color: '#7C00FE',
    },
    subtitle: {
        fontSize: scaledSize(16),
        color: '#666666',
        marginBottom: 20,
        textAlign: 'center',
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
    disabledButton: {
        opacity: 0.7,
    },
    resendCodeButton: {
        marginTop: 15,
        padding: 10,
    },
    resendCodeText: {
        color: '#7C00FE',
        fontSize: scaledSize(14),
    },
});