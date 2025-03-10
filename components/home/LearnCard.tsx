import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

const LearnCard: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.iconContainer}>
          <Feather name="book" size={15} color="#7C00FE" />
        </View>
        <Text style={styles.title}>Savings Basics</Text>
      </View>

      <View style={styles.progressBar}>
        <View style={styles.progress} />
      </View>

      <Text style={styles.subtitle}>25 XP to next lesson</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    /** Make the card about half the width of the parent */
    width: '48%',
    
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 12,
    
    /** Shadow for iOS */
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    
    /** Elevation for Android */
    elevation: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 15,
    height: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
    fontFamily: 'Inter-SemiBold',
  },
  progressBar: {
    height: 7,
    backgroundColor: '#E5E5E5',
    borderRadius: 3.5,
    marginTop: 8,
    width: '100%',
  },
  progress: {
    width: '75%', // Example progress
    height: '100%',
    backgroundColor: '#7C00FE',
    borderRadius: 3.5,
  },
  subtitle: {
    fontSize: 10,
    color: '#8F92A1',
    fontWeight: '600',
    marginTop: 6,
  },
});

export default LearnCard;
