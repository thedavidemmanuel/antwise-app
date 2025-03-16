import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '@/lib/supabase';

interface LeaderboardItem {
  id: string;
  name: string;
  points: number;
  icon: string;
  streak: number;
  isCurrentUser?: boolean;
  rankChange?: 'up' | 'down' | 'same';
}

const data: LeaderboardItem[] = [
  { id: '1', name: 'Tito', points: 1200, icon: '👑', streak: 7, rankChange: 'up' },
  { id: '2', name: 'Chernet', points: 1100, icon: '🥈', streak: 5, rankChange: 'same' },
  { id: '3', name: 'Charlie', points: 1000, icon: '🥉', streak: 4, isCurrentUser: true, rankChange: 'down' },
  { id: '4', name: 'Jeff', points: 900, icon: '💫', streak: 3, rankChange: 'up' },
  { id: '5', name: 'Florence', points: 800, icon: '⭐', streak: 2, rankChange: 'same' },
  { id: '6', name: 'Laure', points: 750, icon: '🔥', streak: 6, rankChange: 'up' },
  { id: '7', name: 'Ali Noble', points: 700, icon: '✨', streak: 4, rankChange: 'down' },
  { id: '8', name: 'Issaka', points: 650, icon: '🌟', streak: 3, rankChange: 'same' },
  { id: '9', name: 'Khaleelullah', points: 600, icon: '💎', streak: 5, rankChange: 'up' },
  { id: '10', name: 'Julia', points: 550, icon: '🏆', streak: 2, rankChange: 'down' },
];

const { width } = Dimensions.get('window');

export default function Leaderboard() {
  const [firstName, setFirstName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardItem[]>(data);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Promise.all([
      fetchUserProfile(),
      fetchLeaderboardData()
    ])
    .finally(() => {
      setRefreshing(false);
    });
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      // In a real implementation, you would fetch the latest leaderboard data from Supabase here
      // For now, we'll just use the static data
      setLeaderboardData([...data]);
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Fetch the user's profile from your profiles table
        const { data: profile, error } = await supabase
          .from('profiles')  // Use your actual table name
          .select('first_name')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
        } else if (profile && profile.first_name) {
          setFirstName(profile.first_name);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
          <Text style={styles.name}>
            {item.isCurrentUser ? firstName : item.name}
          </Text>
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
        data={leaderboardData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#7C00FE']}
            tintColor="#7C00FE"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#7C00FE',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 6,
  },
  list: {
    padding: 16,
    paddingTop: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 8,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(124, 0, 254, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7C00FE',
  },
  icon: {
    fontSize: 30,
    marginRight: 16,
  },
  details: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    letterSpacing: 0.2,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  points: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#7C00FE',
    marginRight: 12,
  },
  streakContainer: {
    backgroundColor: 'rgba(255, 69, 0, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  streakText: {
    fontSize: 12,
    color: '#FF4500',
    fontWeight: '600',
  },
  progressBar: {
    height: 5,
    backgroundColor: '#e2e8f0',
    borderRadius: 8,
    width: '100%',
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#7C00FE',
    borderRadius: 8,
  },
  currentUserItem: {
    borderWidth: 2,
    borderColor: '#7C00FE',
  },
  youBadge: {
    backgroundColor: '#7C00FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginLeft: 10,
    shadowColor: '#7C00FE',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  youText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  rankUp: {
    color: '#10b981',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  rankDown: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  rankSame: {
    color: '#94a3b8',
    fontSize: 16,
    marginLeft: 6,
  },
});