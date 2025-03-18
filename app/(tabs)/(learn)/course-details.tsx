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
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faScaleBalanced,
  faMoneyBillTrendUp,
  faLandmark,
  faSackDollar,
  faHandHoldingUsd,
  faCoins,
  faBitcoinSign,
  faShieldHalved,
  faHouseChimneyUser
} from '@fortawesome/free-solid-svg-icons';

// Import newly created components
import CourseHeader from '@/components/learn/CourseHeader';
import LessonItem from '@/components/learn/LessonItem';
import EmptyLessons from '@/components/learn/EmptyLessons';
import ErrorMessage from '@/components/ErrorMessage';

const CourseDetailsScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { session } = useSession();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [courseIcon, setCourseIcon] = useState<any>(null);

  // Fetch course details and lessons
  const fetchCourseDetails = async () => {
    if (!session?.user?.id || !id) return;

    try {
      setLoading(true);
      
      // Fetch all courses to find this one
      const allCourses = await LearningService.getUserCourses(session.user.id);
      // Compute icon from sorted courses (same logic as MyCourses)
      const sortedCourses = [...allCourses].sort((a, b) => {
        const orderA = typeof a.order_number === 'number' ? a.order_number : Number.MAX_SAFE_INTEGER;
        const orderB = typeof b.order_number === 'number' ? b.order_number : Number.MAX_SAFE_INTEGER;
        return orderA - orderB;
      });
      const courseIndex = sortedCourses.findIndex(c => c.id === id);
      const iconsArray = [faScaleBalanced, faMoneyBillTrendUp, faLandmark, faSackDollar, faHandHoldingUsd, faCoins, faBitcoinSign, faShieldHalved, faHouseChimneyUser];
      const computedIcon = courseIndex !== -1 ? iconsArray[courseIndex % iconsArray.length] : faScaleBalanced;
      setCourseIcon(computedIcon);
      
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

  // Automatically refresh when returning to this screen
  useFocusEffect(
    React.useCallback(() => {
      fetchCourseDetails();
    }, [session, id])
  );

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

  // Check if a lesson is locked
  const isLessonLocked = (index: number): boolean => {
    return lessons
      .slice(0, index)
      .some(prevLesson => !prevLesson.completed) && !lessons[index].completed;
  };

  // Render a lesson item using the new component
  const renderLessonItem = ({ item, index }: { item: Lesson; index: number }) => {
    return (
      <LessonItem 
        lesson={item} 
        index={index} 
        onPress={handleLessonPress}
        isLocked={isLessonLocked(index)}
      />
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
        <ErrorMessage 
          message="Course not found" 
          onPress={() => router.back()}
        />
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
          <CourseHeader course={course} courseIcon={courseIcon} />
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
        ListEmptyComponent={EmptyLessons}
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
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
});

export default CourseDetailsScreen;