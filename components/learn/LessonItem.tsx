import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Lesson } from '@/services/LearningService';

type LessonItemProps = {
  lesson: Lesson;
  index: number;
  onPress: (lesson: Lesson, index: number) => void;
  isLocked: boolean;
};

const LessonItem: React.FC<LessonItemProps> = ({ lesson, index, onPress, isLocked }) => {
  return (
    <TouchableOpacity
      style={[styles.lessonItem, lesson.completed && styles.completedLesson]}
      onPress={() => onPress(lesson, index)}
      disabled={isLocked}
      activeOpacity={0.8}
    >
      <View style={styles.lessonNumber}>
        <Text style={styles.lessonNumberText}>{index + 1}</Text>
      </View>
      
      <View style={styles.lessonContent}>
        <Text style={styles.lessonTitle}>{lesson.title}</Text>
        <Text style={styles.lessonDescription} numberOfLines={2}>{lesson.description}</Text>
        
        <View style={styles.lessonMeta}>
          <Text style={styles.xpReward}>+{lesson.xp_reward} XP</Text>
          
          {lesson.completed ? (
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

const styles = StyleSheet.create({
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
});

export default LessonItem;
