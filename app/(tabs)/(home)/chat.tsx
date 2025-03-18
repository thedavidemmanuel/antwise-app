import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useAIInsights } from '@/hooks/useAIInsights';
import { SafeAreaView } from 'react-native-safe-area-context';

// Development mode flag - set to false in production
const DEV_MODE = __DEV__ && false;

export default function ChatScreen() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Array<{type: 'user' | 'ai', content: string}>>([]);
  const { insights, suggestions, loading, analyzing, error, debug, fetchInsights } = useAIInsights();
  const inputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (insights && !loading) {
      setMessages(prev => [...prev, { type: 'ai', content: insights }]);
      
      // Scroll to bottom after message added
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [insights, loading]);

  useEffect(() => {
    if (error) {
      setMessages(prev => [...prev, { type: 'ai', content: `Error: ${error}` }]);
    }
  }, [error]);

  const handleSubmit = () => {
    if (query.trim()) {
      // Add user message
      setMessages(prev => [...prev, { type: 'user', content: query }]);
      
      // Get AI response
      fetchInsights(query);
      
      // Clear input
      setQuery('');
      inputRef.current?.blur();
      
      // Scroll to bottom after message added
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: 'AI Financial Assistant',
          headerShown: true,
        }}
      />
      
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Feather name="help-circle" size={64} color="#CCCCCC" />
            <Text style={styles.emptyText}>Ask me about your spending, savings, or financial habits.</Text>
            <Text style={styles.promptExamples}>Try questions like:</Text>
            <View style={styles.examplesContainer}>
              <TouchableOpacity
                style={styles.exampleButton}
                onPress={() => {
                  const exampleQuery = 'How much do I spend on dining out?';
                  setMessages(prev => [...prev, { type: 'user', content: exampleQuery }]);
                  fetchInsights(exampleQuery);
                }}
              >
                <Text style={styles.exampleText}>How much do I spend on dining out?</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.exampleButton}
                onPress={() => {
                  const exampleQuery = 'Where can I save money?';
                  setMessages(prev => [...prev, { type: 'user', content: exampleQuery }]);
                  fetchInsights(exampleQuery);
                }}
              >
                <Text style={styles.exampleText}>Where can I save money?</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          messages.map((message, index) => (
            <View key={index}>
              <View 
                style={[
                  styles.messageContainer,
                  message.type === 'user' ? styles.userMessage : styles.aiMessage
                ]}
              >
                <Text style={[
                  styles.messageText,
                  message.type === 'user' && styles.userMessageText
                ]}>
                  {message.content}
                </Text>
              </View>
              
              {/* Display suggestions after AI messages */}
              {message.type === 'ai' && index === messages.length - 1 && suggestions && suggestions.length > 0 && (
                <View style={styles.suggestionsContainer}>
                  {suggestions.map((suggestion, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={styles.suggestionChip}
                      onPress={() => {
                        const newQuery = suggestion;
                        setMessages(prev => [...prev, { type: 'user', content: newQuery }]);
                        fetchInsights(newQuery);
                      }}
                    >
                      <Text style={styles.suggestionText}>{suggestion}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              
              {/* Debug info in development mode */}
              {DEV_MODE && message.type === 'ai' && index === messages.length - 1 && debug && (
                <View style={styles.debugContainer}>
                  <Text style={styles.debugHeader}>Debug Info:</Text>
                  <Text style={styles.debugText}>
                    Query Type: {debug.classification?.queryType || 'unknown'}{'\n'}
                    Transactions: {debug.transactionsCount || 0}
                  </Text>
                </View>
              )}
            </View>
          ))
        )}
        
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#7C00FE" />
            <Text style={styles.loadingText}>
              {analyzing ? 'Analyzing your transactions...' : 'Thinking...'}
            </Text>
          </View>
        )}
      </ScrollView>
      
      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Ask about your finances..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSubmit}
          returnKeyType="send"
        />
        <TouchableOpacity 
          style={[
            styles.submitButton,
            (!query.trim() || loading) && styles.disabledButton
          ]}
          onPress={handleSubmit}
          disabled={loading || !query.trim()}
        >
          <Feather name="send" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 24,
  },
  messageContainer: {
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: '#7C00FE',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  aiMessage: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  messageText: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  submitButton: {
    width: 40,
    height: 40,
    backgroundColor: '#7C00FE',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    marginBottom: 12,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666666',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  promptExamples: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
  },
  examplesContainer: {
    width: '100%',
  },
  exampleButton: {
    backgroundColor: '#F0F0F0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 14,
    color: '#333333',
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    marginBottom: 16,
    paddingLeft: 16,
  },
  suggestionChip: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  suggestionText: {
    fontSize: 14,
    color: '#7C00FE',
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  debugContainer: {
    padding: 12,
    margin: 8,
    backgroundColor: '#FFE8E8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFCACA',
  },
  debugHeader: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#CC0000',
  },
  debugText: {
    fontSize: 12,
    color: '#333333',
    fontFamily: 'monospace',
  },
});