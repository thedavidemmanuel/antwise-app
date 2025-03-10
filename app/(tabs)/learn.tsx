import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

// Dummy data for courses
const courses = [
  {
    id: '1',
    title: 'Budgeting Basics',
    description: 'Learn the fundamentals of creating and maintaining a budget',
    progress: 75,
    lessons: 8,
    completedLessons: 6,
    level: 'Beginner',
    color: '#7C00FE',
    icon: 'bar-chart-2',
  },
  {
    id: '2',
    title: 'Saving Strategies',
    description: 'Effective ways to save money and reach your financial goals',
    progress: 40,
    lessons: 6,
    completedLessons: 2,
    level: 'Intermediate',
    color: '#34C759',
    icon: 'trending-up',
  },
  {
    id: '3',
    title: 'Investing 101',
    description: 'Introduction to different investment options and strategies',
    progress: 10,
    lessons: 10,
    completedLessons: 1,
    level: 'Advanced',
    color: '#FF9500',
    icon: 'pie-chart',
  },
];

// Dummy data for financial tips
const tips = [
  {
    id: '1',
    title: '50/30/20 Rule',
    description: 'Allocate 50% for needs, 30% for wants, and 20% for savings',
    icon: 'divide',
  },
  {
    id: '2',
    title: 'Emergency Fund',
    description: 'Save 3-6 months of expenses for unexpected situations',
    icon: 'shield',
  },
  {
    id: '3',
    title: 'Auto-Save',
    description: 'Set up automatic transfers to your savings account',
    icon: 'clock',
  },
];

export default function LearnScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const renderCourseItem = ({ item }: { item: typeof courses[0] }) => (
    <TouchableOpacity
      style={styles.courseCard}
      onPress={() => router.push(`/learn/${item.id}` as any)} // updated cast
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
              {item.completedLessons}/{item.lessons} Lessons
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
            onPress={() => router.push(`/learn/${item.id}` as any)} // updated cast
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderTipItem = ({ item }: { item: typeof tips[0] }) => (
    <View style={styles.tipCard}>
      <View style={styles.tipIconContainer}>
        <Feather name={item.icon as any} size={20} color="#7C00FE" />
      </View>
      <View style={styles.tipContent}>
        <Text style={styles.tipTitle}>{item.title}</Text>
        <Text style={styles.tipDescription}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { marginTop: insets.top }]}>
        <Text style={styles.headerTitle}>Financial Education</Text>
        <TouchableOpacity
          style={styles.leaderboardButton}
          onPress={() => router.push('/learn/leaderboard' as any)} // updated cast
        >
          <Feather name="award" size={20} color="#7C00FE" />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Courses</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>9</Text>
            <Text style={styles.statLabel}>Lessons</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>450</Text>
            <Text style={styles.statLabel}>XP Points</Text>
          </View>
        </View>
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Courses</Text>
          <TouchableOpacity onPress={() => console.log('View all courses')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={courses}
          renderItem={renderCourseItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.coursesList}
          scrollEnabled={false}
        />
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Financial Tips</Text>
          <TouchableOpacity onPress={() => console.log('View all tips')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={tips}
          renderItem={renderTipItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tipsList}
        />
        
        <TouchableOpacity 
          style={styles.quizBanner}
          onPress={() => console.log('Start daily quiz')}
        >
          <View style={styles.quizBannerContent}>
            <Feather name="help-circle" size={24} color="#FFFFFF" />
            <View style={styles.quizBannerText}>
              <Text style={styles.quizBannerTitle}>Daily Financial Quiz</Text>
              <Text style={styles.quizBannerDescription}>
                Test your knowledge and earn XP points
              </Text>
            </View>
          </View>
          <Feather name="chevron-right" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
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
  viewAllText: {
    fontSize: 14,
    color: '#7C00FE',
  },
  coursesList: {
    paddingHorizontal: 20,
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
  tipsList: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  tipCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    width: 200,
    marginRight: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  tipIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(124, 0, 254, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  tipDescription: {
    fontSize: 14,
    color: '#666666',
  },
  quizBanner: {
    backgroundColor: '#7C00FE',
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quizBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quizBannerText: {
    marginLeft: 12,
  },
  quizBannerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  quizBannerDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
});