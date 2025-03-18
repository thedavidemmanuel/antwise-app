import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

const EmptyLessons: React.FC = () => {
  return (
    <View style={styles.emptyContainer}>
      <Feather name="book" size={50} color="#CCCCCC" />
      <Text style={styles.emptyText}>No lessons found for this course</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
});

export default EmptyLessons;
