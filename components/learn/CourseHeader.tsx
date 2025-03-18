import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Course } from '@/services/LearningService';

type CourseHeaderProps = {
  course: Course;
  courseIcon: any;
};

const CourseHeader: React.FC<CourseHeaderProps> = ({ course, courseIcon }) => {
  return (
    <View style={styles.courseHeader}>
      <View style={[styles.courseIconContainer, { backgroundColor: `${course.color}20` }]}>
        <FontAwesomeIcon icon={courseIcon} size={36} color={course.color} />
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
  );
};

const styles = StyleSheet.create({
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
});

export default CourseHeader;
