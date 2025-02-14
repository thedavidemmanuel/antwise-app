import React from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface LeaderboardItem {
  id: string;
  name: string;
  points: number;
  icon: string;
  streak: number;
  isCurrentUser?: boolean;
  rankChange?: 'up' | 'down' | 'same';  // New property
}

const data: LeaderboardItem[] = [
  { id: '1', name: 'Jeff', points: 1200, icon: '👑', streak: 7, rankChange: 'up' },
  { id: '2', name: 'Bob', points: 1100, icon: '🥈', streak: 5, rankChange: 'same' },
  { id: '3', name: 'Charlie', points: 1000, icon: '🥉', streak: 4, isCurrentUser: true, rankChange: 'down' },
  { id: '4', name: 'David', points: 900, icon: '💫', streak: 3, rankChange: 'up' },
  { id: '5', name: 'Eve', points: 800, icon: '⭐', streak: 2, rankChange: 'same' },
];

const { width } = Dimensions.get('window');

export default function Leaderboard() {
  const getRankChangeIcon = (change?: 'up' | 'down' | 'same') => {
    switch (change) {
      case 'up': return <Text style={styles.rankUp}>↑</Text>;
      case 'down': return <Text style={styles.rankDown}>↓</Text>;
      default: return <Text style={styles.rankSame}>•</Text>;
    }
  };

  const renderItem = ({ item, index }: { item: LeaderboardItem; index: number }) => (
    <LinearGradient
      colors={
        index === 0 
          ? ['#FFD700', '#FFA500']
          : item.isCurrentUser 
          ? ['#E8F0FE', '#D2E3FC']
          : ['#fff', '#f8f8f8']
      }
      style={[
        styles.item,
        item.isCurrentUser && styles.currentUserItem
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <View style={styles.rankBadge}>
        <Text style={styles.rankText}>#{index + 1}</Text>
      </View>
      <Text style={styles.icon}>{item.icon}</Text>
      <View style={styles.details}>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{item.name}</Text>
          {getRankChangeIcon(item.rankChange)}
          {item.isCurrentUser && (
            <View style={styles.youBadge}>
              <Text style={styles.youText}>YOU</Text>
            </View>
          )}
        </View>
        <View style={styles.statsContainer}>
          <Text style={styles.points}>{item.points} pts</Text>
          <View style={styles.streakContainer}>
            <Text style={styles.streakText}>🔥 {item.streak} days</Text>
          </View>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progress, { width: `${(item.points/1200) * 100}%` }]} />
        </View>
      </View>
    </LinearGradient>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Savings Champions</Text>
        <Text style={styles.subtitle}>Compete & Save Together 💰</Text>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#7C00FE',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.8,
    marginTop: 5,
  },
  list: {
    padding: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 8,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  rankBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  rankText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
  },
  icon: {
    fontSize: 30,
    marginRight: 15,
  },
  details: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  points: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7C00FE',
    marginRight: 10,
  },
  streakContainer: {
    backgroundColor: 'rgba(255,69,0,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  streakText: {
    fontSize: 12,
    color: '#FF4500',
    fontWeight: '600',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    width: '100%',
  },
  progress: {
    height: '100%',
    backgroundColor: '#7C00FE',
    borderRadius: 2,
  },
  currentUserItem: {
    borderWidth: 1,
    borderColor: '#7C00FE',
  },
  youBadge: {
    backgroundColor: '#7C00FE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  youText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  rankUp: {
    color: '#22C55E',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  rankDown: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  rankSame: {
    color: '#9CA3AF',
    fontSize: 16,
    marginLeft: 4,
  },
});
