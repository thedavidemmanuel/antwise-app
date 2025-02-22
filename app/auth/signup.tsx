import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Platform, Alert } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');
const scale = Math.min(width / 375, height / 812);
const scaledSize = (size: number) => size * scale;

export default function SignupScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSignup = () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        // Add your non-auth logic here
        router.push('/OnboardingScreen');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Shall we begin?</Text>

            <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => Alert.alert('Coming Soon', 'Google sign in will be available soon!')}>
                <AntDesign name="google" size={scaledSize(24)} color="black" style={styles.socialIcon} />
                <Text style={styles.socialButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => Alert.alert('Coming Soon', 'Apple sign in will be available soon!')}>
                <AntDesign name="apple1" size={scaledSize(24)} color="black" style={styles.socialIcon} />
                <Text style={styles.socialButtonText}>Continue with Apple</Text>
            </TouchableOpacity>

            <Text style={styles.orText}>or</Text>

            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor="rgba(0, 0, 0, 0.3)"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Create your password"
                placeholderTextColor="rgba(0, 0, 0, 0.3)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
            />

            <TouchableOpacity 
                style={styles.continueButton}
                onPress={handleSignup}>
                <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>

            <Text style={styles.termsText}>
                By continuing, you accept our{' '}
                <Text style={styles.linkText}>Terms of use</Text> and{' '}
                <Text style={styles.linkText}>Privacy Policy</Text>
            </Text>

            <Text style={styles.loginText}>
                Already have an account?{' '}
                <Text 
                    style={styles.loginLink} 
                    onPress={() => router.push('/auth/Signin')}>
                    Log In
                </Text>
            </Text>
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
        marginBottom: 20,
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        width: '100%',
    },
    socialIcon: {
        marginRight: 10,
    },
    socialButtonText: {
        fontSize: scaledSize(16),
    },
    orText: {
        fontSize: scaledSize(16),
        marginVertical: 10,
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
    continueButton: {
        backgroundColor: '#007BFF',
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
    termsText: {
        fontSize: scaledSize(12),
        color: '#666',
        textAlign: 'center',
        marginTop: 20,
    },
    linkText: {
        color: '#007BFF',
    },
    loginText: {
        fontSize: scaledSize(14),
        textAlign: 'center',
        marginTop: 20,
    },
    loginLink: {
        color: '#007BFF',
    },
});
