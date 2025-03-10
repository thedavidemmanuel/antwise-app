import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Platform, Alert, ActivityIndicator, KeyboardAvoidingView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSignUp } from '@clerk/clerk-expo';
import { Feather } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const scale = Math.min(width / 375, height / 812);
const scaledSize = (size: number) => size * scale;

export default function SignupScreen() {
    const { isLoaded, signUp, setActive } = useSignUp();
    const router = useRouter();

    // Form refs for better keyboard navigation
    const emailRef = useRef<TextInput>(null);
    const passwordRef = useRef<TextInput>(null);
    const confirmPasswordRef = useRef<TextInput>(null);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [pendingVerification, setPendingVerification] = useState(false);
    const [code, setCode] = useState('');
    
    // Add loading states
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    
    // Add field-specific error states
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
        if (!isLoaded) return;
        
        // Reset error states
        setEmailError('');
        setPasswordError('');
        
        // Client-side validation
        let isValid = true;
        
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
            // Create user with just email and password
            await signUp.create({
                emailAddress: email,
                password,
            });

            // Send user an email with verification code
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
            setPendingVerification(true);
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2));
            
            // Handle specific error cases
            if (err.errors && err.errors[0]?.code === 'form_identifier_exists') {
                setEmailError('This email is already registered');
            } else if (err.errors && err.errors[0]?.code === 'form_password_pwned') {
                setPasswordError('This password has been compromised. Please use a stronger password.');
            } else {
                Alert.alert(
                    "Sign Up Error", 
                    err.errors?.[0]?.message || "An error occurred during sign up"
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle submission of verification form
    const onVerifyPress = async () => {
        if (!isLoaded || !code.trim()) return;
        
        setIsVerifying(true);
        
        try {
            // Use the code the user provided to attempt verification
            const signUpAttempt = await signUp.attemptEmailAddressVerification({
                code,
            });

            // If verification was completed, set the session to active and redirect
            if (signUpAttempt.status === 'complete') {
                await setActive({ session: signUpAttempt.createdSessionId });
                router.replace('/(tabs)/home');
            } else {
                Alert.alert(
                    "Verification Incomplete", 
                    "Please check your verification code and try again."
                );
            }
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2));
            
            // Check for the specific "already verified" error code
            if (err.errors && err.errors[0]?.code === 'verification_already_verified') {
                try {
                    // If already verified, attempt to complete the signup and get a session
                    if (signUp.status === 'complete' && signUp.createdSessionId) {
                        // If we have a session ID, set it active and continue
                        await setActive({ session: signUp.createdSessionId });
                        router.replace('/(tabs)/home');
                    } else {
                        // Otherwise redirect to sign in
                        Alert.alert(
                            "Already Verified",
                            "Your email has been verified. Please sign in with your credentials.",
                            [
                                { text: "OK", onPress: () => router.replace('/(auth)/sign-in') }
                            ]
                        );
                    }
                } catch (sessionErr) {
                    console.error("Error setting session:", sessionErr);
                    router.replace('/(auth)/sign-in');
                }
            } else {
                Alert.alert(
                    "Verification Error", 
                    err.errors?.[0]?.message || "An error occurred during verification. Please try again."
                );
            }
        } finally {
            setIsVerifying(false);
        }
    };

    // Resend verification code
    const handleResendCode = async () => {
        if (!isLoaded) return;
        
        try {
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
            Alert.alert('Success', 'A new verification code has been sent to your email');
        } catch (err) {
            console.error('Error resending code:', err);
            Alert.alert('Error', 'Failed to resend verification code. Please try again.');
        }
    };

    // Verification screen
    if (pendingVerification) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Verify Your Email</Text>
                <Text style={styles.subtitle}>Please enter the verification code sent to {email}</Text>
                
                <TextInput
                    style={styles.input}
                    placeholder="Enter verification code"
                    placeholderTextColor="rgba(0, 0, 0, 0.3)"
                    value={code}
                    onChangeText={setCode}
                    keyboardType="number-pad"
                    autoCapitalize="none"
                    autoFocus={true}
                    maxLength={6}
                />
                
                <TouchableOpacity 
                    style={[styles.continueButton, isVerifying && styles.disabledButton]}
                    onPress={onVerifyPress}
                    disabled={isVerifying || !code.trim()}>
                    {isVerifying ? (
                        <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                        <Text style={styles.continueButtonText}>Verify</Text>
                    )}
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={styles.resendCodeButton}
                    onPress={handleResendCode}>
                    <Text style={styles.resendCodeText}>Resend verification code</Text>
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