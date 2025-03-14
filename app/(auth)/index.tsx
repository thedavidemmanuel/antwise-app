// app/(auth)/index.tsx
import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { getUserDetails } from '@/lib/storage';

export default function AuthIndex() {
  const router = useRouter();
  const [isReturningUser, setIsReturningUser] = React.useState<boolean | null>(null);

  useEffect(() => {
    async function checkUserStatus() {
      try {
        const details = await getUserDetails();
        setIsReturningUser(!!details);
      } catch (err) {
        console.error("Error checking user status:", err);
        setIsReturningUser(false);
      }
    }
    
    checkUserStatus();
  }, []);

  if (isReturningUser === null) {
    // Still loading
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#7C00FE" />
      </View>
    );
  }

  // Redirect based on whether user is returning or new
  if (isReturningUser) {
    return <Redirect href="/(auth)/welcome-back" />;
  } else {
    return <Redirect href="/(auth)/sign-in" />;
  }
}