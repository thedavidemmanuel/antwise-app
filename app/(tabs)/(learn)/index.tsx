import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { useSession } from '@/app/_layout';
import { Feather } from '@expo/vector-icons';
import { LearningService, Course as CourseType, UserLearningStats, Lesson } from '@/services/LearningService';
import MyCourses from '@/components/learn/MyCourses';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFire } from '@fortawesome/free-solid-svg-icons';

const LearnScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { session } = useSession();
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [stats, setStats] = useState<UserLearningStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [streakNeedsToday, setStreakNeedsToday] = useState(false);
  const [nextCourseXP, setNextCourseXP] = useState(0);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);

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

      // Fetch all lessons for all courses
      const lessonsPromises = fetchedCourses.map(course => 
        LearningService.getCourseLessons(course.id, session.user.id)
      );
      const lessonsResults = await Promise.all(lessonsPromises);
      const allFetchedLessons = lessonsResults.flat();
      setAllLessons(allFetchedLessons);

      // Calculate XP needed for next course
      calculateNextCourseXP(fetchedCourses, allFetchedLessons, fetchedStats);
    } catch (err) {
      console.error('Error fetching learn data:', err);
      Alert.alert('Error', 'Failed to load learning content. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Calculate XP needed for next course
  const calculateNextCourseXP = (
    fetchedCourses: CourseType[], 
    fetchedLessons: Lesson[], 
    fetchedStats: UserLearningStats
  ) => {
    // Sort courses by order_number (1 to 9)
    const sortedCourses = [...fetchedCourses].sort((a, b) => {
      const orderA = typeof a.order_number === 'number' ? a.order_number : Number.MAX_SAFE_INTEGER;
      const orderB = typeof b.order_number === 'number' ? b.order_number : Number.MAX_SAFE_INTEGER;
      return orderA - orderB;
    });
    
    // Find the first incomplete course
    const currentCourseIndex = sortedCourses.findIndex(course => course.progress < 100);
    
    if (currentCourseIndex === -1 || currentCourseIndex === sortedCourses.length - 1) {
      // All courses completed or last course is in progress
      setNextCourseXP(0);
      return;
    }
    
    const currentCourse = sortedCourses[currentCourseIndex];
    const nextCourse = sortedCourses[currentCourseIndex + 1];
    
    // Sum XP rewards for all incomplete lessons in current course
    const incompleteLessons = fetchedLessons.filter(
      lesson => lesson.course_id === currentCourse.id && !lesson.completed
    );
    
    const xpNeededForCompletion = incompleteLessons.reduce(
      (sum, lesson) => sum + (lesson.xp_reward || 0), 
      0
    );
    
    setNextCourseXP(xpNeededForCompletion);
  };

  // Initial data load
  useEffect(() => {
    fetchData();
  }, [session]);

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchData();
      return () => {}; // cleanup function
    }, [session])
  );

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

  // Get numeric level (1, 2, 3) based on completed courses
  const getNumericLevel = (): number => {
    if (!courses || courses.length === 0) return 1;
    
    // Get the highest level course that has progress
    const coursesByLevel = courses
      .filter(course => course.progress > 0)
      .sort((a, b) => {
        const levelMap: {[key: string]: number} = {
          'beginner': 1,
          'intermediate': 2, 
          'advanced': 3
        };
        return (levelMap[b.level.toLowerCase()] || 0) - (levelMap[a.level.toLowerCase()] || 0);
      });
    
    if (coursesByLevel.length === 0) return 1;
    
    const highestLevelCourse = coursesByLevel[0];
    const levelMap: {[key: string]: number} = {
      'beginner': 1,
      'intermediate': 2, 
      'advanced': 3
    };
    
    return levelMap[highestLevelCourse.level.toLowerCase()] || 1;
  };

  const { level: xpLevel, currentXP, nextLevelXP } = getLevelInfo();
  const numericLevel = getNumericLevel();

  // Navigate to course details and check lesson access
  const handleCoursePress = async (courseId: string) => {
    if (!session?.user?.id) return;
    
    try {
      // Get all courses sorted by order_number (1 to 9)
      const sortedCourses = [...courses].sort((a, b) => {
        const orderA = typeof a.order_number === 'number' ? a.order_number : Number.MAX_SAFE_INTEGER;
        const orderB = typeof b.order_number === 'number' ? b.order_number : Number.MAX_SAFE_INTEGER;
        return orderA - orderB;
      });
      
      // Find current course index
      const currentCourseIndex = sortedCourses.findIndex(course => course.id === courseId);
      
      // Check if previous courses are completed
      const previousCoursesCompleted = sortedCourses
        .slice(0, currentCourseIndex)
        .every(course => course.progress === 100);
      
      if (!previousCoursesCompleted && currentCourseIndex > 0) {
        Alert.alert(
          'Course Locked', 
          'You need to complete the previous courses before accessing this one.'
        );
        return;
      }
      
      // Fetch lessons for the course
      const lessons = await LearningService.getCourseLessons(courseId, session.user.id);
      
      // Sort lessons by order_number
      const sortedLessons = lessons.sort((a, b) => a.order_number - b.order_number);
      
      // Find the first incomplete lesson
      const firstIncompleteLessonIndex = sortedLessons.findIndex(lesson => !lesson.completed);
      
      router.push({
        pathname: '/(tabs)/(learn)/course-details',
        params: { 
          id: courseId,
          firstIncompleteLessonIndex: firstIncompleteLessonIndex !== -1 ? firstIncompleteLessonIndex : 0
        }
      } as any);
    } catch (err) {
      console.error('Error navigating to course:', err);
      Alert.alert('Error', 'Failed to load course details. Please try again.');
    }
  };

  // Navigate to leaderboard
  const handleLeaderboardPress = () => {
    router.push({
      pathname: '/(tabs)/(learn)/leaderboard'
    } as any);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7C00FE" />
        </View>
      </SafeAreaView>
    );
  }

  // Calculate XP progress percentage for next course
  const xpProgressPercentage = nextCourseXP > 0 
    ? Math.min(100, (stats?.total_xp || 0) / (nextCourseXP + (stats?.total_xp || 0)) * 100)
    : 100;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.streakBanner}>
        <View style={styles.streakIconContainer}>
          <FontAwesomeIcon icon={faFire} size={35} color="#FFFFFF" />
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

      <View style={styles.xpContainer}>
        <View style={styles.xpHeader}>
          <Text style={styles.xpTitle}>Total XP</Text>
          <Text style={styles.xpAmount}>{stats?.total_xp || 0} XP</Text>
        </View>
        <View style={styles.xpProgressBar}>
          <View 
            style={[
              styles.xpProgress, 
              { width: `${xpProgressPercentage}%` }
            ]} 
          />
        </View>
        <Text style={styles.xpNeeded}>
          {nextCourseXP > 0 
            ? `${nextCourseXP} XP needed for next course` 
            : 'You are ready for the next course!'}
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{`${numericLevel}/3`}</Text>
          <Text style={styles.statLabel}>Level</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats?.total_xp || 0}</Text>
          <Text style={styles.statLabel}>XP Points</Text>
        </View>
        <View style={styles.statCard}>
          {/* Changed to display completed/total courses */}
          <Text style={styles.statValue}>{`${courses.filter(course => course.progress === 100).length}/${courses.length}`}</Text>
          <Text style={styles.statLabel}>Courses</Text>
        </View>
      </View>
      
      <MyCourses
        courses={courses}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onCoursePress={handleCoursePress}
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
    fontSize: 20,
    fontWeight: '700',
    color: '#7C00FE',
    marginBottom: 4,
    textAlign: 'center',
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