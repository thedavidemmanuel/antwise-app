import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Stack, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';

const ChatScreen = () => {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Chat',
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Feather name="arrow-left" size={24} color="#000" />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.content}>
        <Text style={styles.title}>Chat Coming Soon</Text>
        <Text style={styles.description}>
          We're working on bringing you a great chat experience.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
});

export default ChatScreen;
