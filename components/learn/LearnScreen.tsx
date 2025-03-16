import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSession } from '@/app/_layout';
import { Feather } from '@expo/vector-icons';
import { LearningService, Course as CourseType, UserLearningStats } from '@/services/LearningService';

const LearnScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { session } = useSession();
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [stats, setStats] = useState<UserLearningStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [streakNeedsToday, setStreakNeedsToday] = useState(false);

  const fetchData = async () => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);
      
      // Fetch courses and stats in parallel
      const [fetchedCourses, fetchedStats, streakStatus] = await Promise.all([
        LearningService.getUserCourses(session.user.id),
        LearningService.getUserLearningStats(session.user.id),
        LearningService.checkStreakStatus(session.user.id)
      ]);
      
      setCourses(fetchedCourses);
      setStats(fetchedStats);
      setStreakNeedsToday(streakStatus.needsToday);
    } catch (err) {
      console.error('Error fetching learn data:', err);
      Alert.alert('Error', 'Failed to load learning content. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchData();
  }, [session]);

  // Handle pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // Get level info based on XP
  const getLevelInfo = () => {
    if (!stats) return { level: 1, currentXP: 0, nextLevelXP: 100 };
    return LearningService.getLevelInfo(stats.total_xp);
  };

  const { level, currentXP, nextLevelXP } = getLevelInfo();
  const xpNeeded = nextLevelXP - currentXP;

  // Navigate to course details
  const handleCoursePress = (courseId: string) => {
    router.push({
      pathname: '/(tabs)/(learn)/course-details',
      params: { id: courseId }
    } as any);
  };

  // Navigate to leaderboard
  const handleLeaderboardPress = () => {
    router.push({
      pathname: '/(tabs)/(learn)/leaderboard'
    } as any);
  };

  // Render a course item
  const renderCourseItem = ({ item }: { item: CourseType }) => {
    // If order_number is not defined, use the natural order in the list
    // This handles courses without explicit ordering
    const courseIndex = courses.findIndex(c => c.id === item.id);
    const isLocked = item.order_number !== undefined ? 
      // If order_number exists, use it for sequential unlocking
      courses.some(c => 
        c.order_number !== undefined && 
        item.order_number !== undefined &&
        c.order_number < item.order_number && 
        c.progress < 100
      ) : 
      // Otherwise check if any previous course in the list is incomplete
      courses.slice(0, courseIndex).some(c => c.progress < 100);

    return (
      <TouchableOpacity
        style={styles.courseCard}
        onPress={() => handleCoursePress(item.id)}
        disabled={isLocked}
        activeOpacity={0.9}
      >
        <View style={[styles.courseIconContainer, { backgroundColor: `${item.color}20` }]}>
          <Feather name={item.icon as any} size={24} color={item.color} />
        </View>
        
        <View style={styles.courseContent}>
          <Text style={styles.courseTitle}>{item.title}</Text>
          <Text style={styles.courseDescription} numberOfLines={2}>
            {item.description}
          </Text>
          
          <View style={styles.courseProgressContainer}>
            <View style={styles.courseProgressInfo}>
              <Text style={styles.courseProgressText}>
                {item.completed_lessons}/{item.lessons} Lessons
              </Text>
              <Text style={styles.courseProgressPercent}>
                {item.progress}%
              </Text>
            </View>
            
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { 
                    width: `${item.progress}%`,
                    backgroundColor: item.color,
                  }
                ]} 
              />
            </View>
          </View>
          
          <View style={styles.courseMeta}>
            <View style={[styles.levelBadge, { backgroundColor: `${item.color}20` }]}>
              <Text style={[styles.levelText, { color: item.color }]}>{item.level}</Text>
            </View>
            
            <TouchableOpacity 
              style={[styles.continueButton, { backgroundColor: item.color }]}
              onPress={() => handleCoursePress(item.id)}
            >
              <Text style={styles.continueButtonText}>
                {item.progress === 0 ? 'Start' : 
                 item.progress === 100 ? 'Review' : 'Continue'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Financial Education</Text>
          <TouchableOpacity
            style={styles.leaderboardButton}
            onPress={handleLeaderboardPress}
          >
            <Feather name="award" size={20} color="#7C00FE" />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7C00FE" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { marginTop: insets.top }]}>
        <Text style={styles.headerTitle}>Financial Education</Text>
        <TouchableOpacity
          style={styles.leaderboardButton}
          onPress={handleLeaderboardPress}
        >
          <Feather name="award" size={20} color="#7C00FE" />
        </TouchableOpacity>
      </View>
      
      <FlatList
        ListHeaderComponent={() => (
          <>
            {/* Streak Banner */}
            <View style={styles.streakBanner}>
              <View style={styles.streakIconContainer}>
                <Feather name="zap" size={24} color="#FFFFFF" />
                <Text style={styles.streakNumber}>{stats?.streak_days || 0}</Text>
              </View>
              <View style={styles.streakInfo}>
                <Text style={styles.streakText}>
                  {stats?.streak_days ? `${stats.streak_days} day streak!` : 'Start your streak today!'}
                </Text>
                <Text style={styles.streakSubtext}>
                  {streakNeedsToday 
                    ? "You're on fire! Keep learning to maintain your streak" 
                    : "You've completed today's learning! Come back tomorrow"}
                </Text>
              </View>
            </View>

            {/* XP Progress */}
            <View style={styles.xpContainer}>
              <View style={styles.xpHeader}>
                <Text style={styles.xpTitle}>Total XP</Text>
                <Text style={styles.xpAmount}>{stats?.total_xp || 0} XP</Text>
              </View>
              <View style={styles.xpProgressBar}>
                <View 
                  style={[
                    styles.xpProgress, 
                    { width: `${(currentXP / nextLevelXP) * 100}%` }
                  ]} 
                />
              </View>
              <Text style={styles.xpNeeded}>
                {xpNeeded} XP needed for next level
              </Text>
            </View>

            {/* Stats Cards */}
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{level}</Text>
                <Text style={styles.statLabel}>Level</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{stats?.total_xp || 0}</Text>
                <Text style={styles.statLabel}>XP Points</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{courses.length}</Text>
                <Text style={styles.statLabel}>Courses</Text>
              </View>
            </View>
            
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Courses</Text>
            </View>
          </>
        )}
        data={courses}
        renderItem={renderCourseItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.coursesList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#7C00FE"]}
            tintColor="#7C00FE"
          />
        }
        ListEmptyComponent={() => (
          <View style={styles.listEmptyContainer}>
            <Feather name="book-open" size={60} color="#CCCCCC" />
            <Text style={styles.listEmptyTitle}>No courses yet</Text>
            <Text style={styles.listEmptyText}>
              Check back soon for new financial education content
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
  },
  leaderboardButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(124, 0, 254, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7C00FE',
    padding: 16,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
  },
  streakIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  streakNumber: {
    position: 'absolute',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  streakInfo: {
    flex: 1,
  },
  streakText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
  },
  streakSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  xpContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 16,
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  xpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  xpAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#7C00FE',
  },
  xpProgressBar: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    marginBottom: 8,
  },
  xpProgress: {
    height: '100%',
    backgroundColor: '#7C00FE',
    borderRadius: 4,
  },
  xpNeeded: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '30%',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#7C00FE',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  coursesList: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  courseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    flexDirection: 'row',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  courseIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  courseContent: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  courseDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
  },
  courseProgressContainer: {
    marginBottom: 12,
  },
  courseProgressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  courseProgressText: {
    fontSize: 12,
    color: '#666666',
  },
  courseProgressPercent: {
    fontSize: 12,
    color: '#7C00FE',
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  courseMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '500',
  },
  continueButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  continueButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  listEmptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  listEmptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  listEmptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
  },
});

export default LearnScreen;