import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSession } from '@/app/_layout';
import { LearningService, Course } from '@/services/LearningService';

export default function LearnHomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { session } = useSession();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch courses dynamically from Supabase using your LearningService
  const fetchCourses = async () => {
    if (!session?.user?.id) return;
    try {
      setLoading(true);
      const fetchedCourses = await LearningService.getUserCourses(session.user.id);
      setCourses(fetchedCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      Alert.alert('Error', 'Failed to load courses. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [session]);

  const handleCoursePress = (courseId: string) => {
    router.push({
      pathname: '/(tabs)/(learn)/course-details',
      params: { id: courseId },
    } as any);
  };

  const renderCourseItem = ({ item }: { item: Course }) => (
    <TouchableOpacity
      style={styles.courseCard}
      onPress={() => handleCoursePress(item.id)}
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
                { width: `${item.progress}%`, backgroundColor: item.color },
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
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
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
          onPress={() =>
            router.push({
              pathname: '/(tabs)/(learn)/leaderboard',
            } as any)
          }
        >
          <Feather name="award" size={20} color="#7C00FE" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={courses}
        renderItem={renderCourseItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.coursesList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchCourses}
            colors={['#7C00FE']}
            tintColor="#7C00FE"
          />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Feather name="book-open" size={60} color="#CCCCCC" />
            <Text style={styles.emptyText}>No courses available</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
});
