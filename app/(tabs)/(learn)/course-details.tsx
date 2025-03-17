import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  RefreshControl
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSession } from '@/app/_layout';
import { Feather } from '@expo/vector-icons';
import { LearningService, Course, Lesson } from '@/services/LearningService';

const CourseDetailsScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { session } = useSession();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch course details and lessons
  const fetchCourseDetails = async () => {
    if (!session?.user?.id || !id) return;

    try {
      setLoading(true);
      
      // Fetch all courses to find this one
      const allCourses = await LearningService.getUserCourses(session.user.id);
      const thisCourse = allCourses.find(c => c.id === id);
      
      if (!thisCourse) {
        Alert.alert('Error', 'Course not found');
        router.back(); // Use router.back() to respect navigation history
        return;
      }
      
      setCourse(thisCourse);
      
      // Fetch lessons for this course
      const courseLessons = await LearningService.getCourseLessons(id, session.user.id);
      setLessons(courseLessons);
      
    } catch (err) {
      console.error('Error fetching course details:', err);
      Alert.alert('Error', 'Failed to load course details. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCourseDetails();
  }, [session, id]);

  // Handle pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchCourseDetails();
  };

  // Navigate to lesson
  const handleLessonPress = (lesson: Lesson, index: number) => {
    // If previous lessons are not completed, don't allow proceeding
    const previousIncomplete = lessons
      .slice(0, index)
      .some(prevLesson => !prevLesson.completed);
    
    if (previousIncomplete && !lesson.completed) {
      Alert.alert(
        'Complete Previous Lessons',
        'Please complete the previous lessons before proceeding.'
      );
      return;
    }
    
    router.push({
      pathname: '/(tabs)/(learn)/lesson',
      params: { 
        courseId: id, 
        lessonId: lesson.id,
        index: index.toString()
      }
    } as any);
  };

  // Render a lesson item
  const renderLessonItem = ({ item, index }: { item: Lesson; index: number }) => {
    // Check if previous lessons are completed
    const isLocked = lessons
      .slice(0, index)
      .some(prevLesson => !prevLesson.completed) && !item.completed;
    
    return (
      <TouchableOpacity
        style={[styles.lessonItem, item.completed && styles.completedLesson]}
        onPress={() => handleLessonPress(item, index)}
        disabled={isLocked}
        activeOpacity={0.8}
      >
        <View style={styles.lessonNumber}>
          <Text style={styles.lessonNumberText}>{index + 1}</Text>
        </View>
        
        <View style={styles.lessonContent}>
          <Text style={styles.lessonTitle}>{item.title}</Text>
          <Text style={styles.lessonDescription} numberOfLines={2}>{item.description}</Text>
          
          <View style={styles.lessonMeta}>
            <Text style={styles.xpReward}>+{item.xp_reward} XP</Text>
            
            {item.completed ? (
              <View style={styles.completedBadge}>
                <Feather name="check" size={14} color="#FFFFFF" />
                <Text style={styles.completedText}>Completed</Text>
              </View>
            ) : isLocked ? (
              <View style={styles.lockedBadge}>
                <Feather name="lock" size={14} color="#FFFFFF" />
                <Text style={styles.lockedText}>Locked</Text>
              </View>
            ) : (
              <View style={styles.startButton}>
                <Text style={styles.startButtonText}>Start</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen
          options={{
            headerTitle: 'Course Details',
            headerShown: true,
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
                <Feather name="arrow-left" size={24} color="#333" />
              </TouchableOpacity>
            ),
          }}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7C00FE" />
        </View>
      </SafeAreaView>
    );
  }

  if (!course) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen
          options={{
            headerTitle: 'Course Details',
            headerShown: true,
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
                <Feather name="arrow-left" size={24} color="#333" />
              </TouchableOpacity>
            ),
          }}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Course not found</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: course.title,
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
              <Feather name="arrow-left" size={24} color="#333" />
            </TouchableOpacity>
          ),
        }}
      />
      
      <FlatList
        data={lessons}
        renderItem={renderLessonItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() => (
          <View style={styles.courseHeader}>
            <View style={[styles.courseIconContainer, { backgroundColor: `${course.color}20` }]}>
              <Feather name={course.icon as any} size={36} color={course.color} />
            </View>
            
            <Text style={styles.courseTitle}>{course.title}</Text>
            <Text style={styles.courseDescription}>{course.description}</Text>
            
            <View style={styles.courseStatsContainer}>
              <View style={styles.courseStat}>
                <Text style={styles.courseStatValue}>{course.lessons}</Text>
                <Text style={styles.courseStatLabel}>Lessons</Text>
              </View>
              
              <View style={styles.courseStat}>
                <Text style={styles.courseStatValue}>{course.level}</Text>
                <Text style={styles.courseStatLabel}>Level</Text>
              </View>
              
              <View style={styles.courseStat}>
                <Text style={styles.courseStatValue}>{course.progress}%</Text>
                <Text style={styles.courseStatLabel}>Completed</Text>
              </View>
            </View>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${course.progress}%`, backgroundColor: course.color }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                {course.completed_lessons}/{course.lessons} lessons completed
              </Text>
            </View>
            
            <Text style={styles.lessonsSectionHeader}>Lessons</Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#7C00FE"]}
            tintColor="#7C00FE"
          />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Feather name="book" size={50} color="#CCCCCC" />
            <Text style={styles.emptyText}>No lessons found for this course</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#7C00FE',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  courseHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  courseIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  courseTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  courseDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  courseStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  courseStat: {
    alignItems: 'center',
  },
  courseStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#7C00FE',
    marginBottom: 4,
  },
  courseStatLabel: {
    fontSize: 14,
    color: '#666',
  },
  progressContainer: {
    width: '100%',
    marginBottom: 30,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  lessonsSectionHeader: {
    alignSelf: 'flex-start',
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  lessonItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  completedLesson: {
    borderColor: '#7C00FE',
    borderWidth: 1,
  },
  lessonNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#7C00FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  lessonNumberText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  lessonContent: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  lessonDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  lessonMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  xpReward: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7C00FE',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CD964',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  completedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  lockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#999',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  lockedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  startButton: {
    backgroundColor: '#7C00FE',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
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
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
});

export default CourseDetailsScreen;