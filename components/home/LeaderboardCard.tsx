import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

const LeaderboardCard: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Icon + Title Row */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Feather name="award" size={15} color="#7C00FE" />
        </View>
        <Text style={styles.title}>Savings Leaderboard</Text>
      </View>

      {/* Subtitle */}
      <Text style={styles.subtitle}>Compete and save with friends</Text>

      {/* Button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>View Rankings</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "50%",
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 12,

    // Shadow 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,

  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 15,
    height: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 12, 
    color: '#000000',
    fontFamily: 'Inter-SemiBold',
  },
  subtitle: {
    fontSize: 10,
    fontWeight: '600',
    lineHeight: 10, 
    marginTop: 6,
    color: '#8F92A1',
    fontFamily: 'Inter-SemiBold',
  },
  button: {
    width: 100,
    height: 30,
    backgroundColor: '#7C00FE',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 12, // Matches Swift line height
    color: '#FFFFFF',
    paddingVertical: 10,
    fontFamily: 'Inter-SemiBold',
  },
});

export default LeaderboardCard;
