import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');
const scale = Math.min(width / 375, height / 812);
const scaledSize = (size: number) => size * scale;

export default function LoginScreen() {
 const [email, setEmail] = useState('');
 const router = useRouter();

 return (
   <View style={styles.container}>
     <Text style={styles.title}>Welcome Back!</Text>

     <TouchableOpacity style={styles.socialButton}>
       <AntDesign name="google" size={scaledSize(24)} color="black" style={styles.socialIcon} />
       <Text style={styles.socialButtonText}>Continue with Google</Text>
     </TouchableOpacity>

     <TouchableOpacity style={styles.socialButton}>
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

     <TouchableOpacity style={styles.continueButton}>
       <Text style={styles.continueButtonText}>Log In</Text>
     </TouchableOpacity>

     <Text style={styles.termsText}>
       By continuing, you accept our{' '}
       <Text style={styles.linkText}>Terms of use</Text> and{' '}
       <Text style={styles.linkText}>Privacy Policy</Text>
     </Text>

     <Text style={styles.signupText}>
       Don't have an account?{' '}
       <Text 
         style={styles.signupLink}
         onPress={() => router.push("./Signup")}
       >
         Sign Up
       </Text>
     </Text>
   </View>
 );
}

const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: '#fff',
   padding: scaledSize(40),
 },
 title: {
   fontSize: scaledSize(18),
   color: '#000000',
   marginBottom: scaledSize(40),
   fontFamily: Platform.OS === 'ios' ? 'Inter' : 'Inter-Regular',
 },
 socialButton: {
   flexDirection: 'row',
   alignItems: 'center',
   width: '100%',
   height: scaledSize(44),
   borderRadius: scaledSize(20),
   borderWidth: 2,
   borderColor: 'rgba(170, 170, 57, 0.3)',
   marginBottom: scaledSize(20),
   paddingHorizontal: scaledSize(20),
 },
 socialIcon: {
   marginRight: scaledSize(20),
 },
 socialButtonText: {
   fontSize: scaledSize(18),
   color: '#000000',
   fontFamily: Platform.OS === 'ios' ? 'Inter' : 'Inter-Regular',
 },
 orText: {
   fontSize: scaledSize(18),
   color: '#000000',
   textAlign: 'center',
   marginVertical: scaledSize(20),
   fontFamily: Platform.OS === 'ios' ? 'Inter' : 'Inter-Regular',
 },
 label: {
   fontSize: scaledSize(18),
   color: '#000000',
   marginBottom: scaledSize(10),
   fontFamily: Platform.OS === 'ios' ? 'Inter' : 'Inter-Regular',
 },
 input: {
   width: '100%',
   height: scaledSize(44),
   borderRadius: scaledSize(10),
   borderWidth: 2,
   borderColor: '#7C00FE',
   paddingHorizontal: scaledSize(15),
   fontSize: scaledSize(18),
   marginBottom: scaledSize(20),
   fontFamily: Platform.OS === 'ios' ? 'Inter' : 'Inter-Regular',
 },
 continueButton: {
   width: '100%',
   height: scaledSize(63),
   backgroundColor: '#7C00FE',
   borderRadius: scaledSize(20),
   justifyContent: 'center',
   alignItems: 'center',
   marginTop: scaledSize(20),
 },
 continueButtonText: {
   color: '#FFFFFF',
   fontSize: scaledSize(18),
   fontFamily: Platform.OS === 'ios' ? 'Inter' : 'Inter-Regular',
 },
 termsText: {
   fontSize: scaledSize(12),
   color: '#000000',
   textAlign: 'center',
   marginTop: scaledSize(20),
   fontFamily: Platform.OS === 'ios' ? 'Inter' : 'Inter-Regular',
 },
 linkText: {
   color: '#7C00FE',
 },
 signupText: {
   fontSize: scaledSize(16),
   color: '#000000',
   textAlign: 'center',
   marginTop: scaledSize(20),
   fontFamily: Platform.OS === 'ios' ? 'Inter' : 'Inter-Regular',
 },
 signupLink: {
   color: '#7C00FE',
 },
});