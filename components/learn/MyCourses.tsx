import React, { useMemo } from 'react';
import { FlatList, TouchableOpacity, View, Text, StyleSheet, RefreshControl } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faScaleBalanced, faMoneyBillTrendUp, faLandmark, faSackDollar, faHandHoldingUsd, faCoins, faBitcoinSign, faShieldHalved, faHouseChimneyUser} from '@fortawesome/free-solid-svg-icons';
import { Feather } from '@expo/vector-icons';
import { Course as CourseType } from '@/services/LearningService';

type MyCoursesProps = {
  courses: CourseType[];
  onCoursePress: (courseId: string) => void;
  refreshing: boolean;
  onRefresh: () => void;
};

const MyCourses: React.FC<MyCoursesProps> = ({ courses, onCoursePress, refreshing, onRefresh }) => {
  const icons = [faScaleBalanced, faMoneyBillTrendUp, faLandmark, faSackDollar, faHandHoldingUsd, faCoins, faBitcoinSign, faShieldHalved, faHouseChimneyUser];

  // Sort courses by order_number (1 to 9)
  const sortedCourses = useMemo(() => {
    return [...courses].sort((a, b) => {
      const orderA = typeof a.order_number === 'number' ? a.order_number : Number.MAX_SAFE_INTEGER;
      const orderB = typeof b.order_number === 'number' ? b.order_number : Number.MAX_SAFE_INTEGER;
      return orderA - orderB;
    });
  }, [courses]);

  const renderCourseItem = ({ item }: { item: CourseType }) => {
    const courseIndex = sortedCourses.findIndex(c => c.id === item.id);
    const icon = icons[courseIndex % icons.length];
    
    // Improved locking logic: a course is locked if any course with a lower order_number is incomplete
    const isLocked = item.order_number !== undefined
      ? sortedCourses.some(c =>
          c.order_number !== undefined &&
          item.order_number !== undefined &&
          c.order_number < item.order_number &&
          c.progress < 100
        )
      : sortedCourses.slice(0, courseIndex).some(c => c.progress < 100);
      
    return (
      <TouchableOpacity
        style={[styles.courseCard, isLocked && styles.lockedCourseCard]}
        onPress={() => onCoursePress(item.id)}
        disabled={isLocked}
        activeOpacity={0.9}
      >
        <View style={styles.courseContent}>
          <View style={styles.headerRow}>
            <View style={[styles.courseIconContainer, { backgroundColor: `${item.color}20` }]}>
              <FontAwesomeIcon icon={icon} size={24} color={item.color} />
            </View>
            <Text style={styles.courseTitle} numberOfLines={1}>
              {item.title}
            </Text>
          </View>
          
          <Text style={styles.courseSubtitle} numberOfLines={2}>
            {item.description}
          </Text>
          
          <View style={styles.courseProgressContainer}>
            <View style={styles.courseProgressInfo}>
              <Text style={styles.courseProgressText}>
                {item.completed_lessons}/{item.lessons} Lessons
              </Text>
              <Text style={styles.courseProgressPercent}>{item.progress}%</Text>
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
            <View style={styles.levelBadge}>
              <Text style={[styles.levelText, { color: item.color }]}>
                {item.level}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.continueButton, { backgroundColor: isLocked ? '#999' : item.color }]}
              onPress={() => { if (!isLocked) onCoursePress(item.id) }}
              disabled={isLocked}
            >
              <Text style={styles.continueButtonText}>
                {isLocked
                  ? 'Locked'
                  : item.progress === 0
                  ? 'Start'
                  : item.progress === 100
                  ? 'Review'
                  : 'Continue'}
              </Text>
            </TouchableOpacity>
          </View>
          
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={sortedCourses} // Use sorted courses
      renderItem={renderCourseItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.coursesList}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#7C00FE']} tintColor="#7C00FE" />
      }
      ListEmptyComponent={() => (
        <View style={styles.listEmptyContainer}>
          <Feather name="book-open" size={60} color="#CCCCCC" />
          <Text style={styles.listEmptyTitle}>No courses yet</Text>
          <Text style={styles.listEmptyText}>Check back soon for new financial education content</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  coursesList: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  courseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    flexDirection: 'column',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  courseContent: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center', 
    marginBottom: 8,
  },
  courseIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContentContainer: {
    flex: 1, // Take remaining width
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
  },
  courseSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
    paddingLeft: 0, // Remove padding so it aligns with progress bar
  },
  courseProgressContainer: {
    marginBottom: 12,
    marginLeft: 0, // Remove the left margin
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
    justifyContent: 'space-between', // adjusts alignment: level badge left, button right
    alignItems: 'center',
    marginLeft: 0, // Remove the left margin
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
  lockedCourseCard: {
    opacity: 0.8,
    borderColor: '#999',
    borderWidth: 1,
  },
  lockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#999',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12, // Match the levelBadge borderRadius
  },
  lockedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default MyCourses;
